"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as React from "react";

interface Doc {
  pageContent?: string;
  metadata?: {
    loc?: {
      pageNumber?: number;
    };
    source?: string;
  };
}

interface IMessage {
  role: "assistant" | "user";
  content?: string;
  documents?: Doc[];
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  const handleSendChatMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const userMsg: IMessage = { role: "user", content: trimmedMessage };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
        }/chat?message=${encodeURIComponent(trimmedMessage)}`
      );
      const data = await res.json();

      const assistantMsg: IMessage = {
        role: "assistant",
        content: data?.message || "No response",
        documents: data?.docs || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      if(e) console.log("error coming")
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "❌ Failed to fetch response from server. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50 space-y-4 max-h-[calc(100vh-80px)]"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`w-fit max-w-[85%] px-4 py-3 rounded-2xl shadow-sm text-sm whitespace-pre-wrap break-words ${
              msg.role === "user"
                ? "bg-blue-100 self-end text-right ml-auto"
                : "bg-white border self-start mr-auto"
            }`}
          >
            {msg.content}
            {msg.role === "assistant" &&
              Array.isArray(msg.documents) &&
              msg.documents.length > 0 && (
                <details className="mt-2 text-xs text-gray-600">
                  <summary className="cursor-pointer">Context</summary>
                  {msg.documents.map((doc, i) => (
                    <div key={i} className="mt-1 border-b pb-2 mb-2">
                      <div>Page: {doc.metadata?.loc?.pageNumber ?? "N/A"}</div>
                      <div className="text-gray-500">
                        {doc.pageContent?.slice(0, 200)}...
                      </div>
                    </div>
                  ))}
                </details>
              )}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="flex items-center gap-2 p-4 border-t bg-white">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
        />
        <Button
          onClick={handleSendChatMessage}
          disabled={!message.trim() || loading}
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default ChatComponent;
