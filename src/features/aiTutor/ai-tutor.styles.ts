import type { SxProps } from "@mui/material";
import type { ChatRole } from "./ai-tutor.constants";

const Root: SxProps = {
  minHeight: "100vh",
  backgroundColor: "background.default",
  display: "flex",
};

const Shell: SxProps = {
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  overflow: "hidden",
};

const ScrollBody: SxProps = {
  flex: 1,
  overflow: "auto",
  px: { xs: 2, md: 3.75 },
  pt: { xs: 2.5, md: 3.75 },
  pb: { xs: 5, md: 7.5 },
};

const Wrap: SxProps = {
  maxWidth: 780,
  mx: "auto",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

const Message: SxProps = {
  flex: 1,
  overflow: "auto",
  px: 0.5,
  pb: 1.5,
  pt: 0.5,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const AssistantHead: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: 0.9,
  mb: 0.7,
};

const AssistantAvatar: SxProps = {
  width: 22,
  height: 22,
  borderRadius: "7px",
  backgroundColor: "primary.main",
  color: "primary.contrastText",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: '"Source Serif 4", serif',
  fontWeight: 700,
  fontSize: 12,
};

const AssistantTitle: SxProps = {
  fontSize: 11,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: "text.disabled",
  fontFamily: '"Space Mono", monospace',
};

const TypingRow: SxProps = {
  display: "flex",
  gap: 0.6,
  px: 0.25,
};

const PromptRow: SxProps = {
  display: "flex",
  gap: 1,
  flexWrap: "wrap",
  mb: 1.5,
};

const PromptChip: SxProps = {
  px: 1.75,
  py: 1.1,
  borderRadius: "20px",
  border: "1px solid",
  borderColor: "divider",
  backgroundColor: "background.paper",
  fontSize: 13,
  cursor: "pointer",
  color: "text.primary",
  "&:hover": {
    borderColor: "primary.main",
    color: "primary.main",
  },
};

const Composer: SxProps = {
  display: "flex",
  gap: 1.25,
  alignItems: "center",
  backgroundColor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: "15px",
  px: 1,
  py: 1,
  pl: 2.25,
  boxShadow: "0 1px 2px rgba(24,24,32,.05)",
};

const ComposerInput: SxProps = {
  "& .MuiInput-root:before": { display: "none" },
  "& .MuiInput-root:after": { display: "none" },
  "& .MuiInputBase-input": {
    fontSize: 15,
  },
};

const SendButton: SxProps = {
  minWidth: 40,
  width: 40,
  height: 40,
  borderRadius: "11px",
  p: 0,
};

export const messageWrapSx = (role: ChatRole) => ({
  maxWidth: "82%",
  alignSelf: role === "assistant" ? "flex-start" : "flex-end",
});

export const messageBubbleSx = (role: ChatRole) => ({
  px: 2.25,
  py: 1.75,
  borderRadius: "16px",
  fontSize: 14.5,
  lineHeight: 1.6,
  whiteSpace: "pre-wrap",
  ...(role === "assistant"
    ? {
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderTopLeftRadius: "5px",
        color: "text.primary",
      }
    : {
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        borderTopRightRadius: "5px",
      }),
});

export const typingDotSx = (delayIndex: number) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: "text.disabled",
  animation: `blink 1s ${delayIndex * 0.2}s infinite`,
  "@keyframes blink": {
    "0%, 100%": { opacity: 0.25 },
    "50%": { opacity: 1 },
  },
});

export const styles = {
  Root,
  Shell,
  ScrollBody,
  Wrap,
  Message,
  AssistantHead,
  AssistantAvatar,
  AssistantTitle,
  TypingRow,
  PromptRow,
  PromptChip,
  Composer,
  ComposerInput,
  SendButton,
};
