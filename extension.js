const vscode = require('vscode');
const { authenticate } = require('./auth');
const { createAndPushRepo } = require('./github');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('GITEasy extension is now active!');

    let disposable = vscode.commands.registerCommand('giteasy.createAndPush', async function () {
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

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};