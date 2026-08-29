# Quiz Master

Create AI-powered quizzes from PDF files with a shareable link.

## Features

- 📄 Upload PDFs and auto-generate quiz questions with AI
- ⏱️ Set custom time limits for each quiz
- 🔗 Share quizzes via direct links (no sign-up needed)
- 📊 Track scores and quiz attempts
- 💾 Quizzes stored locally in your browser

## Getting Started

### Prerequisites
- Node.js 14+ and npm
- A GitHub account
- A Vercel account (free)

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/quiz-platform.git
cd quiz-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Deploy"
5. Your site will be live at a URL like `yourproject.vercel.app`

## Usage

1. Click "Create new quiz"
2. Upload a PDF file
3. Set the number of questions and time limit
4. AI generates questions automatically
5. Share the link with others
6. People can take the quiz without signing up

## Technologies Used

- React 18
- pdf.js (for PDF parsing)
- Anthropic Claude API (for AI question generation)
- Vercel (for hosting)

## License

MIT
