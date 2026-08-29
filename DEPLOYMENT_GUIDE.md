# Complete Deployment Guide - Quiz Master

Follow these steps to deploy your quiz platform to a permanent URL.

---

## STEP 1: Set up GitHub (5 minutes)

### 1.1 Create GitHub Account
- Go to **github.com** → Click "Sign up"
- Enter email, create password, choose username
- Verify your email
- Done! ✅

### 1.2 Create a Repository
1. Go to **github.com/new**
2. Fill in:
   - **Repository name:** `quiz-platform`
   - **Description:** `AI-powered quiz platform`
   - **Public** (checked)
3. Click **"Create repository"**
4. You'll see an empty repo page
5. **Copy the HTTPS URL** (looks like `https://github.com/yourname/quiz-platform`)

---

## STEP 2: Download Project Files

I've prepared all the files you need. Here's the structure:

```
quiz-platform/
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   ├── App.js
│   └── QuizPlatform.js
├── package.json
├── .gitignore
└── README.md
```

**Files you'll need:**

1. **package.json** - Dependencies list
2. **public/index.html** - Main HTML file
3. **src/index.js** - React entry point
4. **src/App.js** - Main app component
5. **src/QuizPlatform.js** - The quiz platform code
6. **.gitignore** - Files to ignore in Git
7. **README.md** - Project documentation

---

## STEP 3: Set Up Locally & Push to GitHub

### 3.1 Create a folder for your project
```bash
mkdir quiz-platform
cd quiz-platform
```

### 3.2 Create the project structure
Create these folders:
```bash
mkdir public
mkdir src
```

### 3.3 Add files
- Copy **package.json** to the root folder
- Copy **public/index.html** to the `public/` folder
- Copy **src/index.js**, **src/App.js**, **src/QuizPlatform.js** to the `src/` folder
- Copy **.gitignore** to the root folder
- Copy **README.md** to the root folder

### 3.4 Initialize Git and push to GitHub
```bash
cd quiz-platform
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quiz-platform
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## STEP 4: Deploy to Vercel (2 minutes)

### 4.1 Create Vercel Account
1. Go to **vercel.com**
2. Click **"Sign up"**
3. Click **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub
5. Done! ✅

### 4.2 Deploy Your Project
1. Go to **vercel.com/dashboard**
2. Click **"Add New..." → "Project"**
3. **Select your GitHub repository** (`quiz-platform`)
4. Vercel will auto-detect React settings ✅
5. Click **"Deploy"**
6. Wait ~60 seconds for deployment
7. You'll get a URL like: **`https://quiz-platform-abc123.vercel.app`**

### 4.3 Your Project is Live! 🎉
- Your permanent URL is ready
- Every time you push to GitHub, Vercel auto-deploys
- Share the link with anyone!

---

## STEP 5: Making Changes Later

If you want to add features or fix things:

```bash
# Make changes to your files locally

# Push to GitHub
git add .
git commit -m "Description of changes"
git push

# Vercel automatically redeploys! (Wait ~30-60 seconds)
```

---

## Troubleshooting

### "My site shows 404"
- Wait 2-3 minutes after deployment
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check Vercel dashboard for deployment errors

### "PDF upload isn't working"
- Check browser console (F12 → Console tab)
- Make sure the PDF is under 10MB

### "Questions aren't generating"
- This requires an Anthropic API key in the code
- You may need to add your API key to Vercel environment variables

---

## Optional: Add Your Own Domain

If you want `myquiz.com` instead of the `.vercel.app` URL:

1. Go to **vercel.com/dashboard**
2. Select your project
3. Go to **Settings → Domains**
4. Enter your domain name
5. Follow instructions to add DNS records with your registrar

---

## Need Help?

- Vercel docs: **vercel.com/docs**
- GitHub help: **github.com/support**
- React questions: **react.dev**

You're all set! 🚀
