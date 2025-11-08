# 🚀 GitHub Instant Push VS Code Extension

**GitHub Instant Push** is a VS Code extension that lets you authenticate with GitHub, create a repository, and push your workspace code directly — all in just a few clicks.

---

## Features

- 🔑 Authenticate with GitHub using OAuth.
- 📦 Create a new repository on your GitHub account.
- 🚀 Push your entire VS Code workspace to the newly created repository.
- 🌐 No need to leave VS Code — everything happens in-app.
- ⚡ Fast, simple, and efficient workflow for developers.

---

## Installation

```bash
# Clone the extension repository
git clone <your-repo-url>

# Navigate into the project folder
cd <your-repo-folder>

# Install dependencies
npm install

# Open the folder in VS Code
code .
```

## Running the Extension

```bash
# Press F5 in VS Code to launch a new Extension Development Host window
# Then run the command "GitHub Instant Push: Create and Push Repo" from the Command Palette (Ctrl+Shift+P)
```

## Usage
```bash
# 1. Open a folder in VS Code that you want to push to GitHub
# 2. Trigger the extension via Command Palette:
#    GitHub Instant Push: Create and Push Repo
# 3. Login with your GitHub account in the browser
# 4. Enter the repository name in the input box
# 5. The extension will create the repo, initialize Git, and push all files to GitHub
```

## Requirements
```bash
# Node.js installed
# Git installed and available in PATH
# A GitHub account
```

## Configuration
```bash
# Create a .env file at the root of your extension with the following:

CLIENT_ID=<your_github_client_id>
CLIENT_SECRET=<your_github_client_secret>
PORT=3000

```

## Contributing
```bash
# Contributions are welcome! 
# Open issues, submit pull requests, or suggest new features.

```

## # MIT License

```bash
# MIT License

```