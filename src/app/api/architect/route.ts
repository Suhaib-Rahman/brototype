import { NextResponse } from 'next/server';

interface Message {
  role?: string;
  sender?: string;
  content?: string;
  text?: string;
}

export async function POST(req: Request) {
  try {
    const { messages, projectContext, generateFeasibility, mode } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API Key not configured. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    // Mode 1: Full Floor Plan Generation or Editing (Feasibility/Architect Mode)
    if (generateFeasibility || mode === 'edit') {
      const isEditing = mode === 'edit';
      const systemPrompt = `
You are an elite Senior Architect and Computation Design Expert. 
${isEditing ? "The user wants to MODIFY an existing floor plan based on specific instructions." : "Your task is to generate a comprehensive, valid JSON FloorPlan object based on user requirements with MATHEMATICAL PRECISION."}

CORE OBJECTIVE: 
Generate an EXACT architectural plan where every room is placed on a logical structural grid. 
Avoid arbitrary placements. Ensure room dimensions (realW, realH) are realistic and their square footage (sqft) is calculated exactly (realW * realH). 

The output must match this TypeScript interface exactly:

interface Room {
  id: string;
  name: string;
  type: string; // e.g. "living_room", "bedroom", "kitchen", "bathroom", "dining", "balcony", "puja_room"
  x: number; // 0-400 (canvas coordinates)
  y: number; // 0-600 (canvas coordinates)
  w: number; // width in canvas units
  h: number; // height in canvas units
  realW: number; // width in feet
  realH: number; // height in feet
  color: string; // rgba color string
  reasoning: string; // 1-2 sentences on why this room is here
  sqft: number;
  floor: number;
  doors: { x: number, y: number, width: number }[];
  windows: { wall: "north"|"south"|"east"|"west", size: number }[];
}

interface FloorPlan {
  id: string;
  templateId: "ai-generated";
  floors: number;
  totalSqft: number;
  plotSqft: number;
  rooms: Room[];
  viewBoxW: number; // Recommended: 400
  viewBoxH: number; // Recommended: 600
  generatedAt: string; // ISO string
  plotContext: { width: number, height: number, orientation: string, location_context: string };
  design_summary: { concept: string, zoning: string, target_user: string };
  circulation: { entry_point: string, movement_flow: string, efficiency_score: number };
  environmental_logic: { light: string, ventilation: string, climate_response: string };
  design_scores: { space_efficiency: number, ventilation_quality: number, cost_efficiency: number };
  ai_suggestions: string[];
  cost_estimate: {
    total_area_sqft: number;
    cost_per_sqft: { economy: number, standard: number, premium: number, luxury: number };
    total_cost: { economy: number, standard: number, premium: number, luxury: number };
  };
  plan_score: { space_efficiency: number, cost_efficiency: number, climate_suitability: number, compliance_safety: number, total: number };
  confidence_score: number;
  confidence_label: "Low" | "Medium" | "High";
  assumptions: string[];
  constraints: string[];
  risks: string[];
  improvement_insights: string[];
}

RULES:
1. Output ONLY valid JSON.
2. Ensure rooms do not overlap and are logically connected.
3. Use realistic dimensions (e.g. Master Bedroom 14'x16').
4. Vastu/Climate: Orient kitchen to SE if possible, Living to North/East.
5. Canvas coordinates: Keep rooms within 0-viewBoxW and 0-viewBoxH.
6. Return a complete, high-fidelity response.
${isEditing ? "CRITICAL: You MUST maintain the general layout of the existing plan while applying the requested changes. Do not change IDs of existing rooms unless they are removed or replaced." : ""}
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
            parts: [{ text: `Conversation History: ${JSON.stringify(messages)}\n\nProject Context: ${JSON.stringify(projectContext)}` }]
          }],
          generationConfig: {
            temperature: isEditing ? 0.4 : 0.8,
            responseMimeType: "application/json"
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gemini API Error");

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      return NextResponse.json(JSON.parse(reply));
    }

    // Mode 2: Conversational Architect / Copilot Mode
    const isCopilot = mode === 'copilot';
    
    const systemPrompt = isCopilot 
      ? `You are an elite Architectural Copilot within the ARCOVA Architectural Operating System.
         You are analyzing the current floor plan and providing expert feedback.
         Context: ${JSON.stringify(projectContext)}
         Focus on: Code compliance, Vastu/Feng Shui, cost optimization, and spatial efficiency.
         Be concise, professional, and insightful. Avoid generic advice; be specific to the layout provided.`
      : `You are the primary "Architectural Intelligence Engine" for the ARCOVA platform. 
         You are currently operating in STAGE 01: HUMAN UNDERSTANDING & LIFESTYLE INTELLIGENCE.
         
         CORE MISSION: Architecture is not just geometry; it is a response to human behavior, emotional needs, and lifestyle patterns. You must understand the PEOPLE before the SPACE.
         
         STAGE 01 — HUMAN UNDERSTANDING: Focus on behavior and lifestyle.
         STAGE 02 — SITE INPUT: Collect sketches and validate requirements.
         STAGE 03 — REGULATORY: Calculate FAR, setbacks, and feasibility.
         STAGE 04 — ZONING: Map spatial relationships and circulation flow.
         
         STAGE 05 — PLAN DRAFTING & TECHNICAL INTELLIGENCE:
         1. DRAFTING IQ: Generate dimensionally accurate, executable architectural plans (walls, doors, windows).
         2. COORDINATION: Synchronize Furniture, Structural, Electrical, and Plumbing (MEP) systems.
         3. TECHNICAL SPECS: Define wall thickness, structural spacing, ceiling heights, and clearances.
         4. REASONING: Explain every technical decision (e.g., column placement for load distribution).
         5. CONSTRUCTION READY: Ensure all elements are technically feasible and dimensionally precise.
         
         CONVERSATIONAL RULES:
         - Drafting is construction-ready engineering, not just drawing.
         - Maintain synchronization between technical layers (e.g., updating a wall updates electrical/plumbing).
         - Use technical terminology (Load distribution, MEP coordination, Fixture positioning).
         - Provide deep reasoning for spatial and structural choices.
         
         CRITICAL INSTRUCTION: Once you have gathered enough human and site intelligence to generate a floor plan, you MUST append the exact string "[GENERATE_PLAN_READY]" at the very end of your response.`.trim();

    // Convert standard {role, content} to Gemini {role, parts: [{text}]} format
    const formattedContents = messages.map((m: Message) => ({
      role: (m.role === 'user' || m.sender === 'user') ? 'user' : 'model',
      parts: [{ text: m.content || m.text }]
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
          temperature: 0.7,
          topP: 0.95,
          topK: 40
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      // Specifically handle expired keys or quota issues
      if (data.error?.status === 'UNAUTHENTICATED') {
        throw new Error("Your Gemini API key is invalid or expired. Please update it in .env.local.");
      }
      throw new Error(data.error?.message || "Gemini API Error");
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I could not process that request.";
    
    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Gemini API Error:', errorMsg);
    return NextResponse.json(
      { error: errorMsg || 'An error occurred during your request.' },
      { status: 500 }
    );
  }
}
