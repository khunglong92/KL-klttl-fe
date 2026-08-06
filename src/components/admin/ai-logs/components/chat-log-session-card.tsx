import { useState } from "react";
import { Card, Group, Text, Stack, Badge } from "@mantine/core";
import { ChevronDown, ChevronRight, Bot, User } from "lucide-react";
import { cn } from "@/components/ui/utils";
import type { ChatLogSession } from "@/services/api/aiChatService";

export function ChatLogSessionCard({ session }: { session: ChatLogSession }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <Group gap="sm">
          {expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0" />
          )}
          <Text size="sm" fw={600} className="truncate">
            Phiên: {session.sessionId}
          </Text>
          <Badge variant="light" color="gray">
            {session.messageCount} tin nhắn
          </Badge>
        </Group>
        <Text size="xs" c="dimmed">
          {session.lastMessageAt
            ? new Date(session.lastMessageAt).toLocaleString("vi-VN")
            : ""}
        </Text>
      </button>

      {expanded && (
        <Stack gap="xs" mt="md">
          {session.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-2",
                msg.role === "USER" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "ASSISTANT" && (
                <Bot className="mt-1 h-4 w-4 shrink-0 text-navy-600" />
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-xl px-3 py-2 text-xs whitespace-pre-wrap",
                  msg.role === "USER"
                    ? "rounded-tr-sm bg-navy-600 text-white"
                    : "rounded-tl-sm border border-border bg-card text-foreground"
                )}
              >
                {msg.content}
              </div>
              {msg.role === "USER" && (
                <User className="mt-1 h-4 w-4 shrink-0 text-navy-600" />
              )}
            </div>
          ))}
        </Stack>
      )}
    </Card>
  );
}
