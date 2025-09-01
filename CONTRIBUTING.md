# Contributing

Thanks for helping! This repo enforces:
- **Pull requests only** (no direct pushes to `main`)
- **Verified signed commits** (GPG)
- **Passing CI & CodeQL** before merge

## Workflow
1. `git checkout main && git pull`
2. `git switch -c feature/<short-description>`
3. Make changes.
4. Commit with a **signed** message:
   ```bash
   git add .
   git commit -S -m "feat: <what changed>"
   ```
5. Push your branch:
   ```bash
   git push -u origin feature/<short-description>
   ```
6. Open a PR. Wait for CI/CodeQL to pass, then **Squash and merge**.

## Commit message convention
- `feat:` new feature
- `fix:` bug fix
- `chore:` tooling/infra/docs/CI
- `docs:` documentation only
- `refactor:` no behavior change

## Local checks
- Lint: `npx eslint .`

## Security
See `SECURITY.md` for reporting vulnerabilities.
