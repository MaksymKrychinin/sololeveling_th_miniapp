# Contributing to Solo Leveling Telegram Mini App

Thank you for your interest in contributing! 🎉

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Test your changes
7. Commit: `git commit -m "feat: add amazing feature"`
8. Push: `git push origin feature/your-feature-name`
9. Create a Pull Request

## 📝 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## 🧪 Testing

Run tests before submitting PR:

```bash
pnpm test
pnpm lint
pnpm type-check
```

## 📋 Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

## 🏗️ Architecture Guidelines

- Follow Clean Architecture principles
- Keep packages independent
- Use shared types from `@solo-leveling/shared`
- Don't duplicate code - create utilities
- Write unit tests for utilities
- Use Zod for validation

## 📦 Adding Dependencies

- Use `pnpm add` in the correct package
- Prefer exact versions
- Document why the dependency is needed
- Check for security vulnerabilities

## 🔍 Review Process

1. All PRs require review
2. Pass all CI checks
3. Update documentation if needed
4. Add tests for new features
5. Keep PRs focused and small

## 💬 Communication

- Open issues for bugs or features
- Use discussions for questions
- Be respectful and constructive
- Follow the Code of Conduct

## 🎯 Priority Areas

We're especially looking for contributions in:

- UI components (packages/ui)
- API endpoints (apps/api)
- Telegram bot features (apps/bot)
- Tests
- Documentation
- Performance optimizations

Thank you for contributing! 🙏
