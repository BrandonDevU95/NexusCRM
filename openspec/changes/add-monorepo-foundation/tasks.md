# Tasks: add monorepo foundation

## 1. Repository foundation

- [x] Create SDD branch.
- [x] Replace legacy empty `Backend/Frontend` layout with `apps/packages` monorepo.
- [x] Add root package scripts and TypeScript base config.
- [x] Add `.gitignore`, `.editorconfig` and `.env.example`.

## 2. Documentation

- [x] Add architecture guide.
- [x] Add Git workflow guide.
- [x] Add seed strategy guide.
- [x] Add roadmap.

## 3. Backend foundation

- [x] Add NestJS API package scaffold.
- [x] Add health endpoint.
- [x] Add Swagger bootstrap.
- [x] Add TypeORM config, minimal foundation entities and an initial migration.
- [x] Add seed runner base.
- [x] Add placeholders for planned modules.

## 4. Frontend foundation

- [x] Add Next.js web package scaffold.
- [x] Add landing/dashboard placeholder.
- [x] Add placeholders for planned features.

## 5. Verification

- [x] Generate `package-lock.json` with `npm install --package-lock-only`.
- [x] Run `npm audit --json` and confirm zero vulnerabilities.
- [x] Run `npm install`.
- [x] Run `docker compose up -d`.
- [x] Run `npm run db:generate`.
- [x] Run `npm run db:migrate`.
- [x] Run `npm run db:seed`.
- [x] Run `npm run typecheck`.
- [x] Smoke test API health endpoint, Swagger docs and web homepage.
- [x] Run tests after foundation test files were added.
