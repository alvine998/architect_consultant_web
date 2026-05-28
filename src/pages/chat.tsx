import { useState, useRef, useEffect, type ReactNode } from "react";
import { ApiRequestError, apiRequest, setStoredToken } from "@/lib/api-client";
import {
  ImageIcon,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  action?: "retry-otp";
  actionLabel?: string;
  actionUrl?: string;
  imageUrl?: string;
  timestamp: Date;
}

interface UserIdentity {
  id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  projectIntent: string;
}

interface ApiUser {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  chat_limit: number;
  createdAt?: string;
  updatedAt?: string;
}

type IntakeStep =
  | "fullName"
  | "email"
  | "phoneNumber"
  | "otp"
  | "projectIntent"
  | "ready";

type ImageMode = "identify" | "generate";

const WHATSAPP_ADMIN_PHONE = "628123456789";
const WHATSAPP_ADMIN_DISPLAY = "08123456789";
const WHATSAPP_ADMIN_URL = `https://wa.me/${WHATSAPP_ADMIN_PHONE}?text=${encodeURIComponent(
  "Halo Admin ArchitectAI, saya ingin konsultasi RAB/ROI untuk proyek saya.",
)}`;

const isRabOrRoiRequest = (message: string) =>
  /\b(rab|roi)\b/i.test(message) ||
  /rencana anggaran biaya/i.test(message) ||
  /return on investment/i.test(message);

const getResponseContent = (
  response: {
    message?: string | null;
    assistant?: {
      content?: string | null;
    } | null;
  },
  fallback = "I could not generate a response. Please try again.",
) => {
  const assistantContent = response.assistant?.content?.trim();
  const messageContent = response.message?.trim();

  return assistantContent || messageContent || fallback;
};

const getTopicErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiRequestError) || error.status !== 403) {
    return null;
  }

  const data = error.data as {
    message?: string;
    topic?: {
      reason?: string;
      allowed_topics?: string[];
    };
  } | null;
  const reason = data?.topic?.reason;
  const allowedTopics = data?.topic?.allowed_topics?.join(", ");

  return [
    data?.message ||
      "This question is outside the allowed topic for this assistant.",
    reason ? `Reason: ${reason}` : "",
    allowedTopics ? `Please ask about: ${allowedTopics}.` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
};

const stripThinkingSections = (content: string) =>
  content
    .replace(
      /^\s*\d+\.\s+\*\*(Deconstruct|Initial Assessment|Break Down|Synthesize|Identify)[\s\S]*?(?=\n\s*\d+\.\s+\*\*|$)/gim,
      "",
    )
    .trim() ||
  (/(Deconstruct the User|Initial Assessment|Break Down the Timeline)/i.test(
    content,
  )
    ? "Maaf, jawaban AI berisi catatan internal. Silakan kirim ulang pertanyaan agar saya jawab langsung dan ringkas."
    : content);

const formatInlineText = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
};

