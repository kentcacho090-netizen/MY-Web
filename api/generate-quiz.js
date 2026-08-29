export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'AI service is not configured. Add GEMINI_API_KEY in Vercel.' });

  try {
    const { pdf, count = 10 } = req.body || {};
    if (!pdf) return res.status(400).json({ error: 'No PDF supplied.' });
    // Vercel Functions have a 4.5 MB request-body limit. The browser sends
    // the PDF as base64, so reject oversized PDFs before they hit that limit.
    if (String(pdf).length > 4_000_000) {
      return res.status(413).json({ error: 'PDF is too large. Please use a PDF smaller than about 3 MB.' });
    }

    const n = Math.min(Math.max(Number(count) || 10, 3), 30);
    const prompt = `Create exactly ${n} multiple-choice questions from the attached study PDF. Return ONLY valid JSON in this exact shape: {"questions":[{"question":"...","options":["...","...","...","..."],"correctIndex":0}]}. Make every question answerable from the document, avoid duplicates, and make all four options plausible. Do not include markdown or any text outside the JSON.`;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inlineData: { mimeType: 'application/pdf', data: pdf } },
              { text: prompt }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      console.error(await response.text());
      return res.status(502).json({ error: 'Gemini could not generate the quiz. Please try again.' });
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed.questions) || !parsed.questions.length) {
      return res.status(502).json({ error: 'Gemini returned an invalid quiz.' });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not generate the quiz.' });
  }
}
