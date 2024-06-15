# Project Name

## Git Flow

This document outlines the Git flow process used in this project. 

### Branches

- **main**: This is the main branch.
- **sandbox**: This branch is used for sandbox deployment and testing.
- **feature**: Feature branches are created from the `sandbox` branch for new features and enhancements.

### Workflow

1. **Creating a Feature Branch**
   - When starting work on a new feature, create a new branch from the `sandbox` branch.
   - Naming convention: `feature/your-feature-name`.

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
    - Once the feature branch is merged into sandbox, it will be deployed to the sandbox environment for QA testing.
    - QA engineers will test the sandbox deployment. If any issues are found, they should be addressed in the respective feature branch and the process repeated.

6. **Merging Sandbox to Main**
    - After QA approval, the sandbox branch can be merged into the main branch.
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
