# Quick Start - Deploy in 10 Minutes 🚀

## What You'll Get
A permanent URL like: `https://quiz-platform-abc123.vercel.app`

---

## 1️⃣ Create GitHub Account (2 min)
- Go to **github.com**
- Sign up → Verify email ✅

## 2️⃣ Create GitHub Repository (1 min)
- Go to **github.com/new**
- Name: `quiz-platform`
- Click **"Create repository"**
- **Copy the HTTPS URL** shown (you'll need it)

## 3️⃣ Download Project Files
- Download all files from the output folder (7 files total)

## 4️⃣ Set Up Your Project on Computer

### On Windows/Mac with GUI (Easiest):
1. Create a new folder: `quiz-platform`
2. Open it
3. Inside, create two folders:
   - `public`
   - `src`
4. Copy files to correct locations:
   - `public-index.html` → `public/index.html`
   - `src-index.js` → `src/index.js`
   - `src-app.js` → `src/App.js`
   - `quiz-platform-app.jsx` → `src/QuizPlatform.js`
   - `package-json-file.json` → `package.json` (rename it!)
   - `gitignore-template` → `.gitignore`
   - `README-template.md` → `README.md`

### On Mac/Linux (Using Terminal):
```bash
mkdir quiz-platform
cd quiz-platform
mkdir public src
# Then copy the files to the correct folders
```

## 5️⃣ Push to GitHub (2 min)

If you're comfortable with terminal:
```bash
cd quiz-platform
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quiz-platform
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username**

If you prefer GUI:
- Use **GitHub Desktop** app
- Or use **VS Code** built-in Git

## 6️⃣ Deploy to Vercel (2 min)

1. Go to **vercel.com** → Sign up → "Continue with GitHub"
2. Click **"Import Project"**
3. Select your `quiz-platform` repository
4. Click **"Deploy"**
5. **Wait 60 seconds...**
6. You'll get your permanent URL! 🎉

---

## 📋 File Locations Checklist

After setup, your folder should look like:
```
quiz-platform/
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   ├── App.js
│   └── QuizPlatform.js
├── .gitignore
├── package.json
└── README.md
```

---

## 🆘 Quick Fixes

**"Command not found: git"**
- Download Git: **git-scm.com**

**"It's still showing deployment status"**
- Wait another minute, then refresh

**"404 error after deployment"**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

## ✅ You're Done!
Your permanent quiz platform URL is ready to share! 🚀

**Next time you want to update:**
```bash
git add .
git commit -m "Your changes"
git push
```
Vercel auto-deploys! (Wait ~1 minute)

---

Questions? Check `DEPLOYMENT_GUIDE.md` for detailed steps.
