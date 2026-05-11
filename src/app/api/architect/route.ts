import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, projectContext, generateFeasibility } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API Key not configured. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Mode 1: JSON Floor Plan Generation
    if (generateFeasibility) {
      const systemPrompt = `
You are an elite Senior Architect. The user has provided their architectural conversation history.
Your task is to analyze their requirements and output ONLY a valid JSON object matching this schema:
{
  "feasibility_score": number (0-100),
  "recommended_project_type": "string",
  "suggested_area_sqft": "string",
  "estimated_cost_range": "string",
  "timeline_estimate": "string",
  "risks": ["string", "string"],
  "assumptions": ["string", "string"],
  "rooms": [
    { "id": "uuid", "name": "string", "width": number (meters), "length": number (meters), "height": 3.2, "floorFinish": "Hardwood", "wallFinish": "Off White Paint" }
  ]
}
Ensure the rooms generated logically match the user's requested bedrooms/bathrooms and special zones.
      `.trim();

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [{
            role: "user",
            parts: [{ text: JSON.stringify(projectContext) }]
          }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json"
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gemini API Error");

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      return NextResponse.json(JSON.parse(reply));
    }

    // Mode 2: Standard Conversational Chat
    const systemPrompt = `
You are an elite Senior Architect operating within the ARCOVA Architectural Operating System.
Your goal is to gather requirements from the user to design their building.
You need to know at minimum: 
1. The type of building (e.g., house, office)
2. Number of key rooms (e.g., bedrooms, bathrooms)
3. Architectural style
4. Estimated budget or location

Ask clarifying questions conversationally until you have this information.
CRITICAL INSTRUCTION: Once you have gathered enough information to generate a floor plan, you MUST append the exact string "[GENERATE_PLAN_READY]" at the very end of your response.
    `.trim();

    // Convert standard {role, content} to Gemini {role, parts: [{text}]} format
    const formattedContents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: formattedContents,
        generationConfig: {
          temperature: 0.7
        }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Gemini API Error");

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I could not process that request.";
    
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during your request.' },
      { status: 500 }
    );
  }
}
