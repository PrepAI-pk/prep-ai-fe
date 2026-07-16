import { useMemo, useState } from "react";
import SendRounded from "@mui/icons-material/SendRounded";
import { Box, Button, TextField, Typography } from "@mui/material";
import type { AppScreen } from "../../app/screens";
import { PracticeTopbar } from "../practice";
import {
  AI_TUTOR_SUGGESTED_PROMPTS,
  createTutorReply,
  type ChatMessage,
} from "./ai-tutor.constants";

import {
  styles as aiTutorStyles,
  messageBubbleSx,
  messageWrapSx,
  typingDotSx,
} from "./ai-tutor.styles";

type AiTutorPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

export function AiTutorPage(props: AiTutorPageProps = {}) {
  const { onNavigateScreen } = props;
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Ask me anything from your preparation context and I will keep it concise and exam-oriented.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const nextMessageId = useMemo(() => messages.length + 1, [messages.length]);

  function sendMessage(text: string): void {
    const clean = text.trim();
    if (!clean || isTyping) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: nextMessageId, role: "user", text: clean },
    ]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextMessageId + 1,
          role: "assistant",
          text: createTutorReply(clean),
        },
      ]);
      setIsTyping(false);
    }, 950);
  }

  return (
    <Box sx={aiTutorStyles.Shell}>
        <PracticeTopbar
          currentScreen="aiTutor"
          title="AI Tutor"
          subtitle="Ask follow-ups from mock exam and practice context"
          searchPlaceholder="Search Tutor History"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={aiTutorStyles.ScrollBody}>
          <Box sx={aiTutorStyles.Wrap}>
            <Box sx={aiTutorStyles.Message}>
              {messages.map((message) => (
                <Box key={message.id} sx={messageWrapSx(message.role)}>
                  {message.role === "assistant" && (
                    <Box sx={aiTutorStyles.AssistantHead}>
                      <Box sx={aiTutorStyles.AssistantAvatar}>P</Box>
                      <Typography sx={aiTutorStyles.AssistantTitle}>
                        PrepAI Tutor · knowledge base
                      </Typography>
                    </Box>
                  )}

                  <Box sx={messageBubbleSx(message.role)}>{message.text}</Box>
                </Box>
              ))}

              {isTyping && (
                <Box sx={aiTutorStyles.TypingRow}>
                  {[0, 1, 2].map((dot) => (
                    <Box key={dot} sx={typingDotSx(dot)} />
                  ))}
                </Box>
              )}
            </Box>

            {messages.length <= 1 && (
              <Box sx={aiTutorStyles.PromptRow}>
                {AI_TUTOR_SUGGESTED_PROMPTS.map((prompt) => (
                  <Box
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    sx={aiTutorStyles.PromptChip}
                  >
                    {prompt}
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={aiTutorStyles.Composer}>
              <TextField
                fullWidth
                placeholder="Ask anything - explanations, MCQs, revision notes..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    sendMessage(input);
                  }
                }}
                variant="standard"
                sx={aiTutorStyles.ComposerInput}
              />
              <Button
                variant="contained"
                sx={aiTutorStyles.SendButton}
                onClick={() => sendMessage(input)}
                disabled={isTyping || input.trim().length === 0}
              >
                <SendRounded sx={{ fontSize: 17 }} />
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
  );
}
