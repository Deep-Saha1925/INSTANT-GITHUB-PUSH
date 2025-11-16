const vscode = require('vscode');
const { authenticate } = require('./auth');
const { createAndPushRepo, pushChangesToExistingRepo } = require('./github');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('GITEasy extension is now active!');

    // Command 1: Create new repo and push
    let createAndPush = vscode.commands.registerCommand('giteasy.createAndPush', async function () {
        try {
            // Show initial message
            vscode.window.showInformationMessage('Starting GITEasy - GitHub repository creation...');

            // Step 1: Authenticate with GitHub
            const accessToken = await authenticate(context);
            
            if (!accessToken) {
                vscode.window.showErrorMessage('Authentication failed. Please try again.');
                return;
            }

            // Step 2: Get repository details from user
            const repoName = await vscode.window.showInputBox({
                prompt: "Enter the new GitHub repository name:",
                placeHolder: "my-awesome-project",
                ignoreFocusOut: true,
                validateInput: (value) => {
                    if (!value || value.trim().length === 0) {
                        return 'Repository name cannot be empty';
                    }
                    if (!/^[a-zA-Z0-9-_.]+$/.test(value)) {
                        return 'Repository name can only contain letters, numbers, hyphens, underscores, and periods';
                    }
                    return null;
                }
            });

            if (!repoName) {
                vscode.window.showWarningMessage('Repository creation cancelled.');
                return;
            }

            const repoDescription = await vscode.window.showInputBox({
                prompt: "Enter repository description (optional):",
                placeHolder: "My awesome project description",
                ignoreFocusOut: true
            });

            const isPrivate = await vscode.window.showQuickPick(
                ['Public', 'Private'],
                {
                    placeHolder: 'Select repository visibility',
                    ignoreFocusOut: true
                }
            );

            if (!isPrivate) {
                vscode.window.showWarningMessage('Repository creation cancelled.');
                return;
            }

            // Get workspace folder
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                vscode.window.showErrorMessage('No workspace folder is open. Please open a folder first.');
                return;
            }

            const workspacePath = workspaceFolders[0].uri.fsPath;

            // Step 3: Create repository and push code
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "GITEasy",
                cancellable: false
            }, async (progress) => {
                progress.report({ message: "Creating GitHub repository..." });
                
                await createAndPushRepo(
                    accessToken,
                    repoName,
                    repoDescription || '',
                    isPrivate === 'Private',
                    workspacePath,
                    progress
                );
            });

            vscode.window.showInformationMessage(
                `Successfully created and pushed to GitHub repository: ${repoName}`,
            );

        } catch (error) {
            console.error('Error in GITEasy:', error);
            vscode.window.showErrorMessage(`GITEasy Error: ${error.message}`);
        }
    });

    // Command 2: Push changes to existing repo
    let pushChanges = vscode.commands.registerCommand('giteasy.pushChanges', async function () {
        try {
            // Get workspace folder
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                vscode.window.showErrorMessage('No workspace folder is open. Please open a folder first.');
                return;
            }

            const workspacePath = workspaceFolders[0].uri.fsPath;

            // Push changes
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "GITEasy",
                cancellable: false
            }, async (progress) => {
                progress.report({ message: "Preparing to push changes..." });
                
                const result = await pushChangesToExistingRepo(workspacePath, progress);
                
                return result;
            });

            vscode.window.showInformationMessage(
                'Changes pushed to GitHub successfully!',
                'View on GitHub'
            ).then(selection => {
                if (selection === 'View on GitHub') {
                    // Extract GitHub URL and open
                    const { execSync } = require('child_process');
                    try {
                        const remoteUrl = execSync('git remote get-url origin', { cwd: workspacePath }).toString().trim();
                        const httpsUrl = remoteUrl.replace(/\.git$/, '').replace(/^git@github\.com:/, 'https://github.com/');
                        vscode.env.openExternal(vscode.Uri.parse(httpsUrl));
                    } catch (error) {
                        console.error('Could not open GitHub URL:', error);
                    }
                }
            });

        } catch (error) {
            console.error('Error in GITEasy Push:', error);
            vscode.window.showErrorMessage(`GITEasy Push Error: ${error.message}`);
        }
    });

    context.subscriptions.push(createAndPush, pushChanges);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};