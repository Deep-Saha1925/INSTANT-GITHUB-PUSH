const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

async function createAndPushRepo(accessToken, repoName, description, isPrivate, workspacePath, progress) {
    try {
        // Step 1: Get GitHub username
        progress.report({ message: "Getting GitHub user information..." });
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const username = userResponse.data.login;

        // Step 2: Create repository on GitHub
        progress.report({ message: "Creating repository on GitHub..." });
        const createRepoResponse = await axios.post(
            'https://api.github.com/user/repos',
            {
                name: repoName,
                description: description,
                private: isPrivate,
                auto_init: false
            },
            {
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        const repoUrl = createRepoResponse.data.clone_url;
        const repoUrlWithToken = repoUrl.replace('https://', `https://${accessToken}@`);

        // Step 3: Initialize Git if not already initialized
        progress.report({ message: "Initializing Git repository..." });
        try {
            execSync('git rev-parse --git-dir', { cwd: workspacePath, stdio: 'ignore' });
            console.log('Git repository already initialized');
        } catch (error) {
            execSync('git init', { cwd: workspacePath });
            console.log('Git repository initialized');
        }

        // Step 4: Create .gitignore if it doesn't exist
        const gitignorePath = path.join(workspacePath, '.gitignore');
        if (!fs.existsSync(gitignorePath)) {
            const defaultGitignore = `node_modules/
.env
.DS_Store
*.log
dist/
build/
.vscode/
`;
            fs.writeFileSync(gitignorePath, defaultGitignore);
            console.log('.gitignore created');
        }

        // Step 5: Add all files
        progress.report({ message: "Adding files to Git..." });
        execSync('git add .', { cwd: workspacePath });

        // Step 6: Create initial commit
        progress.report({ message: "Creating initial commit..." });
        try {
            execSync('git commit -m "Initial commit via GITEasy"', { cwd: workspacePath });
        } catch (error) {
            // Check if there's nothing to commit
            const status = execSync('git status --porcelain', { cwd: workspacePath }).toString();
            if (!status.trim()) {
                throw new Error('No files to commit. The directory may be empty or all files are ignored.');
            }
            throw error;
        }

        // Step 7: Set default branch to main
        progress.report({ message: "Setting up branch..." });
        try {
            execSync('git branch -M main', { cwd: workspacePath });
        } catch (error) {
            console.log('Branch already named main or error renaming:', error.message);
        }

        // Step 8: Add remote origin
        progress.report({ message: "Adding remote repository..." });
        try {
            execSync('git remote add origin ' + repoUrlWithToken, { cwd: workspacePath });
        } catch (error) {
            // Remote might already exist, try to set URL instead
            try {
                execSync('git remote set-url origin ' + repoUrlWithToken, { cwd: workspacePath });
            } catch (setUrlError) {
                console.error('Error setting remote URL:', setUrlError.message);
            }
        }

        // Step 9: Push to GitHub
        progress.report({ message: "Pushing code to GitHub..." });
        execSync('git push -u origin main --force', { cwd: workspacePath });

        // Step 10: Remove token from remote URL for security
        const cleanRepoUrl = repoUrl;
        execSync('git remote set-url origin ' + cleanRepoUrl, { cwd: workspacePath });

        progress.report({ message: "Complete!" });

        return {
            success: true,
            repoUrl: createRepoResponse.data.html_url,
            username: username
        };

    } catch (error) {
        console.error('Error in createAndPushRepo:', error);
        
        if (error.response) {
            // GitHub API error
            const message = error.response.data.message || 'Unknown GitHub API error';
            throw new Error(`GitHub API Error: ${message}`);
        } else if (error.message.includes('git')) {
            // Git command error
            throw new Error(`Git Error: ${error.message}`);
        } else {
            throw error;
        }
    }
}

async function pushChangesToExistingRepo(workspacePath, progress) {
    try {
        // Check if git repo exists
        try {
            execSync('git rev-parse --git-dir', { cwd: workspacePath, stdio: 'ignore' });
        } catch (error) {
            throw new Error('Not a git repository. Please initialize git first or use "Create and Push to GitHub" for new repos.');
        }

        // Check if remote exists
        let remoteUrl;
        try {
            remoteUrl = execSync('git remote get-url origin', { cwd: workspacePath }).toString().trim();
        } catch (error) {
            throw new Error('No remote repository configured. Please use "Create and Push to GitHub" first.');
        }

        // Check if there are changes
        const status = execSync('git status --porcelain', { cwd: workspacePath }).toString();
        if (!status.trim()) {
            throw new Error('No changes to commit. Working directory is clean.');
        }

        // Add all changes
        progress.report({ message: "Adding changes..." });
        execSync('git add .', { cwd: workspacePath });

        // Get commit message from user
        const vscode = require('vscode');
        const commitMessage = await vscode.window.showInputBox({
            prompt: "Enter commit message:",
            placeHolder: "Updated files",
            ignoreFocusOut: true,
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Commit message cannot be empty';
                }
                return null;
            }
        });

        if (!commitMessage) {
            throw new Error('Commit cancelled - no message provided.');
        }

        // Commit changes
        progress.report({ message: "Committing changes..." });
        execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { cwd: workspacePath });

        // Push to remote
        progress.report({ message: "Pushing to GitHub..." });
        execSync('git push origin main', { cwd: workspacePath });

        progress.report({ message: "Complete!" });

        return {
            success: true,
            message: 'Changes pushed successfully!',
            remoteUrl: remoteUrl
        };

    } catch (error) {
        console.error('Error in pushChangesToExistingRepo:', error);
        throw error;
    }
}

module.exports = { createAndPushRepo, pushChangesToExistingRepo };