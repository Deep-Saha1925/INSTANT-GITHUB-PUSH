<div align="center">
  <img src="images/icon.png" alt="GitEasy Logo" width="128" height="128">
  
  # 🚀 GitEasy — VS Code Extension
  
  **GitEasy** is a lightweight Visual Studio Code extension that allows developers to quickly create a new GitHub repository and push their local code — all directly from VS Code!
  
  No need to open GitHub manually or type complex Git commands. Just authorize once, and you're ready to go.
  
  [![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/DeepSaha-1925.giteasy?style=flat-square&label=VS%20Code%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=DeepSaha-1925.giteasy)
  [![Downloads](https://img.shields.io/visual-studio-marketplace/d/DeepSaha-1925.giteasy?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=DeepSaha-1925.giteasy)
  [![Rating](https://img.shields.io/visual-studio-marketplace/r/DeepSaha-1925.giteasy?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=DeepSaha-1925.giteasy)
</div>

---

## ✨ Features

- 🔐 **GitHub OAuth Authorization** — Securely connects to your GitHub account through OAuth.  
- 🧠 **Automatic Repository Creation** — Instantly create a new repository right from VS Code.  
- ⚡ **One-Click Push** — Push your current workspace to GitHub in seconds.  
- 🔄 **Push Changes to Existing Repos** — Commit and push updates to your existing GitHub repositories.  
- 🪶 **Simple Workflow** — No terminal commands, no manual configuration.  

---

## 🧩 How to Use

### 🆕 For New Projects: Create and Push to GitHub

#### 1️⃣ Install the Extension
Search for **"GitEasy"** in the VS Code Extensions Marketplace and install it.

#### 2️⃣ Open Your Project Folder
Make sure your VS Code workspace contains the project you want to upload to GitHub.

#### 3️⃣ Run the Command
Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS).  
Type **"Create and Push to GitHub"** and hit Enter.

#### 4️⃣ Authorize GitHub
A browser window will open asking for GitHub authorization.  
Log in and allow the extension to access your account.  
Once authorized, the extension will automatically create a new GitHub repository for you.

#### 5️⃣ Enter Repository Details
You'll be prompted to enter:
- **Repository name** (e.g., `my-awesome-project`)
- **Description** (optional)
- **Visibility** (Public or Private)

The extension then commits your current project and pushes it to the new GitHub repository.

---

### 🔄 For Existing Projects: Push Changes to GitHub

#### 1️⃣ Make Your Changes
Edit, add, or delete files in your project as needed.

#### 2️⃣ Run the Push Command
Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS).  
Type **"Push Changes to GitHub"** and hit Enter.

#### 3️⃣ Enter Commit Message
You'll be prompted to enter a commit message describing your changes.

#### 4️⃣ Done!
GitEasy will automatically:
- Stage all your changes (`git add .`)
- Commit with your message
- Push to your GitHub repository

**Note:** This feature works with repositories that already have a remote configured.

---

## 🧾 Example Flows

### Creating a New Repository
```bash
> Ctrl + Shift + P  
> Create and Push to GitHub  
> (Browser opens → Authorize GitHub)
> Enter Repository Name: instant-github-demo
> Enter Description: My awesome project (optional)
> Select Visibility: Public
> ✅ Successfully pushed to https://github.com/<your-username>/instant-github-demo
```

### Pushing Changes to Existing Repository
```bash
> Ctrl + Shift + P  
> Push Changes to GitHub
> Enter Commit Message: Updated homepage design
> ✅ Changes pushed to GitHub successfully!
```

---

## 📋 Requirements

- **Git** must be installed and configured locally
- **GitHub account** (free account works perfectly)
- **Internet connection** for repository creation and push
- **VS Code** version 1.75.0 or higher

---

## 🔒 Security

- OAuth is handled securely through GitHub's official API.  
- Your GitHub token is stored securely in VS Code's secret storage.
- You can revoke access anytime from [GitHub Settings → Applications](https://github.com/settings/applications).

---

## 🎯 Commands

| Command | Description |
|---------|-------------|
| `GitEasy: Create and Push to GitHub` | Create a new repository and push your code (for new projects) |
| `GitEasy: Push Changes to GitHub` | Commit and push changes to existing repository (for ongoing work) |

**Keyboard Shortcut:** `Ctrl+Shift+G` then `Ctrl+Shift+P` (or use Command Palette)

---

## 🐛 Troubleshooting

### "No workspace folder is open"
**Solution:** Open a folder in VS Code (`File → Open Folder`) before running the command.

### "Authentication failed"
**Solution:** 
- Check your internet connection
- Try closing and reopening VS Code
- Make sure you authorize in the browser when prompted

### "Repository already exists"
**Solution:** Choose a different repository name or delete the existing one on GitHub.

### "Not a git repository" (when using Push Changes)
**Solution:** This command only works with existing Git repositories. Use "Create and Push to GitHub" for new projects.

### "No remote repository configured"
**Solution:** Your project needs to have a GitHub remote configured. Use "Create and Push to GitHub" to set it up.

### "No changes to commit"
**Solution:** You haven't made any changes since your last commit. Modify some files first.

### Git errors
**Solution:** 
- Ensure Git is installed: Run `git --version` in terminal
- Make sure you have at least one file in your project folder

---

## 💡 Tips

- 💾 **Auto .gitignore**: GitEasy creates a default `.gitignore` if none exists
- 🔄 **Persistent Auth**: Your GitHub authentication persists across VS Code sessions
- 🌳 **Main Branch**: Repositories are created with `main` as the default branch
- 📝 **Initial Commit**: First commit message is "Initial commit via GITEasy"
- ⚡ **Quick Updates**: Use "Push Changes" for fast commits without leaving VS Code
- 🎯 **Choose the Right Command**: Use "Create and Push" for new projects, "Push Changes" for existing ones

---

## 🤝 Contributing

Found a bug or have a feature request? 

1. Visit [GitHub Issues](https://github.com/Deep-Saha1925/INSTANT-GITHUB-PUSH/issues)
2. Check if it's already reported
3. Create a new issue with details

Pull requests are welcome!

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🧑‍💻 Author

Developed by **Deep Saha** — making developer workflows simpler and faster.

📧 Email: your.email@example.com  
🐙 GitHub: [@Deep-Saha1925](https://github.com/Deep-Saha1925)

---

## ⭐ Support

If you find this extension helpful:
- ⭐ Star the [GitHub repository](https://github.com/Deep-Saha1925/INSTANT-GITHUB-PUSH)
- 📝 Leave a review on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=DeepSaha-1925.giteasy)
- 🐛 Report bugs or suggest features via [Issues](https://github.com/Deep-Saha1925/INSTANT-GITHUB-PUSH/issues)

---

<div align="center">
  Made with ❤️ by Deep Saha
  
  **[Install Now](https://marketplace.visualstudio.com/items?itemName=DeepSaha-1925.giteasy)** | **[GitHub](https://github.com/Deep-Saha1925/INSTANT-GITHUB-PUSH)** | **[Report Issue](https://github.com/Deep-Saha1925/INSTANT-GITHUB-PUSH/issues)**
</div>