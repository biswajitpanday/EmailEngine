# Email Engine

## Git Flow

This document outlines the Git flow process used in this project. 

### Branches

- **main**: The primary branch for production-ready code.
- **sandbox**: Used for sandbox deployment and testing.
- **feature**: Created from sandbox for new features and enhancements.
- **refactor**: Dedicated to improving code structure and readability.
- **hotfix**: Used for urgent post-release fixes to ensure application stability.

### Workflow

1. **Creating a Feature Branch**
   - Start work on a new feature by creating a branch from sandbox.
   - Naming convention: `feature/your-feature-name` (e.g., `feature/user-auth`).

   ```bash
   git checkout sandbox
   git pull origin sandbox
   git checkout -b feature/your-feature-name
   ```

2. **Developing a Feature**
    - Work on the feature in your feature branch.
    - Commit changes regularly with clear and concise commit messages.

    ```bash
    git add .
    git commit -m "Add feature description"
    ```

3. **Merging a Feature to Sandbox**

    - Once the feature is complete and tested, merge it back into the `sandbox` branch.
    - Ensure your branch is up-to-date with the latest changes from `sandbox`.

    ```bash
    git checkout sandbox
    git pull origin sandbox
    git checkout feature/your-feature-name
    git merge sandbox
    ```

4. **Creating a Pull Request**

    - Push your feature branch to the remote repository.

    ```bash
    git push origin feature/your-feature-name
    ```

    - Create a Pull Request (PR) to merge the feature branch into the sandbox branch.
    - The PR should be reviewed by team members.

5. **QA Testing**
    - Upon merging into `sandbox`, it will be deployed for QA testing.
    - Address any issues found in the respective feature branch, then repeat the process.

6. **Merging Sandbox to Main**
    - After QA approval, merge `sandbox` into `main`.
    - Ensure the sandbox branch is up-to-date with the latest changes before merging.

        ```bash
        git checkout main
        git pull origin main
        git checkout sandbox
        git merge main
        git checkout main
        git merge sandbox
        ```

7. **Deploying to Production**
    - After merging into the main branch, the changes can be deployed to the production environment.
