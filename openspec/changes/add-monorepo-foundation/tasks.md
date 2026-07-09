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
- [x] Add Drizzle config and minimal foundation schema.
- [x] Add seed runner base.
- [x] Add placeholders for planned modules.

## 4. Frontend foundation

- [x] Add Next.js web package scaffold.
- [x] Add landing/dashboard placeholder.
- [x] Add placeholders for planned features.

## 5. Verification

- [x] Generate `package-lock.json` with `npm install --package-lock-only`.
- [x] Run `npm audit --json` and confirm zero vulnerabilities.
- [ ] Run `npm install`.
- [ ] Run `docker compose up -d`.
- [ ] Run `npm run db:generate`.
- [ ] Run `npm run db:migrate`.
- [ ] Run `npm run db:seed`.
- [ ] Run `npm run typecheck`.
- [ ] Run tests when test files exist.
