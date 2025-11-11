# 🚀 GitEasy — VS Code Extension

**GitEasy** is a lightweight Visual Studio Code extension that allows developers to quickly create a new GitHub repository and push their local code — all directly from VS Code!

No need to open GitHub manually or type complex Git commands. Just authorize once, and you’re ready to go.

---

## ✨ Features

- 🔐 **GitHub OAuth Authorization** — Securely connects to your GitHub account through OAuth.  
- 🧠 **Automatic Repository Creation** — Instantly create a new repository right from VS Code.  
- ⚡ **One-Click Push** — Push your current workspace to GitHub in seconds.  
- 🪶 **Simple Workflow** — No terminal commands, no manual configuration.  

---

## 🧩 How to Use

### 1️⃣ Install the Extension
Search for **“GitEasy”** in the VS Code Extensions Marketplace and install it.

### 2️⃣ Open Your Project Folder
Make sure your VS Code workspace contains the project you want to upload to GitHub.

### 3️⃣ Run the Command
Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS).  
Type **“Create and Push to GitHub”** and hit Enter.

### 4️⃣ Authorize GitHub
A browser window will open asking for GitHub authorization.  
Log in and allow the extension to access your account.  
Once authorized, the extension will automatically create a new GitHub repository for you.

### 5️⃣ Enter Repository Name
You’ll be prompted to enter a name for your new repo.  
The extension then commits your current project and pushes it to the new GitHub repository.

---

## 🧾 Example Flow

```bash
> Ctrl + Shift + P  
> Create and Push to GitHub  
> (Browser opens → Authorize GitHub)  
> Enter Repository Name: instant-github-demo  
> ✅ Successfully pushed to https://github.com/<your-username>/instant-github-demo
```

---

## 🔒 Security

- OAuth is handled securely through GitHub’s official API.  
- Your GitHub token is **never stored permanently** — it’s used only during the authorized session.

---

## 💡 Notes

- You must have **Git installed and configured** locally.  
- Internet connection is required during repo creation and push.
---

## 🧑‍💻 Author

Developed by **Deep Saha** — making developer workflows simpler and faster.