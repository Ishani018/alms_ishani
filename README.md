## 🛠️ CI/CD Pipeline

This project uses GitHub Actions for continuous integration (CI) and continuous delivery (CD). The pipeline is triggered on every `push` and `pull_request` to the `main` and `develop` branches.

[cite_start]It consists of 5 required stages as per the project rubric[cite: 2, 665]:

1.  **Build:** Installs all `npm` dependencies using `npm ci` to ensure a clean and repeatable build.
2.  **Test:** Runs the full Jest test suite (unit and integration tests) against a live MySQL test database service.
3.  **Coverage:** Generates a code coverage report during the test stage. [cite_start]The pipeline **enforces a quality gate of 75%** global coverage (lines, statements, branches, and functions).
4.  **Lint:** Performs static code analysis using ESLint. [cite_start]The pipeline will **fail if any ESLint errors** are found[cite: 2, 686].
5.  [cite_start]**Security:** Runs `npm audit` to scan for high-severity vulnerabilities in project dependencies[cite: 2, 689].

### Deployment Artifact

[cite_start]After all 5 CI stages pass, a final job packages the following into a `deployment-package.zip` file[cite: 2, 788]:
* [cite_start]Project source code (controllers, models, routes, public, etc.) [cite: 2, 790]
* [cite_start]`README.md` and `package.json` [cite: 2, 796, 797]
* [cite_start]All CI/CD reports (Coverage, Lint, and Security) [cite: 2, 791, 792, 793]

### How to Run Checks Locally

You can run the same checks locally before pushing:

```bash
# Run tests and generate coverage
npm test -- --coverage

# Check linting
npx eslint .

# Run security scan
npm audit --audit-level=high