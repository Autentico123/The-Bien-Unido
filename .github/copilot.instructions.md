## Code Quality

- Ensure code is clean, readable, and follows best practices.
- Make sure it follows software_requirements_specification.md and database_design.md
- Ensure you have the guide me a following directory structure each changes

## Coding Standards

- Follow the Airbnb JavaScript Style Guide
- Use ESLint and Prettier for code formatting consistency
- Use meaningful variable and function names that reflect their purpose
- Add JSDoc comments for functions with parameter and return type documentation
- Implement proper error handling with informative error messages

## Security

- Check the code for vulnerabilities after generating.
- Avoid hardcoding sensitive information like credentials or API keys.
- Use secure coding practices, such as validating user input and sanitizing data.

## Performance

- Optimize database queries for performance
- Implement proper indexing based on query patterns
- Consider pagination for endpoints that return large datasets
- Use caching strategies where appropriate
- Monitor and limit memory usage in data processing functions

## Environment Variables

- If a .env file exists, use it for local environment variables
- Document any new environment variables in README.md
- Provide example values in .env.example

## Version Control

- Keep commits atomic and focused on single changes
- Follow conventional commit message format
- Update .gitignore for new build artifacts or dependencies

## Documentation

- Update API documentation when endpoints are modified
- Document complex algorithms or business logic
- Include examples for API usage
- Keep README.md up to date with new features and changes

## Testing

- Write unit tests for new functionality using Jest
- Aim for test coverage of at least 80% for critical components
- Include integration tests for API endpoints
- Create test fixtures and mock external dependencies

## Change logging

- Each time you generate code, note the changes in changelog.md
