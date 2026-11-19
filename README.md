# n8n Brasil

Diretório de templates n8n para negócios brasileiros. O site aponta a fonte do fluxo. Ele não republica o JSON de terceiros.

O nome do produto está em `SITE_NAME`, dentro de `src/lib/config.ts`.

## O que precisa para rodar

Node 22. Postgres via `DATABASE_URL` ou `POSTGRES_URL` (no Vercel, os dois costumam vir do Neon no Marketplace, no plano gratuito).

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Sem banco, as páginas abrem com a lista vazia. O build não depende do Postgres.

`data/seed.json` traz os templates conferidos, os itens pagos (`paid`, fora da listagem), as lacunas (`gaps`) e a metodologia. O seed grava `templates` como publicados e `paid` como não listados. Nada de JSON de workflow entra no repositório: o botão abre a `source_url`.

## Variáveis de ambiente

| Variável | Obrigatória | Para quê |
| --- | --- | --- |
| `DATABASE_URL` | uma das duas | Postgres. Neon e o script de migração leem esta. |
| `POSTGRES_URL` | uma das duas | Alternativa usada pelo Marketplace da Vercel. Se as duas existirem, `DATABASE_URL` ganha. |
| `ADMIN_TOKEN` | para a API admin | Bearer token. Sem ela, toda rota `/api/admin` responde 401. |
| `NEXT_PUBLIC_SITE_URL` | recomendada | URL canônica, sitemap e links da newsletter. Sem ela, cai em `http://localhost:3000`. |
| `RESEND_API_KEY` | não | Liga a lista e o e-mail de anúncio. Sem ela, o cadastro fica só no banco. |
| `RESEND_AUDIENCE_ID` | não | Audiência da Resend. Os dois (`RESEND_API_KEY` e este) precisam existir para inscrever o contato. |
| `OWNER_EMAIL` | não | Quem recebe o formulário de `/patrocinar`. |
| `NOTIFY_FROM` | não | Remetente verificado na Resend. O e-mail de anúncio só sai com `RESEND_API_KEY`, `OWNER_EMAIL` e `NOTIFY_FROM`. |

Copie `.env.example` para `.env`.

## Scripts

- `npm run dev` — site local
- `npm run build` / `npm start` — produção
- `npm run lint` — ESLint
- `npm test` — regras de e-mail, newsletter, filtro e mapeamento do seed
- `npm run db:migrate` — aplica `drizzle/0001_init.sql`
- `npm run db:seed` — carrega `data/seed.json`

## Páginas

- `/` — templates mais recentes, com busca e filtros
- `/t/[slug]` — ficha, com “Abrir template” apontando para a fonte
- `/categoria/[slug]` e `/integracao/[slug]` — páginas de busca
- `/enviar` — fila de revisão
- `/patrocinar` — números ao vivo e os dois preços, sem checkout
- `/go/[sponsor]` — redireciona e conta o clique

A barra do topo lê `sponsor_weeks` da semana corrente. Sem patrocinador, mostra “Anuncie aqui”.

## API admin

Todas exigem `Authorization: Bearer $ADMIN_TOKEN`.

- `GET /api/admin/queue` — envios pendentes
- `POST /api/admin/approve` — `{ "id": 1, "decision": "approve" }` ou `reject`. Aprovar só publica se houver URL de fonte. O JSON enviado não vira arquivo hospedado.
- `GET /api/admin/stats` — totais, pageviews por dia, cliques e pedidos de anúncio
- `GET /api/admin/searches` — buscas sem resultado
- `GET /api/admin/sponsors` e `POST /api/admin/sponsors` — semanas e destaques
- `POST /api/admin/entries` — upsert em lote. Aceita o arquivo de seed inteiro (`templates` + `paid`). Itens em `paid` entram com `published` e `listed` falsos.

`GET /api/newsletter` devolve o HTML da edição de terça (até 5 templates, linha “Patrocinado por” e `{{{RESEND_UNSUBSCRIBE_URL}}}`).

## Mapeamento do seed

| Seed | Coluna |
| --- | --- |
| `title`, `slug`, `description`, `explanation` | os mesmos |
| `integrations` | JSON com `slug` e o nome original |
| `category`, `difficulty` | slugs internos (`facil`, `medio`, `avancado`, etc.) |
| `difficulty_note` | `difficulty_note` |
| `author`, `author_url` | `author_name`, `author_url` |
| `source_url`, `source` | `source_url`, `source_name` |
| `source_date` | `source_date` e, se não houver outra data, `added_at` |
| `license` | `license_note` |
| `node_count`, `json_downloadable` | os mesmos |
| `price`, `price_as_shown`, `purchase_url` | os mesmos, só nos pagos |

`gaps` e `methodology` permanecem no arquivo. Não viram template.

## Plano gratuito

Next.js na Vercel (Hobby), Postgres no Neon via Marketplace, Resend só se você quiser a audiência. Não há checkout, cron pago nem serviço obrigatório além do banco.
