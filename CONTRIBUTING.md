# Contributing to MEDPRO

Thank you for your interest in contributing to MEDPRO! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect differing viewpoints

## How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Create detailed bug report** including:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS, wallet)

### Suggesting Features

1. **Check existing feature requests**
2. **Create feature proposal** with:
   - Use case description
   - Expected benefits
   - Implementation ideas (optional)

### Pull Requests

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create Pull Request**

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful variable names
- Add comments for complex logic

### Component Structure

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export function Component({ prop1, prop2 }: ComponentProps) {
  const [state, setState] = useState('');

  const handleAction = () => {
    // Implementation
  };

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Commit Message Format

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build process or auxiliary tool changes

### Testing

- Write tests for new features
- Ensure existing tests pass
- Test across different wallets
- Test on mobile devices

## Project Structure

```
medpro/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utility functions
│   └── config/        # Configuration files
├── contracts/         # Smart contracts
├── supabase/         # Backend functions
└── public/           # Static assets
```

## Smart Contract Development

### Guidelines

- Follow Solidity best practices
- Add comprehensive tests
- Document all functions
- Consider gas optimization
- Audit security implications

### Testing Contracts

```bash
cd contracts
npx hardhat test
```

## Database Changes

### Migration Guidelines

1. Create migration file
2. Test locally
3. Document changes
4. Update types
5. Test rollback

### Adding Tables

```sql
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON new_table FOR SELECT
  USING (user_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');
```

## Edge Functions

### Creating New Function

1. Create function directory
   ```bash
   mkdir supabase/functions/new-function
   ```

2. Add index.ts
   ```typescript
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

   serve(async (req) => {
     try {
       // Implementation
       return new Response(JSON.stringify({ success: true }), {
         headers: { "Content-Type": "application/json" },
       });
     } catch (error) {
       return new Response(JSON.stringify({ error: error.message }), {
         status: 400,
       });
     }
   });
   ```

3. Deploy
   ```bash
   supabase functions deploy new-function
   ```

## Documentation

### Adding Documentation

- Update README.md for major features
- Add inline code comments
- Create SETUP.md entries for new configurations
- Update API documentation

## Review Process

### Pull Request Review

PRs are reviewed for:
- Code quality and style
- Test coverage
- Documentation updates
- Breaking changes
- Security implications

### Review Timeline

- Initial review: Within 48 hours
- Follow-up: Within 24 hours
- Merge: After approval from maintainers

## Community

### Getting Help

- GitHub Discussions for questions
- Discord for real-time chat
- Email for sensitive issues

### Recognition

Contributors are recognized in:
- CONTRIBUTORS.md file
- Release notes
- Social media mentions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to reach out:
- Create a GitHub issue
- Join our Discord
- Email the maintainers

Thank you for contributing to MEDPRO! 🎉
