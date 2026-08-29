export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'AI service is not configured.' });
  try {
    const { text, count = 10 } = req.body || {};
    if (!text) return res.status(400).json({ error: 'No document text supplied.' });
    const prompt = `Create exactly ${Math.min(Number(count), 30)} multiple-choice questions from the study material below. Return ONLY valid JSON in this shape: {"questions":[{"question":"...","options":["...","...","...","..."],"correctIndex":0}]}. Make questions answerable from the supplied material, avoid duplicates, and keep options plausible.\n\nSTUDY MATERIAL:\n${String(text).slice(0, 30000)}`;
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6', max_tokens: 6000, messages: [{ role: 'user', content: prompt }] })
    });
    if (!r.ok) return res.status(502).json({ error: 'AI generation failed.' });
    const data = await r.json(); const raw = data.content?.[0]?.text || ''; const match = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : raw);
    return res.status(200).json(parsed);
  } catch (error) { return res.status(500).json({ error: 'Could not generate the quiz.' }); }
}
