export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  const { pdfBase64, filters } = req.body;
  if (!pdfBase64) {
    return res.status(400).json({ error: 'No resume data provided.' });
  }

  const prompt = `You are a resume parser for a Philippine job matching platform for fresh graduates.
Analyze the attached resume PDF and return ONLY a valid JSON object. No markdown, no explanation, no backticks.

{
  "name": "full name from resume",
  "degree": "college degree e.g. Computer Science",
  "school": "university or college name",
  "topRole": "best entry-level job title for this person e.g. Junior Software Developer",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "summary": "2-sentence professional summary written for a fresh graduate",
  "strengths": ["strength1", "strength2", "strength3"]
}

Location preference: ${filters?.location || 'Metro Manila'}
Job type: ${filters?.type || 'Full-time'}
Salary expectation: ${filters?.salary || 'Any'}

Be accurate. If any field is unclear, make a reasonable inference based on the degree and content.`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: 'application/pdf', data: pdfBase64 } },
              { text: prompt }
            ]
          }]
        }),
      }
    );

    if (!geminiRes.ok) {
      const errData = await geminiRes.json();
      return res.status(502).json({ error: errData?.error?.message || 'Gemini API error' });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Clean and parse JSON
    const clean = rawText.replace(/```json|```/g, '').trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(422).json({ error: 'Could not parse resume. Please try a clearer PDF.' });
    }

    const profile = JSON.parse(jsonMatch[0]);

    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json({ profile });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unexpected server error.' });
  }
}