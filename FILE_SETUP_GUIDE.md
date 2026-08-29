# File Setup Guide - Visual Step-by-Step 📁

## Downloaded Files You'll Receive

```
Downloaded Files:
├── DEPLOYMENT_GUIDE.md (reference)
├── QUICKSTART.md (quick reference)
├── README-template.md
├── package-json-file.json
├── public-index.html
├── src-index.js
├── src-app.js
├── quiz-platform-app.jsx
└── gitignore-template
```

---

## Your Project Folder Structure (Target)

This is what you need to create:

```
quiz-platform/                 ← Main folder
├── public/                    ← Folder
│   └── index.html
├── src/                       ← Folder
│   ├── index.js
│   ├── App.js
│   └── QuizPlatform.js
├── .gitignore
├── package.json
└── README.md
```

---

## Step-by-Step Setup

### Step 1: Create Main Folder
```
Desktop/
└── quiz-platform/    ← Create this folder
```

### Step 2: Create Subfolders
Inside `quiz-platform/`, create two folders:
```
quiz-platform/
├── public/          ← Create this folder
└── src/             ← Create this folder
```

### Step 3: Copy & Rename Files

#### File 1: `README-template.md`
- **Copy to:** `quiz-platform/`
- **Rename to:** `README.md`

#### File 2: `package-json-file.json`
- **Copy to:** `quiz-platform/`
- **Rename to:** `package.json`
- ⚠️ Important: Remove the `-file.json` part!

#### File 3: `gitignore-template`
- **Copy to:** `quiz-platform/`
- **Rename to:** `.gitignore`
- ⚠️ Important: Add a dot (.) at the start!

#### File 4: `public-index.html`
- **Copy to:** `quiz-platform/public/`
- **Rename to:** `index.html`

#### File 5: `src-index.js`
- **Copy to:** `quiz-platform/src/`
- **Rename to:** `index.js`

#### File 6: `src-app.js`
- **Copy to:** `quiz-platform/src/`
- **Rename to:** `App.js`

#### File 7: `quiz-platform-app.jsx`
- **Copy to:** `quiz-platform/src/`
- **Rename to:** `QuizPlatform.js`

---

## Final Folder Structure

After all files are copied and renamed:

```
quiz-platform/
├── public/
│   └── index.html                    ← from public-index.html
├── src/
│   ├── index.js                      ← from src-index.js
│   ├── App.js                        ← from src-app.js
│   └── QuizPlatform.js               ← from quiz-platform-app.jsx
├── .gitignore                        ← from gitignore-template
├── package.json                      ← from package-json-file.json
└── README.md                         ← from README-template.md
```

---

## Renaming Cheat Sheet

| Downloaded File | Copy To | Rename To |
|---|---|---|
| `README-template.md` | `quiz-platform/` | `README.md` |
| `package-json-file.json` | `quiz-platform/` | `package.json` |
| `gitignore-template` | `quiz-platform/` | `.gitignore` |
| `public-index.html` | `quiz-platform/public/` | `index.html` |
| `src-index.js` | `quiz-platform/src/` | `index.js` |
| `src-app.js` | `quiz-platform/src/` | `App.js` |
| `quiz-platform-app.jsx` | `quiz-platform/src/` | `QuizPlatform.js` |

---

## Verify Your Setup

✅ Check these things:

1. **Is `.gitignore` a file?** (with a dot at the start)
   - ❌ Wrong: `gitignore-template`
   - ✅ Correct: `.gitignore`

2. **Is `package.json` exactly named that?**
   - ❌ Wrong: `package-json-file.json`
   - ✅ Correct: `package.json`

3. **Is `index.html` in the `public` folder?**
   - ❌ Wrong: `quiz-platform/index.html`
   - ✅ Correct: `quiz-platform/public/index.html`

4. **Are `.js` files in the `src` folder?**
   - ❌ Wrong: `quiz-platform/index.js`
   - ✅ Correct: `quiz-platform/src/index.js`

---

## Using Visual File Explorer (Recommended)

### On Windows:
1. Open **File Explorer**
2. Create folder structure by right-clicking → "New Folder"
3. Drag and drop files into correct locations
4. Rename by right-clicking → "Rename"

### On Mac:
1. Open **Finder**
2. Create folders by Cmd+Shift+N
3. Drag and drop files
4. Right-click → "Rename"

### On Linux:
```bash
mkdir -p quiz-platform/{public,src}
# Then copy files using cp or drag-drop in file manager
```

---

## Next: Push to GitHub

Once files are organized correctly, follow **QUICKSTART.md** to push to GitHub and deploy! 🚀
