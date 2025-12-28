# Review Guidelines

## Purpose
This file defines how code reviews should be conducted in this project.
Customize sections to match your team's practices.

## Review Types
- **Implementation Review**: Verify code matches spec requirements
- **Architecture Review**: Assess structural decisions
- **Security Review**: Check for vulnerabilities

## Feedback Format
Reviews output feedback using inline markers:

```
#FEEDBACK #TODO | {feedback}
```

For spec-impacting feedback that should update specifications:
```
#FEEDBACK #TODO | {feedback} (spec:<spec-id>)
```

## Review Checklist
- [ ] Code follows project conventions
- [ ] Tests cover new functionality
- [ ] Documentation updated
