const vscode = require('vscode');
const express = require('express');
const axios = require('axios');

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = 'Ov23lit0aSbZAF60Auy2';
const GITHUB_CLIENT_SECRET = 'c8d09a56926cf24947760bf88a5e078b96e71f08';
const REDIRECT_URI = 'http://localhost:3000/callback';
const PORT = 3000;

async function authenticate(context) {
    return new Promise((resolve, reject) => {
        // Check if we already have a token stored
        const storedToken = context.globalState.get('githubAccessToken');
        if (storedToken) {
            vscode.window.showInformationMessage('Using existing GitHub authentication.');
            resolve(storedToken);
            return;
        }

        const app = express();
        let server;

        // Generate a random state for security
        const state = Math.random().toString(36).substring(7);

        // Build GitHub authorization URL
        const authorizationUri = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo%20user&state=${state}`;

        // Open browser for authorization
        vscode.env.openExternal(vscode.Uri.parse(authorizationUri));
        vscode.window.showInformationMessage('Opening GitHub authorization in browser...');

        // Handle OAuth callback
        app.get('/callback', async (req, res) => {
            const { code, state: returnedState } = req.query;

            if (!code) {
                res.send('<h1>Error: No authorization code received</h1>');
                server.close();
                reject(new Error('No authorization code received'));
                return;
            }

            try {
                // Exchange code for access token
                const tokenResponse = await axios.post(
                    'https://github.com/login/oauth/access_token',
                    {
                        client_id: GITHUB_CLIENT_ID,
                        client_secret: GITHUB_CLIENT_SECRET,
                        code: code,
                        redirect_uri: REDIRECT_URI
                    },
                    {
                        headers: {
                            'Accept': 'application/json'
                        }
                    }
                );

                const accessToken = tokenResponse.data.access_token;

                if (!accessToken) {
                    throw new Error('No access token received from GitHub');
                }

                // Store token securely
                await context.globalState.update('githubAccessToken', accessToken);

                res.send(`
                    <html>
                        <head>
                            <style>
                                body {
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    height: 100vh;
                                    margin: 0;
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                }
                                .container {
                                    background: white;
                                    padding: 40px;
                                    border-radius: 10px;
                                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                                    text-align: center;
                                    max-width: 400px;
                                }
                                h1 { color: #2ecc71; margin: 0 0 10px 0; }
                                p { color: #666; margin: 10px 0; }
                                .success-icon { font-size: 48px; margin-bottom: 20px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="success-icon">✓</div>
                                <h1>Authentication Successful!</h1>
                                <p>You can now close this window and return to VS Code.</p>
                                <p>GITEasy is ready to create your GitHub repository.</p>
                            </div>
                            <script>
                                setTimeout(() => {
                                    window.close();
                                }, 3000);
                            </script>
                        </body>
                    </html>
                `);

                setTimeout(() => {
                    server.close();
                    resolve(accessToken);
                }, 2000);

            } catch (error) {
                console.error('Access Token Error', error.message);
                const errorMsg = error.response?.data?.error_description || error.message;
                res.send(`<h1>Error: Authentication failed</h1><p>${errorMsg}</p>`);
                server.close();
                reject(new Error(`Authentication failed: ${errorMsg}`));
            }
        });

        // Handle root path
        app.get('/', (req, res) => {
            res.send('<h1>GITEasy OAuth</h1><p>Waiting for GitHub authorization...</p>');
        });

        // Start server
        server = app.listen(PORT, () => {
            console.log(`OAuth callback server listening on port ${PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                reject(new Error(`Port ${PORT} is already in use. Please close any application using this port and try again.`));
            } else {
                reject(err);
            }
        });

        // Timeout after 5 minutes
        setTimeout(() => {
            if (server && server.listening) {
                server.close();
                reject(new Error('Authentication timeout - Please try again'));
            }
        }, 300000);
    });
}

module.exports = { authenticate };