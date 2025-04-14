# Best Practices Guide for CardGenius AI

This document serves as a living guide for managing context, prompt engineering, and iterating on output with Cursor. It will be regularly updated as we learn and improve our processes.

## A. Context Management and Prompt Engineering

### Iterative and Modular Prompts
- Work in small, focused tasks (e.g., extract spend details from one sentence)
- Always reference only the necessary parts of your codebase using @ symbols
- Break down complex tasks into smaller, manageable prompts
- Use clear and specific language in prompts

### Follow-Up Prompts for Missing Data
- If an input is ambiguous or missing key details (like a spending amount), design the conversation to automatically ask clarifying questions
- Implement a standardized format for follow-up questions
- Maintain context between follow-up questions

## B. Documentation and Workflow Guidelines

### Maintain a Central PRD
- Store comprehensive requirements in `/docs/PRD.md`
- Ensure the AI has access to this file through context references (@Docs)
- Keep the PRD updated with any changes or new requirements

### Prompt Templates
Develop reusable prompt templates for common situations:

#### Clarification Prompt
```
It seems like the spending amount for [Brand] is missing. Could you please specify the amount?
```

#### Confirmation Prompt
```
You mentioned spending ₹[amount] on [Brand]. Is that correct?
```

## C. Error Handling and Feedback Loops

### Error Logging
- Define standard error messages and handling procedures
- Log API failures and mismatched mappings
- Implement a consistent error reporting format
- Document common error scenarios and their resolutions

### Regular Reviews and Iteration
- Periodically review generated outputs
- Refine `.cursorrules` and prompt templates based on feedback
- Document successful prompt patterns
- Maintain a log of edge cases and their solutions

## D. Security, Privacy, and Consistency

### Security Best Practices
- Process sensitive data in Privacy Mode
- Avoid sending unnecessary context
- Adhere to SOC 2 guidelines
- Follow internal security policies
- Implement data encryption where necessary

### Team Collaboration
- Share best practices with the team
- Maintain a unified approach across all team members
- Keep documentation up-to-date
- Store documentation in a shared repository
- Conduct regular team reviews of best practices

## E. Code Quality and Standards

### Code Organization
- Follow the project's established file structure
- Maintain consistent naming conventions
- Document complex logic with clear comments
- Keep functions focused and single-purpose

### Testing and Validation
- Implement comprehensive test coverage
- Validate all inputs and outputs
- Document test cases and scenarios
- Maintain a test suite for common use cases

## F. Continuous Improvement

### Feedback Collection
- Implement a system for collecting user feedback
- Document common user issues and their solutions
- Regularly review and update the best practices
- Track metrics for prompt effectiveness

### Version Control
- Maintain clear commit messages
- Use feature branches for development
- Document major changes in the changelog
- Keep the repository clean and organized

---

*This document is a living guide and will be updated regularly based on team feedback and evolving best practices.* 