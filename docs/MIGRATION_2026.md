# Trello App — 2026 Modernization

## Previous stack

- Next.js 15.5.24
- React 19.2.4
- Prisma 5.9.1
- Node 20 Docker image

## New stack

- Next.js 16.3.8
- React 19.3.0
- React DOM 19.3.0
- Prisma 7.10.0
- @prisma/client 7.10.0
- @prisma/adapter-pg 7.10.0
- Node 22 Docker image (minimum supported Node 22.12)

## Prisma migration

Prisma 5 was upgraded to stable Prisma 7.10.0. PostgreSQL connections use
`@prisma/adapter-pg` with `pg`. `prisma.config.ts` configures the schema and reads
`DATABASE_URL` from the environment; the URL is no longer in the schema datasource.
Client generation does not require a database connection or URL.

The `prisma-client` generator writes to `generated/prisma`, which is ignored by
Git. Server code imports the generated client; types and enums use its browser
entry. `getDb()` initializes the client on first use, requires `DATABASE_URL` at
runtime, and reuses a singleton across development reloads or within the production
module. The package uses ESM.

No models, fields, relations, indexes, unique constraints, enums, defaults,
database mappings, or database structure were changed. Query arguments are
unchanged. No migrations were created or executed. The existing database
historically has no `_prisma_migrations` table; this modernization does not
establish migration history. Do not run database push, migration, seed, or reset
commands as part of this runbook.

## Next.js / React migration

Next.js 16.3.8 and React / React DOM 19.3.0 use compatible React types and
TypeScript 5.9.3. Existing asynchronous route parameters and headers were retained.
`middleware.ts` became `proxy.ts`, preserving Clerk routing and authorization
logic; the proxy runs in the Node.js runtime.

The platform layout uses `connection()` for request-time rendering, allowing
builds without Clerk credentials. Prisma and Stripe initialize lazily. Hydration
guards use `useSyncExternalStore`; list state adjusts when incoming props change
instead of synchronizing in an effect. These state changes address the new lint
rules. ESLint uses flat config with `core-web-vitals`, without disabling checks.
PostCSS and Tailwind configuration use ESM; Next uses the automatic JSX runtime.

## Docker hardening

VPS Docker validation found that the generated Prisma Client was missing from the
runtime image. The runner now copies `generated/prisma` from the builder stage
with `node:node` ownership, preserving the configured generator output.

- All stages use `node:22-slim`; schema/config are available before `npm ci`.
- Build generates Prisma and runs `npm run build`.
- The final image uses `USER node`, appropriate `COPY --chown=node:node`, and
  `npm run start`.
- Both services use `no-new-privileges`; the app also drops all capabilities with
  `cap_drop: ALL`.
- PostgreSQL publishes no ports. The backend network is `internal`; the app also
  joins the existing external Traefik network.
- PostgreSQL has a `pg_isready` healthcheck; the app waits for `service_healthy`.
- `POSTGRES_PASSWORD` comes from an environment variable. Services, Traefik
  labels/domain, and the existing PostgreSQL volume are preserved.
- `.env*` files are excluded from the Docker build context, with an explicit
  exception allowing `.env.example`. Do not put credentials in example files.

## Security

No `.env` files are tracked and no secrets were added. The old hardcoded
PostgreSQL password was removed from current code. Its historical value remains
in Git history and must be considered compromised. The project owner confirms
that the real production password is already different from that historical value.

Supply runtime credentials outside Git and Docker layers. Changing
`POSTGRES_PASSWORD` does not change a database user's password in an initialized
volume; deployment configuration must match the existing database credentials.
Browser `NEXT_PUBLIC_*` values are resolved at build time; Compose `env_file`
alone does not populate an already-built browser bundle.

## Known warnings / pending validation

- `npm audit --omit=dev` reported 17 vulnerabilities: 11 high, 6 moderate,
  0 critical. Review them separately; `audit fix --force` was not used.
- The final image still contains the build dependency tree, including development
  tools; production dependency pruning remains a separate improvement.
- VPS Docker build passed with Node 22.23.3, Next 16.3.8, and user `node` (UID 1000).
  Rebuild the corrected image and verify `/app/generated/prisma` is present;
  runtime startup validation remains pending. Local checks used Node 24.15.0.
- Real smoke tests remain pending for authentication, boards/lists/cards, Clerk,
  Stripe, and subscriptions. Also verify PostgreSQL connection/pool behavior with
  the new driver; the configured connection timeout is 5 seconds.

## Deployment workflow

1. Develop and commit on `dev`.
2. Before committing, run `npx prisma generate`, `npm run lint`, `npm run build`,
   `git diff --check`, and check that no `.env*` files are tracked. These checks
   must not include database-changing commands.
3. Push `dev`; build and validate it on the DEV VPS using external configuration
   and the existing database volume. Run the pending smoke tests.
4. After successful DEV validation, open a PR from `dev` to `main`.
5. Update production only from reviewed and validated changes promoted to `main`.
   Never deploy unvalidated working-tree or development changes directly.
