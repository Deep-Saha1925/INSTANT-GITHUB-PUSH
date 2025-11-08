const vscode = require('vscode');
const express = require('express');
const open = require('open');
const fetch = require('node-fetch');
const { execSync } = require('child_process');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT || 3000;

/**
 * This method is called when the extension is activated
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.createAndPushRepo', async function () {
        vscode.window.showInformationMessage('Starting GitHub login...');

        // Start express app for GitHub OAuth callback
        const app = express();
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`;

        let server;
        const tokenPromise = new Promise((resolve, reject) => {
            app.get('/callback', async (req, res) => {
                const code = req.query.code;
                res.send('<h2>GitHub Authentication Successful! You can close this tab now.</h2>');

                try {
                    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            client_id: CLIENT_ID,
                            client_secret: CLIENT_SECRET,
                            code
                        })
                    });

                    const data = await tokenResponse.json();
                    if (data.access_token) {
                        resolve(data.access_token);
                    } else {
                        reject('Failed to get token. Check client credentials.');
                    }
                } catch (error) {
                    reject(error);
                } finally {
                    setTimeout(() => server.close(), 1000);
                }
            });

            try {
                server = app.listen(PORT, () => {
                    vscode.env.openExternal(vscode.Uri.parse(authUrl));
                });
            } catch (e) {
                reject('Port 3000 already in use. Close other instances and retry.');
            }
        });

        // Wait for GitHub OAuth
        let token;
        try {
            token = await tokenPromise;
            vscode.window.showInformationMessage('GitHub authentication successful!');
        } catch (err) {
            vscode.window.showErrorMessage('GitHub auth failed: ' + err);
            return;
        }

        // Ask user for repo name
        const repoName = await vscode.window.showInputBox({
            prompt: 'Enter new GitHub repository name',
            ignoreFocusOut: true
        });
        if (!repoName) return;

        // Create repository via GitHub API
        vscode.window.showInformationMessage('Creating GitHub repository...');
        const createRepoResponse = await fetch('https://api.github.com/user/repos', {
            method: 'POST',
            headers: {
                Authorization: `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: repoName, private: true })
        });

        const repo = await createRepoResponse.json();
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders){
          vscode.window.showErrorMessage('No folder open in VS Code!');
          return;
        }

        const cwd = workspaceFolders[0].uri.fsPath;

        if (repo.html_url) {
          try {
              vscode.window.showInformationMessage(`Repository created: ${repo.html_url}`);
              
              execSync('git init', { cwd, stdio: 'ignore' });
              execSync('git add .', { cwd, stdio: 'ignore' });
              execSync('git commit -m "Initial commit"', { cwd, stdio: 'ignore' });
              execSync('git branch -M main', { cwd, stdio: 'ignore' });
              execSync(`git remote add origin ${repo.clone_url}`, { cwd, stdio: 'ignore' });
              execSync('git push -u origin main', { cwd, stdio: 'ignore' });

              vscode.window.showInformationMessage('Code pushed successfully to GitHub!');
          } catch (err) {
              vscode.window.showErrorMessage('Git push failed: ' + err.message);
          }
        } else {
            vscode.window.showErrorMessage('Error creating repo: ' + (repo.message || 'Unknown error'));
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };