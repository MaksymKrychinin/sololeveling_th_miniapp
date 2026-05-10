# Contributing to Solo Leveling Telegram Mini App

First off, thank you for considering contributing to this project! 🎉

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## 🤝 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code.

### Our Standards
- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other contributors

## 🎯 How Can I Contribute?

### Reporting Bugs
Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, Telegram client, browser)
- **Error messages** or logs

### Suggesting Enhancements
Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear title**
- **Provide detailed description** of the enhancement
- **Explain why** this enhancement would be useful
- **Provide examples** or mockups if possible

### Your First Code Contribution
Unsure where to start? Look for issues labeled:
- `good first issue` - Simple issues for beginners
- `help wanted` - Issues where we need help
- `documentation` - Documentation improvements

### Development Areas

#### Frontend
- React components
- UI/UX improvements
- Animations and interactions
- Responsive design
- Accessibility

#### Backend
- API endpoints
- Database optimization
- Cron jobs
- Authentication
- Business logic

#### Design
- UI mockups
- Icon design
- Animation concepts
- Color palette refinement

#### Documentation
- Code comments
- API documentation
- Tutorial guides
- Architecture docs

## 💻 Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/test_telegram_mini_app.git
   cd test_telegram_mini_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Start development**
   ```bash
   npm run dev
   npm run server:dev
   ```

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

## 📝 Coding Standards

### TypeScript
- Use strict type checking
- Avoid `any` types
- Export types for reusability
- Add JSDoc comments for public functions

### React Components
```typescript
// Good example
interface ButtonProps {
  /** Text to display on button */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
```

### API Endpoints
```typescript
// Good example
router.get('/api/quests', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const quests = await questService.getUserQuests(userId);
    res.json({ data: quests });
  } catch (error) {
    console.error('Error fetching quests:', error);
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
});
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `QuestCard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useQuests.ts`)
- Utils: `camelCase.ts` (e.g., `xpCalculations.ts`)
- Types: `PascalCase.ts` or `index.ts`

### Import Order
```typescript
// 1. React and external libraries
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// 2. Telegram SDK
import { useHapticFeedback } from '@telegram-apps/sdk-react';

// 3. Internal hooks and stores
import { useQuests } from '@/hooks/useQuests';

// 4. Components
import { QuestCard } from '@/components/quest/QuestCard';

// 5. Utils and types
import { calculateXP } from '@/utils/xpCalculations';
import type { Quest } from '@/types';
```

### Styling (Tailwind CSS)
```tsx
// Good: Organized, readable
<div className="
  flex flex-col
  p-4 gap-4
  bg-slate-800 rounded-lg
  border border-slate-700
  hover:border-purple-600
  transition-colors duration-200
">
  {/* Content */}
</div>
```

## 📨 Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes

### Examples
```bash
feat(quest): add quest completion animation

Add smooth animation when user completes a quest.
Includes particle effects and XP counter animation.

Closes #42

---

fix(auth): handle invalid telegram init data

Properly validate and handle cases where Telegram
init data is malformed or expired.

Fixes #38

---

docs(readme): update installation instructions

Add troubleshooting section for common issues.
```

### Rules
- Use present tense: "add" not "added"
- Use imperative mood: "move" not "moves"
- Don't capitalize first letter
- No period at the end
- Keep subject line under 50 characters
- Separate subject from body with blank line
- Wrap body at 72 characters
- Use body to explain what and why, not how

## 🔄 Pull Request Process

### Before Submitting
1. **Update your branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Run tests**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

3. **Format code**
   ```bash
   npm run format
   ```

### PR Title Format
Use the same format as commit messages:
```
feat(scope): add new feature
fix(scope): resolve bug
```

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Tested in Telegram app
- [ ] Tested on mobile

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed my code
- [ ] Commented complex code sections
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tests pass locally
```

### Review Process
1. At least one maintainer approves
2. All CI checks pass
3. No merge conflicts
4. Code coverage maintained or improved

### After Merge
- Delete your feature branch
- Update your local repository
- Close related issues

## 🐛 Issue Guidelines

### Bug Reports
Use the bug report template:
```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., iOS 17]
- Telegram version: [e.g., 10.5]
- Browser: [if applicable]

**Additional context**
Any other relevant information
```

### Feature Requests
```markdown
**Is your feature related to a problem?**
Description of the problem

**Describe the solution**
Your proposed solution

**Describe alternatives**
Alternative solutions considered

**Additional context**
Mockups, examples, etc.
```

## 🎨 Design Contributions

### UI/UX Improvements
- Follow Solo Leveling aesthetic (dark, futuristic)
- Maintain consistency with existing components
- Ensure mobile-first responsive design
- Test on different screen sizes

### Animation Guidelines
- Keep animations under 300ms for responsiveness
- Use easing functions from Framer Motion
- Provide haptic feedback for interactions
- Ensure animations don't block functionality

## 📊 Performance Guidelines

- Bundle size: Keep additions minimal
- Loading time: <2s for initial load
- Interactions: <500ms response time
- Use code splitting for large features
- Optimize images (WebP, proper sizing)
- Lazy load routes and heavy components

## 🔒 Security Guidelines

- Never commit secrets or tokens
- Validate all user inputs
- Sanitize data before displaying
- Use parameterized queries (Prisma handles this)
- Follow OWASP guidelines
- Report security issues privately

## 📞 Getting Help

- **Documentation**: Check existing docs first
- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Use GitHub Issues for bugs and features
- **Discord**: Join our Discord server [link]

## 🎉 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the app (for significant contributions)

Thank you for contributing! 🚀 **Arise and level up the project!**
