import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { usePublicChatStatus } from "@/services/hooks/useAiChat";
import { streamChatMessage } from "@/services/api/aiChatStream";
import { cn } from "@/components/ui/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

const SESSION_KEY = "kl_ai_chat_session";

function generateId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

// Dùng sessionStorage (không phải localStorage) để mỗi lần mở lại trình
// duyệt (đóng hẳn rồi mở lại) sẽ là 1 phiên chat mới; trong lúc vẫn mở
// trình duyệt, tải lại trang/chuyển trang vẫn giữ đúng phiên đang chat.
function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = generateId();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function renderRichText(text: string) {
  const regex = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1] && match[2]) {
      const label = match[1];
      const href = match[2];
      if (href.startsWith("/")) {
        parts.push(
          <Link
            key={key++}
            to={href}
            className="font-semibold text-navy-600 underline hover:text-navy-700"
          >
            {label}
          </Link>
        );
      } else {
        parts.push(
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-navy-600 underline hover:text-navy-700"
          >
            {label}
          </a>
        );
      }
    } else if (match[3]) {
      parts.push(<strong key={key++}>{match[3]}</strong>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export function AiChatWidget() {
  const { t } = useTranslation();
  const { data: status } = usePublicChatStatus();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const sessionIdRef = useRef<string>(getOrCreateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!status?.isEnabled) return null;

  const suggestedQuestions = t("aiChat.widget.suggestedQuestions", {
    returnObjects: true,
  }) as string[];

  const handleSend = async (overrideText?: string) => {
    const trimmed = (overrideText ?? input).trim();
    if (!trimmed || isStreaming) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: trimmed,
    };
    const assistantId = generateId();

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setIsStreaming(true);

    try {
      await streamChatMessage(sessionIdRef.current, trimmed, (token) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + token } : m
          )
        );
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("aiChat.widget.genericError");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: message, isError: true } : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="fixed bottom-[70px] right-4 z-[999] flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex h-[32rem] max-h-[calc(100vh-8rem)] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex shrink-0 items-center gap-3 bg-navy-600 px-4 py-3 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-tight">
                {t("aiChat.widget.title")}
              </p>
              <p className="truncate text-[11px] text-white/80">
                {t("aiChat.widget.subtitle")}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label={t("aiChat.widget.closeAriaLabel")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-end gap-3 overflow-y-auto bg-muted/30 p-4">
            <div className="max-w-[80%] rounded-xl rounded-tl-sm border border-border bg-card px-3 py-2 text-xs font-medium text-foreground">
              {t("aiChat.widget.greeting")}
            </div>

            {messages.length === 0 && suggestedQuestions.length > 0 && (
              <div className="flex flex-col items-start gap-1.5">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSend(question)}
                    disabled={isStreaming}
                    className="max-w-[90%] rounded-xl border border-navy-200 bg-navy-50 px-3 py-1.5 text-left text-xs font-medium text-navy-700 transition-colors hover:bg-navy-100 disabled:opacity-40 dark:border-navy-800 dark:bg-navy-950/40 dark:text-navy-300"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-xl px-3 py-2 text-xs font-medium whitespace-pre-wrap",
                    m.isError
                      ? "rounded-tl-sm border border-accent-red-200 bg-accent-red-50 text-accent-red-700"
                      : m.role === "user"
                        ? "rounded-tr-sm bg-navy-600 text-white"
                        : "rounded-tl-sm border border-border bg-card text-foreground"
                  )}
                >
                  {m.role === "assistant" && m.content === "" && isStreaming ? (
                    <span className="flex gap-1 py-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                    </span>
                  ) : (
                    renderRichText(m.content)
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex shrink-0 items-center gap-2 border-t border-border bg-card p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t("aiChat.widget.placeholder")}
              className="flex-1 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs font-medium focus:bg-card focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={isStreaming || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-600 text-white transition-all hover:bg-navy-700 disabled:opacity-40"
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={
          isOpen ? t("aiChat.widget.closeAriaLabel") : t("aiChat.widget.toggleAriaLabel")
        }
        className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-600 text-white shadow-xl transition-all hover:scale-105 hover:bg-navy-700 active:scale-95"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
