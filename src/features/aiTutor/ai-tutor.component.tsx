import { useEffect, useState } from "react";
import SendRounded from "@mui/icons-material/SendRounded";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import type { AppScreen } from "../../app/screens";
import { isPlanRequiredError, toApiErrorMessage } from "../../api/error";
import {
  useCreateTutorConversationMutation,
  useGetTutorConversationQuery,
  useGetTutorConversationsQuery,
  useGetTutorSuggestionsQuery,
} from "../../api/tutor/tutor.endpoints";
import { streamTutorMessage } from "../../api/tutor/tutor.stream";
import { useAppSelector } from "../../store/hooks";
import { selectAccessToken } from "../../store/slices/auth-slice";
import { PracticeTopbar } from "../practice";
import { AI_TUTOR_SUGGESTED_PROMPTS, type ChatMessage } from "./ai-tutor.constants";

import {
  styles as aiTutorStyles,
  messageBubbleSx,
  messageWrapSx,
  typingDotSx,
} from "./ai-tutor.styles";

type AiTutorPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

function TutorPaywall({ onNavigateScreen }: AiTutorPageProps) {
  return (
    <Paper
      variant="outlined"
      sx={{ maxWidth: 480, mx: "auto", mt: 6, p: "28px 26px", borderRadius: "20px", textAlign: "center" }}
    >
      <Typography sx={{ fontFamily: '"Space Mono", monospace', fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "secondary.main", fontWeight: 700 }}>
        Pro feature
      </Typography>
      <Typography variant="h3" sx={{ fontSize: 22, mt: 1 }}>
        The AI Tutor is part of PrepAI Pro
      </Typography>
      <Typography sx={{ mt: 1, color: "text.secondary", fontSize: 14, lineHeight: 1.6 }}>
        Upgrade to ask follow-up questions from your practice, mocks, and notes and get concise, exam-oriented answers.
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2.5, borderRadius: "11px", py: 1.2, px: 3 }}
        onClick={() => onNavigateScreen?.("subscriptionPaywall")}
      >
        Compare plans
      </Button>
    </Paper>
  );
}

let localIdCounter = 0;
function nextLocalId(): string {
  localIdCounter += 1;
  return `local-${localIdCounter}`;
}

