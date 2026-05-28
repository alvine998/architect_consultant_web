import type { NextApiRequest, NextApiResponse } from "next";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  userMessage: string;
  userIdentity?: {
    fullName: string;
    email: string;
    phoneNumber: string;
    emailVerified: boolean;
    projectIntent: string;
  };
}

interface ResponseBody {
  reply: string;
}

// Mock responses for the consultant architect
const architectConsultantResponses: { [key: string]: string } = {
  design:
    "For architectural design, I recommend focusing on the fundamental principles: form follows function, user experience, and sustainability. What specific aspects of design are you interested in?",
  planning:
    "Good planning is essential. Consider: project scope, timeline, budget, team structure, and risk management. Would you like to discuss any of these planning elements in detail?",
  structure:
    "Structural integrity is paramount. When designing structures, consider load-bearing capacity, material selection, environmental factors, and safety codes. What type of structure are you planning?",
  sustainable:
    "Sustainable architecture is the future. Incorporate energy efficiency, eco-friendly materials, natural lighting, and green spaces. This reduces environmental impact while improving user experience.",
  default:
    "Thank you for your question. As your architect consultant, I'm here to help with design concepts, project planning, structural considerations, sustainability, and much more. Could you elaborate on what aspect you'd like to discuss?",
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  if (req.method !== "POST") {
    res.status(405).json({ reply: "Method not allowed" });
    return;
  }

  const { messages, userMessage, userIdentity } = req.body as RequestBody;

  if (!userMessage || userMessage.trim() === "") {
    res.status(400).json({ reply: "Message cannot be empty" });
    return;
  }

  // Simple keyword-based response system
  // In production, replace this with actual AI API calls (OpenAI, Anthropic, etc.)
  const lowerMessage = userMessage.toLowerCase();
  let reply = architectConsultantResponses.default;

  if (
    lowerMessage.includes("design") ||
    lowerMessage.includes("aesthetic")
  ) {
    reply = architectConsultantResponses.design;
  } else if (
    lowerMessage.includes("plan") ||
    lowerMessage.includes("timeline")
  ) {
    reply = architectConsultantResponses.planning;
  } else if (
    lowerMessage.includes("structure") ||
    lowerMessage.includes("building")
  ) {
    reply = architectConsultantResponses.structure;
  } else if (
    lowerMessage.includes("sustainable") ||
    lowerMessage.includes("green") ||
    lowerMessage.includes("eco")
  ) {
    reply = architectConsultantResponses.sustainable;
  }

  if (userIdentity?.projectIntent === userMessage) {
    reply = `Thanks, ${userIdentity.fullName}. I understand you want to build: "${userIdentity.projectIntent}". ${reply}`;
  }

  res.status(200).json({ reply });
}
