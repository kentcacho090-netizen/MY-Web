import React, { useState, useRef, useEffect } from 'react';

const QuizPlatform = () => {
  const [mode, setMode] = useState('home'); // home, create, quiz, results, manage
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check URL for quiz parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const quizId = params.get('quiz');
    if (quizId) {
      const quiz = quizzes.find(q => q.id === quizId);
      if (quiz) {
        setCurrentQuiz({ ...quiz, userAnswers: new Array(quiz.questions.length).fill(-1) });
        setMode('quiz');
      }
    }
  }, [quizzes]);

  // Load quizzes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('quizzes');
    if (saved) {
      try {
        setQuizzes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load quizzes', e);
      }
    }
  }, []);

  // Save quizzes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  const handleCreateQuiz = async (pdfFile, numQuestions, timeLimit) => {
    setLoading(true);
    setError('');

    try {
      // Load PDF.js
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = async () => {
        window.pdfjsWorker = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        window.PDFJS.GlobalWorkerOptions.workerSrc = window.pdfjsWorker;

        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const pdf = await window.PDFJS.getDocument({ data: e.target.result }).promise;
            let text = '';

            for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const pageText = content.items.map(item => item.str).join(' ');
              text += pageText + '\n';
            }

            // Call Anthropic API to generate questions
            const response = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'claude-sonnet-4-6',
                max_tokens: 2000,
                messages: [
                  {
                    role: 'user',
                    content: `Based on this document content, generate exactly ${numQuestions} multiple choice quiz questions. Format your response as a JSON array with objects containing: "question", "options" (array of 4 strings), and "correctIndex" (0-3 integer). Return ONLY the JSON array, no other text or markdown.\n\nDocument content:\n${text.substring(0, 4000)}`
                  }
                ]
              })
            });

            const data = await response.json();
            if (!data.content || !data.content[0]) {
              throw new Error('Invalid API response');
            }

            let questions;
            try {
              const content = data.content[0].text;
              const jsonMatch = content.match(/\[[\s\S]*\]/);
              questions = JSON.parse(jsonMatch ? jsonMatch[0] : content);
              
              if (!Array.isArray(questions) || questions.length === 0) {
                throw new Error('Invalid questions format');
              }
            } catch (parseErr) {
              console.error('Parse error:', parseErr, 'Content:', data.content[0].text);
              throw new Error('Failed to parse AI response. Please try again.');
            }

            const newQuiz = {
              id: Date.now().toString(),
              title: pdfFile.name.replace('.pdf', ''),
              questions: questions.slice(0, numQuestions),
              timeLimit,
              createdAt: new Date().toISOString(),
              attempts: []
            };

            setQuizzes([...quizzes, newQuiz]);
            setCurrentQuiz({ ...newQuiz, userAnswers: new Array(Math.min(questions.length, numQuestions)).fill(-1) });
            setMode('quiz');
          } catch (err) {
            setError(err.message || 'Failed to generate questions. Please try again.');
            console.error('Error:', err);
          } finally {
            setLoading(false);
          }
        };

        reader.readAsArrayBuffer(pdfFile);
      };

      script.onerror = () => {
        setError('Failed to load PDF library. Please try again.');
        setLoading(false);
      };

      document.head.appendChild(script);
    } catch (err) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const handleQuizComplete = (answers, timeSpent) => {
    const correct = answers.filter((ans, idx) => ans === currentQuiz.questions[idx].correctIndex).length;
    const score = Math.round((correct / currentQuiz.questions.length) * 100);

    const attempt = {
      timestamp: new Date().toISOString(),
      score,
      correct,
      timeSpent,
      answers
    };

    const updatedQuiz = {
      ...currentQuiz,
      attempts: [...(currentQuiz.attempts || []), attempt]
    };

    setQuizzes(quizzes.map(q => q.id === currentQuiz.id ? updatedQuiz : q));
    setCurrentQuiz({ ...updatedQuiz, results: attempt });
    setMode('results');
  };

  const copyToClipboard = (quizId) => {
    const url = `${window.location.origin}?quiz=${quizId}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Could not copy. Please try again.');
    });
  };

  if (mode === 'home') {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '500', marginBottom: '1rem' }}>Quiz Master</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Create AI-powered quizzes from your PDF files. Share with a link, no sign-up needed.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => setMode('create')}
            style={{
              padding: '12px 16px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Create new quiz
          </button>

          {quizzes.length > 0 && (
            <button
              onClick={() => setMode('manage')}
              style={{
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Manage quizzes ({quizzes.length})
            </button>
          )}
        </div>

        {quizzes.length === 0 && (
          <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f5f5f5', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ color: '#666', marginBottom: '1rem' }}>No quizzes yet. Create your first one!</p>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'create') {
    return <CreateQuizForm onBack={() => setMode('home')} onSubmit={handleCreateQuiz} loading={loading} error={error} />;
  }

  if (mode === 'quiz' && currentQuiz) {
    return <QuizTaker quiz={currentQuiz} onComplete={handleQuizComplete} onBack={() => { setMode('home'); setCurrentQuiz(null); }} />;
  }

  if (mode === 'results' && currentQuiz) {
    return <ResultsView quiz={currentQuiz} onBack={() => { setMode('home'); setCurrentQuiz(null); }} onCopy={() => copyToClipboard(currentQuiz.id)} />;
  }

  if (mode === 'manage') {
    return <ManageQuizzes quizzes={quizzes} onSelectQuiz={(q) => { setCurrentQuiz(q); setMode('quiz'); }} onBack={() => setMode('home')} onDelete={(id) => setQuizzes(quizzes.filter(q => q.id !== id))} onCopy={copyToClipboard} />;
  }

  return null;
};

const CreateQuizForm = ({ onBack, onSubmit, loading, error }) => {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState(5);
  const [minutes, setMinutes] = useState(10);
  const fileInput = useRef(null);

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: '14px', padding: 0 }}
        >
          ← Back
        </button>
      </div>

      <h2 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '1.5rem' }}>Create a quiz</h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Upload PDF
        </label>
        <div
          onClick={() => fileInput.current?.click()}
          style={{
            border: '2px dashed #ccc',
            borderRadius: '6px',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: file ? '#e8f5e9' : 'transparent'
          }}
        >
          <input
            ref={fileInput}
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0])}
            style={{ display: 'none' }}
          />
          {file ? (
            <p style={{ margin: 0, color: '#2e7d32' }}>{file.name}</p>
          ) : (
            <p style={{ margin: 0, color: '#666' }}>Click to select a PDF file</p>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Number of questions: {questions}
        </label>
        <input type="range" min="3" max="20" value={questions} onChange={(e) => setQuestions(Number(e.target.value))} style={{ width: '100%' }} />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          Time limit (minutes): {minutes}
        </label>
        <input type="range" min="1" max="60" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} style={{ width: '100%' }} />
      </div>

      {error && <p style={{ color: '#d32f2f', marginBottom: '1rem' }}>{error}</p>}

      <button
        onClick={() => file && onSubmit(file, questions, minutes)}
        disabled={!file || loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: file && !loading ? '#0066cc' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: file && !loading ? 'pointer' : 'not-allowed'
        }}
      >
        {loading ? 'Generating questions...' : 'Create quiz'}
      </button>
    </div>
  );
};

const QuizTaker = ({ quiz, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(new Array(quiz.questions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [submitted, setSubmitted] = useState(false);

     useEffect(() => {
     if (timeLeft <= 0 && currentQuestion === quiz.questions.length - 1) {
       onComplete(answers, quiz.timeLimit * 60 - timeLeft);
       return;
     }

     const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
     return () => clearInterval(timer);
   }, [timeLeft, currentQuestion, quiz.questions.length, answers, quiz.timeLimit, onComplete]);

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete(answers, quiz.timeLimit * 60 - timeLeft);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const question = quiz.questions[currentQuestion];
  const progress = Math.round(((currentQuestion + 1) / quiz.questions.length) * 100);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', margin: 0 }}>Question {currentQuestion + 1} of {quiz.questions.length}</h2>
        <div style={{ fontSize: '16px', fontWeight: '500', color: timeLeft < 60 ? '#d32f2f' : '#666' }}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ height: '4px', backgroundColor: '#f0f0f0', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', backgroundColor: '#0066cc', width: `${progress}%`, transition: 'width 0.3s' }}></div>
        </div>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '1.5rem' }}>{question.question}</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem' }}>
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => setAnswers(answers.map((a, i) => i === currentQuestion ? idx : a))}
            style={{
              padding: '12px 16px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              textAlign: 'left',
              cursor: 'pointer',
              backgroundColor: answers[currentQuestion] === idx ? '#e3f2fd' : 'transparent',
              color: answers[currentQuestion] === idx ? '#0066cc' : '#333',
              fontWeight: answers[currentQuestion] === idx ? '500' : '400'
            }}
          >
            {option}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          style={{ flex: 1, padding: '12px', border: '1px solid #ccc', backgroundColor: 'transparent', borderRadius: '6px', cursor: currentQuestion > 0 ? 'pointer' : 'not-allowed' }}
        >
          Previous
        </button>
        {currentQuestion < quiz.questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            style={{ flex: 1, padding: '12px', border: '1px solid #ccc', backgroundColor: 'transparent', borderRadius: '6px', cursor: 'pointer' }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            style={{ flex: 1, padding: '12px', backgroundColor: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
          >
            Submit quiz
          </button>
        )}
      </div>
    </div>
  );
};

const ResultsView = ({ quiz, onBack, onCopy }) => {
  const result = quiz.results;
  const percentage = Math.round((result.correct / quiz.questions.length) * 100);

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '500', marginBottom: '1rem' }}>Quiz complete!</h2>

      <div style={{ backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ fontSize: '48px', fontWeight: '500', color: '#0066cc', marginBottom: '0.5rem' }}>
          {percentage}%
        </div>
        <p style={{ fontSize: '18px', marginBottom: '0.5rem', color: '#666' }}>
          {result.correct} of {quiz.questions.length} correct
        </p>
        <p style={{ fontSize: '14px', color: '#999' }}>
          Time taken: {Math.floor(result.timeSpent / 60)}m {(result.timeSpent % 60).toString().padStart(2, '0')}s
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={onCopy}
          style={{ padding: '12px', backgroundColor: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
        >
          Copy shareable link
        </button>
        <button
          onClick={onBack}
          style={{ padding: '12px', backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}
        >
          Back to home
        </button>
      </div>
    </div>
  );
};

const ManageQuizzes = ({ quizzes, onSelectQuiz, onBack, onDelete, onCopy }) => {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: '14px', padding: 0 }}
        >
          ← Back
        </button>
      </div>

      <h2 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '1.5rem' }}>Your quizzes</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {quizzes.map(quiz => (
          <div
            key={quiz.id}
            style={{
              padding: '1.25rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <p style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 4px 0' }}>{quiz.title}</p>
              <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                {quiz.questions.length} questions • {quiz.attempts.length} attempts
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onCopy(quiz.id)}
                style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}
              >
                Share
              </button>
              <button
                onClick={() => onDelete(quiz.id)}
                style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizPlatform;