export function AiTutorPage(props: AiTutorPageProps = {}) {
  const { onNavigateScreen } = props;
  const accessToken = useAppSelector(selectAccessToken);

  const conversationsQuery = useGetTutorConversationsQuery();
  const planRequired = isPlanRequiredError(conversationsQuery.error);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const conversationQuery = useGetTutorConversationQuery(activeConversationId ?? "", {
    skip: !activeConversationId,
  });
  const [createConversation] = useCreateTutorConversationMutation();
  const suggestionsQuery = useGetTutorSuggestionsQuery(undefined, { skip: planRequired });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  // Resume the most recently active conversation, if one exists.
  useEffect(() => {
    if (!activeConversationId && conversationsQuery.data && conversationsQuery.data.length > 0) {
      setActiveConversationId(conversationsQuery.data[0].id);
    }
  }, [activeConversationId, conversationsQuery.data]);

  useEffect(() => {
    if (conversationQuery.data) {
      setMessages(
        conversationQuery.data.messages.map((m) => ({
          id: m.id,
          role: m.role === "ai" ? "assistant" : "user",
          text: m.content,
          citations: m.citations?.map((c) => ({ title: c.title })),
        })),
      );
    }
  }, [conversationQuery.data]);

  async function sendMessage(text: string): Promise<void> {
    const clean = text.trim();
    if (!clean || isStreaming) {
      return;
    }

    setStreamError(null);
    setInput("");

    let conversationId = activeConversationId;
    if (!conversationId) {
      try {
        const created = await createConversation().unwrap();
        conversationId = created.id;
        setActiveConversationId(created.id);
      } catch (error) {
        setStreamError(toApiErrorMessage(error, "Could not start a conversation."));
        return;
      }
    }

    const userMessageId = nextLocalId();
    const assistantMessageId = nextLocalId();

    setMessages((prev) => [
      ...prev,
      { id: userMessageId, role: "user", text: clean },
      { id: assistantMessageId, role: "assistant", text: "", streaming: true },
    ]);
    setIsStreaming(true);

    await streamTutorMessage(conversationId, clean, accessToken, {
      onToken: (token) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMessageId ? { ...m, text: m.text + token } : m)),
        );
      },
      onCitations: (citations) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId ? { ...m, citations: citations.map((c) => ({ title: c.title })) } : m,
          ),
        );
      },
      onDone: () => {
        setMessages((prev) => prev.map((m) => (m.id === assistantMessageId ? { ...m, streaming: false } : m)));
        setIsStreaming(false);
      },
      onError: (message, code) => {
        const friendly =
          code === "NOT_CONFIGURED"
            ? "The AI Tutor isn't available yet — the backend AI provider hasn't been configured. Check back soon."
            : message;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMessageId ? { ...m, text: friendly, streaming: false } : m)),
        );
        setIsStreaming(false);
      },
    });
  }

  const suggestions = suggestionsQuery.data?.items ?? AI_TUTOR_SUGGESTED_PROMPTS;

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

        {planRequired ? (
          <Box sx={aiTutorStyles.ScrollBody}>
            <TutorPaywall onNavigateScreen={onNavigateScreen} />
          </Box>
        ) : (
        <Box sx={aiTutorStyles.ScrollBody}>
          <Box sx={aiTutorStyles.Wrap}>
            {streamError && (
              <Alert severity="error" sx={{ borderRadius: 2, mb: 1.5 }}>
                {streamError}
              </Alert>
            )}

            <Box sx={aiTutorStyles.Message}>
              {messages.length === 0 && (
                <Box sx={messageWrapSx("assistant")}>
                  <Box sx={aiTutorStyles.AssistantHead}>
                    <Box sx={aiTutorStyles.AssistantAvatar}>P</Box>
                    <Typography sx={aiTutorStyles.AssistantTitle}>
                      PrepAI Tutor · knowledge base
                    </Typography>
                  </Box>
                  <Box sx={messageBubbleSx("assistant")}>
                    Ask me anything from your preparation context and I will keep it concise and exam-oriented.
                  </Box>
                </Box>
              )}

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

                  <Box sx={messageBubbleSx(message.role)}>
                    {message.text}
                    {message.streaming && message.text.length === 0 && "…"}
                  </Box>

                  {message.citations && message.citations.length > 0 && (
                    <Typography sx={{ fontSize: 11.5, color: "text.disabled", mt: 0.5, px: 0.5 }}>
                      Sources: {message.citations.map((c) => c.title).join(" · ")}
                    </Typography>
                  )}
                </Box>
              ))}

              {isStreaming && messages.at(-1)?.text === "" && (
                <Box sx={aiTutorStyles.TypingRow}>
                  {[0, 1, 2].map((dot) => (
                    <Box key={dot} sx={typingDotSx(dot)} />
                  ))}
                </Box>
              )}
            </Box>

            {messages.length === 0 && (
              <Box sx={aiTutorStyles.PromptRow}>
                {suggestions.map((prompt) => (
                  <Box
                    key={prompt}
                    onClick={() => void sendMessage(prompt)}
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
                    void sendMessage(input);
                  }
                }}
                variant="standard"
                sx={aiTutorStyles.ComposerInput}
              />
              <Button
                variant="contained"
                sx={aiTutorStyles.SendButton}
                onClick={() => void sendMessage(input)}
                disabled={isStreaming || input.trim().length === 0}
              >
                <SendRounded sx={{ fontSize: 17 }} />
              </Button>
            </Box>
          </Box>
        </Box>
        )}
      </Box>
  );
}
