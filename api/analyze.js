export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  const { resumeText, filters } = req.body;
  if (!resumeText || resumeText.trim().length < 50) {
    return res.status(400).json({ error: 'Resume text too short or missing. Please upload a valid text-based PDF.' });
  }

  const prompt = `You are an expert resume parser for a Philippine job matching platform for fresh graduates.

Analyze the following resume and return ONLY a valid JSON object. No markdown, no explanation, no backticks.

Resume:
"""
${resumeText.slice(0, 6000)}
"""

Return exactly this JSON:
{
  "name": "full name",
  "degree": "college degree e.g. Computer Science",
  "school": "university or college name",
  "topRole": "best entry-level job title e.g. Junior Software Developer",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "summary": "2-sentence professional summary in third person for a fresh graduate",
  "strengths": ["strength1", "strength2", "strength3"]
}

Preferences: Location: ${filters?.location || 'Metro Manila'}, Type: ${filters?.type || 'Full-time'}, Salary: ${filters?.salary || 'Any'}

Return ONLY the JSON. Nothing else.`;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 800,
        messages: [
          { role: 'system', content: 'You are a precise resume parser. Always respond with valid JSON only. No markdown, no extra text.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errData = await groqRes.json();
      return res.status(502).json({ error: errData?.error?.message || 'AI service error. Please try again.' });
    }

    const groqData = await groqRes.json();
    const rawText = groqData.choices?.[0]?.message?.content || '';
    const clean = rawText.replace(/```json|```/g, '').trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(422).json({ error: 'Could not read resume. Make sure your PDF has selectable text (not a scanned image).' });
    }

    const profile = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ profile });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unexpected error. Please try again.' });
  }
}