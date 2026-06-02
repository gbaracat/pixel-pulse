
# Reestruturação Pixel Store — Plano em 5 Fases

A reestruturação é grande demais para um único deploy. Cada fase é independente, testável, e não quebra nada existente. Você aprova fase por fase.

---

## Visão geral

| Fase | Tema | Banco | Esforço |
|---|---|---|---|
| 1 | Home invertida + hub Retrô | — | Pequeno |
| 2 | Reviews + curtidas + comentários | 3 tabelas novas | Médio |
| 3 | Perfil expandido + listas customizadas | 2 tabelas + storage | Médio |
| 4 | Feed social + follows | 2 tabelas | Médio |
| 5 | Página de jogo enriquecida (dev/publisher/data) | — | Pequeno |

Mantém: identidade visual, layout base, auth atual, integração Steam, `game_lists`, sistema de trailers via Sheets.

---

## Fase 1 — Reorganização da Home e hub Retrô

**Objetivo:** inverter prioridade — moderno na Home, retrô em hub próprio.

- `src/routes/index.tsx`: passar `modernCategories` como conteúdo principal (Trending, Lançamentos, Modern AAA, Indie Gems, Competitivo). Hero com jogo moderno em destaque.
- Nova rota `src/routes/retro.tsx` — hub retrô completo: consoles clássicos, jogos retrô, mais influentes, pixel art, arcade. Reaproveita componentes `GameRow` e categorias `retroCategories` que já existem em `src/data/games.ts`.
- Navbar: adicionar link "Retrô" entre "Descobrir" e "Perfil".
- Pequena seção "Explore o Retrô →" na Home linkando para `/retro`.

Sem alterações de banco. Sem remoção de categoria.

---

## Fase 2 — Reviews, curtidas e comentários

**Banco (nova migration):**

```sql
-- reviews: 1 review por usuário por jogo (rating 0-10 + texto opcional)
CREATE TABLE public.reviews (
  id uuid PK,
  user_id uuid REFERENCES auth.users,
  game_id text NOT NULL,
  rating numeric(3,1) CHECK (rating >= 0 AND rating <= 10),
  body text,
  created_at, updated_at,
  UNIQUE(user_id, game_id)
);

CREATE TABLE public.review_likes (
  review_id uuid REFERENCES reviews ON DELETE CASCADE,
  user_id uuid,
  PRIMARY KEY (review_id, user_id)
);

CREATE TABLE public.review_comments (
  id uuid PK,
  review_id uuid REFERENCES reviews ON DELETE CASCADE,
  user_id uuid,
  body text NOT NULL,
  created_at
);
```

RLS: leitura pública; insert/update/delete só pelo dono. GRANTs para anon (SELECT) e authenticated (CRUD próprio).

**UI:**
- `src/components/ReviewForm.tsx` + `src/components/ReviewCard.tsx` (avatar, rating estrela, texto, botão curtir, contagem, comentários expansíveis).
- Página `/games/$id`: nova seção "Reviews da comunidade" com formulário (se logado) + lista.
- Nota média agregada exibida no header do jogo (substitui `enriched.rating` quando houver reviews suficientes).

---

## Fase 3 — Perfil expandido + listas customizadas

**Banco:**

```sql
ALTER TABLE profiles 
  ADD COLUMN banner_url text,
  ADD COLUMN favorite_game_ids text[] DEFAULT '{}';

CREATE TABLE public.user_lists (
  id uuid PK,
  user_id uuid,
  title text NOT NULL,
  description text,
  is_public boolean DEFAULT true,
  created_at, updated_at
);

CREATE TABLE public.user_list_items (
  list_id uuid REFERENCES user_lists ON DELETE CASCADE,
  game_id text NOT NULL,
  position int,
  added_at,
  PRIMARY KEY (list_id, game_id)
);
```

Storage bucket `banners` (público), mesma estrutura do `avatars`.

**UI — `src/routes/profile.tsx` redesenhado:**
- Banner editável (upload via Storage) + avatar sobreposto + bio editável.
- Bloco de stats: nº de reviews, jogos zerados, jogando, na wishlist, listas criadas, média de notas.
- Grid "Jogos Favoritos" (4 slots, escolhidos via picker).
- Aba "Listas" com CRUD de listas customizadas + página `/lists/$id` pública.
- Aba "Atividade Recente" (últimas 10 ações do usuário).

---

## Fase 4 — Feed social + follows

**Banco:**

```sql
CREATE TABLE public.follows (
  follower_id uuid,
  following_id uuid,
  created_at,
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id <> following_id)
);

CREATE TABLE public.activities (
  id uuid PK,
  user_id uuid,
  type text CHECK (type IN ('review','rating','favorite','completed','playing','wishlist','list_created')),
  game_id text,
  review_id uuid,
  list_id uuid,
  metadata jsonb,
  created_at
);
```

Triggers no Postgres geram `activities` automaticamente quando: review é criada, game_list muda, lista é criada.

**UI:**
- Rota `/feed` — feed dos usuários que você segue (fallback: feed global se segue 0).
- Aba "Global" / "Seguindo" no topo.
- Botão "Seguir" em `/users/$username` (nova rota de perfil público).
- Notificação simples no Navbar (contador de curtidas/comentários novos).

---

## Fase 5 — Página de jogo enriquecida

- Server fn que busca dados extras da RAWG já existente (`rawg.server.ts`): developer, publisher, release_date, ESRB, metacritic.
- Exibir esses campos numa sidebar estilo Letterboxd na `/games/$id`.
- Bloco "Quem está jogando" / "Recém-finalizado" baseado em `game_lists` + `activities` daquele jogo.
- Distribuição de notas (histograma 0–10) baseada em `reviews`.

---

## Detalhes técnicos transversais

- **Server functions** em `src/lib/reviews.functions.ts`, `lists.functions.ts`, `follows.functions.ts`, `activities.functions.ts` — todas com `requireSupabaseAuth` para mutations, leituras públicas via `supabaseAdmin` com WHERE explícito.
- **Hooks** em `src/hooks/use-reviews.ts`, `use-lists.ts`, `use-follows.ts`, `use-feed.ts` — TanStack Query com `useSuspenseQuery` no padrão do projeto.
- **Tipos** atualizados em `src/integrations/supabase/types.ts` automaticamente após cada migration.
- **Responsivo** mantido em todas as telas novas (grid → coluna em mobile).
- **Identidade visual**: continua usando tokens `neon-pink`, `neon-cyan`, `neon-purple`, `glow-pink`, `font-display`, `scanlines`. Zero mudança de paleta ou tipografia.

---

## Próximo passo

Aprovar este plano. Em seguida executo **Fase 1** (Home + hub Retrô) — é a mais rápida e dá resultado visível imediato. Depois seguimos para Fase 2 (reviews) que é o coração do "Letterboxd para games".