const renderFormattedMessage = (content: string) => {
  const cleanedContent = stripThinkingSections(content);
  const lines = cleanedContent
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const elements: ReactNode[] = [];
  let listItems: ReactNode[] = [];

  const flushList = () => {
    if (!listItems.length) return;

    elements.push(
      <ul
        key={`list-${elements.length}`}
        className="my-2 list-disc space-y-1 pl-5"
      >
        {listItems}
      </ul>,
    );
    listItems = [];
  };

  lines.forEach((line, index) => {
    const bulletMatch = line.match(/^[-*]\s+(.+)/);
    const numberedMatch = line.match(/^\d+\.\s+(.+)/);
    const headingMatch = line.match(/^\*\*([^*]+)\*\*:?\s*(.*)$/);

    if (bulletMatch || numberedMatch) {
      const text = bulletMatch?.[1] || numberedMatch?.[1] || line;
      listItems.push(
        <li key={`item-${index}`} className="leading-relaxed">
          {formatInlineText(text)}
        </li>,
      );
      return;
    }

    flushList();

    if (headingMatch) {
      elements.push(
        <div key={`heading-${index}`} className="mt-3 first:mt-0">
          <p className="font-bold text-brown-900">{headingMatch[1]}</p>
          {headingMatch[2] && (
            <p className="mt-1 leading-relaxed">
              {formatInlineText(headingMatch[2])}
            </p>
          )}
        </div>,
      );
      return;
    }

    elements.push(
      <p key={`paragraph-${index}`} className="leading-relaxed">
        {formatInlineText(line)}
      </p>,
    );
  });

  flushList();

  return <div className="space-y-2">{elements}</div>;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! Before we start your architectural consultation, please share your full name.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [imageMode, setImageMode] = useState<ImageMode>("identify");
  const [imageRemaining, setImageRemaining] = useState(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState("");
  const [intakeStep, setIntakeStep] = useState<IntakeStep>("fullName");
  const [userIdentity, setUserIdentity] = useState<UserIdentity>({
    fullName: "",
    email: "",
    phoneNumber: "",
    emailVerified: false,
    projectIntent: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (selectedImagePreview) {
        URL.revokeObjectURL(selectedImagePreview);
      }
    };
  }, [selectedImagePreview]);

  const addAssistantMessage = (content: string) => {
    const assistantMessage: Message = {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  const addRetryOtpMessage = (content: string) => {
    const assistantMessage: Message = {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      content,
      action: "retry-otp",
      actionLabel: "Refresh OTP",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  const addRabRoiHandoffMessage = () => {
    const assistantMessage: Message = {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      content: `Please contact admin for RAB or ROI hand-off. The admin team needs to handle it directly so that cost estimates, material assumptions, and potential returns can be calculated more accurately.\n\nPlease contact the admin via WhatsApp at ${WHATSAPP_ADMIN_DISPLAY}.`,
      //   content: `Untuk kebutuhan RAB atau ROI, tim admin kami perlu menangani langsung supaya estimasi biaya, asumsi material, dan potensi balik modal bisa dihitung lebih akurat.\n\nSilakan hubungi admin melalui WhatsApp ${WHATSAPP_ADMIN_DISPLAY}.`,
      actionLabel: "Chat Admin via WhatsApp",
      actionUrl: WHATSAPP_ADMIN_URL,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  const getInputPlaceholder = () => {
    switch (intakeStep) {
      case "fullName":
        return "Enter your full name...";
      case "email":
        return "Enter your email address...";
      case "phoneNumber":
        return "Enter your phone number...";
      case "otp":
        return "Enter the 6-digit OTP...";
      case "projectIntent":
        return "Tell me what you want to build...";
      default:
        return "Ask me about architectural designs, planning, and more...";
    }
  };

  const requestOtp = async (identity: UserIdentity) => {
    const response = await apiRequest<{
      message: string;
      user: {
        id: number | string;
        name: string;
        email: string;
        phone: string;
        chat_limit: number;
      };
      userCreated: boolean;
    }>("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({
        name: identity.fullName,
        email: identity.email,
        phone: identity.phoneNumber,
      }),
    });

    setUserIdentity((prev) => ({
      ...prev,
      id: String(response.user.id),
      fullName: response.user.name,
      email: response.user.email,
      phoneNumber: response.user.phone,
    }));

    const responseMessage = response.message?.trim() || "OTP sent to email.";

    addAssistantMessage(
      `${responseMessage} Please enter it to verify your email. Type "resend OTP" if you need a new code.`,
    );
  };

  const retryOtpRequest = async () => {
    if (!userIdentity.fullName || !userIdentity.email || !userIdentity.phoneNumber) {
      addAssistantMessage(
        "Please complete your full name, email, and phone number before requesting OTP again.",
      );
      return;
    }

    setLoading(true);

    try {
      setIntakeStep("otp");
      await requestOtp(userIdentity);
    } catch (error) {
      console.error("Error retrying OTP:", error);
      addRetryOtpMessage(
        error instanceof ApiRequestError
          ? error.message
          : "Sorry, I could not send the OTP. Please check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addAssistantMessage("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
    }

    setSelectedImage(file);
    setSelectedImagePreview(URL.createObjectURL(file));
  };

  const clearSelectedImage = (revokePreview = true) => {
    if (revokePreview && selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
    }

    setSelectedImage(null);
    setSelectedImagePreview("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const sendImageMessage = async (prompt: string) => {
    if (intakeStep !== "ready") {
      addAssistantMessage("Please verify your email before using image tools.");
      return;
    }

    if (imageMode === "generate") {
      if (imageRemaining <= 0) {
        addAssistantMessage("Image generation is available only once per day.");
        return;
      }

      if (!prompt) {
        addAssistantMessage("Please describe the image you want to generate.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-user`,
          role: "user",
          content: `Generate image: ${prompt}`,
          timestamp: new Date(),
        },
      ]);
      setInput("");
      setLoading(true);

      try {
        const response = await apiRequest<{
          images?: string[];
          data?: Array<{ url: string }>;
          quota?: { image_remaining: number };
        }>("/api/ai/images", {
          method: "POST",
          body: JSON.stringify({
            prompt,
            size: "1280x1280",
          }),
        });
        const imageUrl = response.images?.[0] || response.data?.[0]?.url;

        if (!imageUrl) {
          throw new Error("Image URL was not returned.");
        }

        setImageRemaining(response.quota?.image_remaining ?? 0);
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-assistant`,
            role: "assistant",
            content: "Generated image",
            imageUrl,
            timestamp: new Date(),
          },
        ]);
      } catch (error) {
        console.error("Error generating image:", error);
        const topicErrorMessage = getTopicErrorMessage(error);
        addAssistantMessage(
          topicErrorMessage ||
            (error instanceof ApiRequestError
              ? error.message
              : "Sorry, I could not generate the image. Please try again."),
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    if (!selectedImage) {
      addAssistantMessage("Please upload an image to identify.");
      return;
    }

    const imageDescription =
      prompt || "Please identify this architecture image.";

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-user`,
        role: "user",
        content: imageDescription,
        imageUrl: selectedImagePreview,
        timestamp: new Date(),
      },
    ]);
    setInput("");
    setLoading(true);

    try {
      const response = await apiRequest<{
        message: string;
        assistant?: {
          role: "assistant";
          content: string;
        };
        quota?: {
          image_remaining: number;
        };
      }>("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message: `${imageDescription}\n\nUploaded image: ${selectedImage.name}. The frontend has attached this image preview; analyze it if image understanding is supported by the API.`,
          max_output_tokens: 800,
        }),
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: getResponseContent(
            response,
            "I could not identify the image. Please try again.",
          ),
          timestamp: new Date(),
        },
      ]);
      if (typeof response.quota?.image_remaining === "number") {
        setImageRemaining(response.quota.image_remaining);
      }
      clearSelectedImage(false);
    } catch (error) {
      console.error("Error identifying image:", error);
      const topicErrorMessage = getTopicErrorMessage(error);
      addAssistantMessage(
        topicErrorMessage ||
          (error instanceof ApiRequestError
            ? error.message
            : "Sorry, I could not identify the image. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleIntakeMessage = async (message: string) => {
    if (intakeStep === "fullName") {
      setUserIdentity((prev) => ({ ...prev, fullName: message }));
      setIntakeStep("email");
      addAssistantMessage("Thanks. What email address should we use?");
      return;
    }

    if (intakeStep === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(message)) {
        addAssistantMessage(
          "Please enter a valid email address before we continue.",
        );
        return;
      }

      setUserIdentity((prev) => ({ ...prev, email: message }));
      setIntakeStep("phoneNumber");
      addAssistantMessage("Great. What is your phone number?");
      return;
    }

    if (intakeStep === "phoneNumber") {
      const phoneDigits = message.replace(/\D/g, "");

      if (phoneDigits.length < 10 || phoneDigits.length > 13) {
        addAssistantMessage(
          "Please enter a valid phone number with 10 to 13 digits.",
        );
        return;
      }

      const nextIdentity = {
        ...userIdentity,
        phoneNumber: phoneDigits,
      };

      setUserIdentity(nextIdentity);
      setLoading(true);

      try {
        setIntakeStep("otp");
        await requestOtp(nextIdentity);
      } catch (error) {
        console.error("Error requesting OTP:", error);
        addRetryOtpMessage(
          error instanceof ApiRequestError
            ? error.message
            : "Sorry, I could not send the OTP. Please check your details and try again.",
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    if (intakeStep === "otp") {
      if (message.toLowerCase().includes("resend")) {
        setLoading(true);

        try {
          await requestOtp(userIdentity);
        } catch (error) {
          console.error("Error resending OTP:", error);
          addRetryOtpMessage(
            error instanceof ApiRequestError
              ? error.message
              : "Sorry, I could not resend the OTP. Please try again.",
          );
        } finally {
          setLoading(false);
        }

        return;
      }

      setLoading(true);

      try {
        const response = await apiRequest<{
          message: string;
          user: ApiUser;
          token: string;
        }>("/api/auth/verify-otp", {
          method: "POST",
          body: JSON.stringify({
            email: userIdentity.email,
            code: message.replace(/\s/g, ""),
          }),
        });

        if (!response.token) {
          throw new Error("Token was not returned after OTP verification.");
        }

        setStoredToken(response.token);
        setUserIdentity((prev) => ({
          ...prev,
          id: String(response.user.id),
          fullName: response.user.name,
          email: response.user.email,
          phoneNumber: response.user.phone,
          emailVerified: true,
        }));
        setIntakeStep("projectIntent");
        const responseMessage =
          response.message?.trim() || "OTP verified successfully";
        addAssistantMessage(`${responseMessage}. What do you want to build?`);
      } catch (error) {
        console.error("Error verifying OTP:", error);
        addAssistantMessage(
          error instanceof ApiRequestError
            ? error.message
            : "That OTP is not correct. Please check your email and try again.",
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    if (intakeStep === "projectIntent") {
      const completedIdentity = {
        ...userIdentity,
        projectIntent: message,
      };

      setUserIdentity(completedIdentity);
      setIntakeStep("ready");

      if (isRabOrRoiRequest(message)) {
        addRabRoiHandoffMessage();
        return;
      }

      setLoading(true);

      try {
        const aiResponse = await apiRequest<{
          message: string;
          assistant?: {
            role: "assistant";
            content: string;
          };
          quota?: {
            image_remaining: number;
          };
        }>("/api/ai/chat", {
          method: "POST",
          body: JSON.stringify({
            message,
            system:
              "Answer directly as an architecture consultant. Do not include hidden reasoning, analysis notes, planning scaffolds, or phrases like 'Deconstruct the user request'. Use concise sections and practical bullets.",
            max_output_tokens: 800,
          }),
        });

        const aiMessage: Message = {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: getResponseContent(aiResponse),
          timestamp: new Date(),
        };

        if (typeof aiResponse.quota?.image_remaining === "number") {
          setImageRemaining(aiResponse.quota.image_remaining);
        }

        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
        const topicErrorMessage = getTopicErrorMessage(error);
        addAssistantMessage(
          topicErrorMessage ||
            "Sorry, I encountered an error processing your project details. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !(intakeStep === "ready" && selectedImage)) return;

    const currentInput = input.trim();

    if (intakeStep === "ready" && (selectedImage || imageMode === "generate")) {
      await sendImageMessage(currentInput);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (intakeStep !== "ready") {
      await handleIntakeMessage(currentInput);
      return;
    }

    if (isRabOrRoiRequest(currentInput)) {
      addRabRoiHandoffMessage();
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest<{
        message: string;
        assistant?: {
          role: "assistant";
          content: string;
        };
        quota?: {
          image_remaining: number;
        };
      }>("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          system:
            "Answer directly as an architecture consultant. Do not include hidden reasoning, analysis notes, planning scaffolds, or phrases like 'Deconstruct the user request'. Use concise sections and practical bullets.",
          max_output_tokens: 800,
        }),
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getResponseContent(response),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const topicErrorMessage = getTopicErrorMessage(error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content:
          topicErrorMessage ||
          "Sorry, I encountered an error processing your message. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-brown-800 text-white sticky top-0 z-10 px-4 py-4 sm:px-6 sm:py-5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold">
            Architect Consultant
          </h1>
          <p className="text-brown-200 text-xs sm:text-sm mt-1">
            AI-powered architectural guidance
          </p>
        </div>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 bg-gradient-to-b from-white to-brown-50">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-2xl px-4 py-3 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl ${
                  message.role === "user"
                    ? "bg-brown-700 text-white rounded-br-none"
                    : "bg-brown-100 text-brown-900 rounded-bl-none"
                } shadow-sm`}
              >
                {message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt={
                      message.role === "assistant"
                        ? "Generated architecture result"
                        : "Uploaded architecture reference"
                    }
                    className="mb-3 max-h-72 w-full rounded-lg object-cover"
                  />
                )}
                <div className="text-sm sm:text-base break-words">
                  {message.role === "assistant"
                    ? renderFormattedMessage(message.content)
                    : message.content}
                </div>
                {message.actionUrl && (
                  <a
                    href={message.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    {message.actionLabel}
                  </a>
                )}
                {message.action === "retry-otp" && (
                  <button
                    type="button"
                    onClick={retryOtpRequest}
                    disabled={loading}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brown-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brown-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    {message.actionLabel}
                  </button>
                )}
                {isClient && (
                  <span
                    className={`text-xs mt-2 block ${
                      message.role === "user"
                        ? "text-brown-200"
                        : "text-brown-600"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-brown-100 to-brown-50 text-brown-900 px-4 py-3 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl rounded-bl-none shadow-md border border-brown-200">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-brown-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 sm:w-3 sm:h-3 bg-brown-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 sm:w-3 sm:h-3 bg-brown-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-brown-700 animate-pulse">
                    Thinking
                    <span className="inline-block">
                      <span
                        className="animate-pulse"
                        style={{ animationDelay: "0s" }}
                      >
                        .
                      </span>
                      <span
                        className="animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      >
                        .
                      </span>
                      <span
                        className="animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      >
                        .
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-brown-200 px-4 py-3 sm:px-6 sm:py-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          {intakeStep === "ready" && (
            <div className="mb-3 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setImageMode("identify")}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    imageMode === "identify"
                      ? "bg-brown-700 text-white"
                      : "bg-brown-100 text-brown-700 hover:bg-brown-200"
                  }`}
                >
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Identify Image
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("generate")}
                  disabled={imageRemaining <= 0}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    imageMode === "generate"
                      ? "bg-brown-700 text-white"
                      : "bg-brown-100 text-brown-700 hover:bg-brown-200"
                  }`}
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Generate Image ({imageRemaining})
                </button>

                {imageMode === "identify" && (
                  <>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-lg border border-brown-300 px-3 py-2 text-xs font-semibold text-brown-700 transition-colors hover:bg-brown-50"
                    >
                      <ImageIcon className="h-4 w-4" aria-hidden="true" />
                      Upload Image
                    </button>
                  </>
                )}
              </div>

              {selectedImagePreview && imageMode === "identify" && (
                <div className="flex items-center gap-3 rounded-lg border border-brown-200 bg-brown-50 p-2">
                  <img
                    src={selectedImagePreview}
                    alt="Selected image preview"
                    className="h-14 w-14 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-brown-900">
                      {selectedImage?.name}
                    </p>
                    <p className="text-xs text-brown-600">
                      Add an optional question, then send.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => clearSelectedImage()}
                    className="rounded-md p-2 text-brown-600 transition-colors hover:bg-brown-100 hover:text-brown-900"
                    aria-label="Remove selected image"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 sm:gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getInputPlaceholder()}
              disabled={loading}
              rows={1}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-brown-300 rounded-lg sm:rounded-xl bg-white text-brown-900 placeholder-brown-500 focus:outline-none focus:ring-2 focus:ring-brown-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none max-h-20"
            />
            <button
              onClick={handleSendMessage}
              disabled={
                loading ||
                (!input.trim() && !(intakeStep === "ready" && selectedImage))
              }
              className="px-4 sm:px-6 py-2 sm:py-3 bg-brown-700 hover:bg-brown-800 text-white font-semibold rounded-lg sm:rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-brown-600 mt-2">
            Press Shift + Enter for new line
          </p>
        </div>
      </footer>
    </div>
  );
}
