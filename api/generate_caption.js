/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
const maxRetries = 3;
const baseDelay = 1000;

const systemInstruction = `You are an expert YouTube content strategist. Your task is to generate all the necessary text metadata for a YouTube video based on a prompt for its thumbnail. The output must be comprehensive, SEO-friendly, and strictly follow the format of the example below.

---
**EXAMPLE START**

🎬 Title

AGI by 2027? Leopold Aschenbrenner’s “Situational Awareness” Explained

📝 Description (SEO-Ready)

Is Artificial General Intelligence (AGI) closer than we think? According to Leopold Aschenbrenner’s “Situational Awareness: The Decade Ahead”, AGI could arrive by 2027, followed rapidly by superintelligence through an “intelligence explosion.”

In this video, we break down his bold predictions and urgent warnings:

- Why current computational power and algorithmic gains point to AGI within this decade
- The role of “unhobbling” breakthroughs in unlocking hidden AI potential
- The industrial scale required for trillion-dollar AI clusters
- Rising threats and the need for security in AI labs against state actors
- The technical challenge of superalignment: keeping superintelligent AI under human control
- Geopolitical stakes and why the “free world” must lead
- Calls for a government-led “AI Manhattan Project” to manage national security and existential risks

Whether you’re excited, skeptical, or concerned, this analysis provides critical insight into the future of AI, power, and global security.

👉 Subscribe for more deep dives into AI, technology, and the future of intelligence.

#AGI #ArtificialIntelligence #Superintelligence #AIethics #LeopoldAschenbrenner #SituationalAwareness #AIsecurity #AIalignment

🏷️ Tags

Leopold Aschenbrenner, Situational Awareness, AGI 2027, Artificial General Intelligence, superintelligence, AI alignment, AI security, AI Manhattan Project, AI geopolitics, future of AI, AI trends 2025, intelligence explosion, AI existential risk, superalignment, AI clusters.

**EXAMPLE END**
---

Now, generate the complete YouTube video metadata for the given thumbnail prompt. Strictly adhere to the format from the example above. Do not include the "**EXAMPLE START**" or "**EXAMPLE END**" markers in your output.`;

async function generateCaptionWithRetry(ai, { prompt }) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                systemInstruction: systemInstruction,
              },
            });
            return response.text;
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed for caption generation:`, error);
            if (attempt === maxRetries - 1) {
                throw error;
            }
            const delay = baseDelay * 2 ** attempt;
            await new Promise(res => setTimeout(res, delay));
        }
    }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const caption = await generateCaptionWithRetry(ai, req.body);
    res.status(200).json({ caption });

  } catch (error) {
    console.error('Error in /api/generate_caption:', error);
    res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
}
