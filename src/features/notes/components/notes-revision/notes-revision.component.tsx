import { useMemo, useState } from "react";
import { Box, Button, Chip, Divider, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import {
  NOTES_FLASHCARDS,
  NOTES_ITEMS,
} from "../../notes.constants";
import type { NoteBlock } from "../../notes.types";
import { PracticeTopbar } from "../../../practice";

type NotesRevisionPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

export function NotesRevisionPage(props: NotesRevisionPageProps = {}) {
  const { onNavigateScreen } = props;
  const [flashIndex, setFlashIndex] = useState(0);
  const [flashFlipped, setFlashFlipped] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const activeNote = useMemo(
    () => NOTES_ITEMS.find((note) => note.id === activeNoteId) ?? null,
    [activeNoteId],
  );

  function goPrevCard(): void {
    setFlashIndex((previous) =>
      previous === 0 ? NOTES_FLASHCARDS.length - 1 : previous - 1,
    );
    setFlashFlipped(false);
  }

  function goNextCard(): void {
    setFlashIndex((previous) => (previous + 1) % NOTES_FLASHCARDS.length);
    setFlashFlipped(false);
  }

  function renderNoteBlock(block: NoteBlock, index: number) {
    if (block.type === "heading") {
      return (
        <Typography key={index} variant="h3" sx={{ fontSize: 21, mt: 2.2 }}>
          {block.text}
        </Typography>
      );
    }

    if (block.type === "paragraph") {
      return (
        <Typography key={index} sx={{ mt: 1.1, color: "text.secondary", lineHeight: 1.8 }}>
          {block.text}
        </Typography>
      );
    }

    if (block.type === "keyPoint") {
      return (
        <Paper
          key={index}
          variant="outlined"
          sx={{
            mt: 1.4,
            p: "16px 18px",
            borderRadius: "0 12px 12px 0",
            borderLeft: "3px solid",
            borderLeftColor: "secondary.main",
            bgcolor: "secondary.light",
            borderColor: "transparent",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Space Mono", monospace',
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "secondary.main",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Key Point
          </Typography>
          <Typography sx={{ mt: 0.8 }}>{block.text}</Typography>
        </Paper>
      );
    }

    return (
      <Box key={index} component="ul" sx={{ mt: 1.2, pl: 2.75, color: "text.secondary", display: "flex", flexDirection: "column", gap: 1.1 }}>
        {block.items.map((item) => (
          <Typography key={item} component="li" sx={{ lineHeight: 1.6, fontSize: 15.5 }}>
            {item}
          </Typography>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <PracticeTopbar
          currentScreen="notesRevision"
          title="Notes & Revision"
          subtitle="Flashcards, quick notes, and exam-oriented reading"
          searchPlaceholder="Search Notes"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={{ flex: 1, overflow: "auto", px: { xs: 2, md: 3.75 }, pt: { xs: 2.5, md: 3.75 }, pb: { xs: 5, md: 7.5 } }}>

        {!activeNote && (
          <Box
            sx={{
              maxWidth: 1080,
              mx: "auto",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Source Serif 4", serif',
                  fontSize: 18,
                  fontWeight: 600,
                  mb: 1.75,
                }}
              >
                Flashcards · quick revision
              </Typography>

              <Box
                onClick={() => setFlashFlipped((value) => !value)}
                sx={{
                  position: "relative",
                  height: 280,
                  perspective: "1400px",
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    inset: 0,
                    height: "100%",
                    transformStyle: "preserve-3d",
                    transition: "transform .5s ease",
                    transform: flashFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      borderRadius: "20px",
                      borderColor: "divider",
                      p: "28px",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 4px 20px -8px rgba(24,24,32,.14)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"Space Mono", monospace',
                        fontSize: 11,
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        color: "secondary.main",
                        fontWeight: 700,
                      }}
                    >
                        {NOTES_FLASHCARDS[flashIndex].subject}
                    </Typography>
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                      <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 22, fontWeight: 600, lineHeight: 1.4 }}>
                          {NOTES_FLASHCARDS[flashIndex].front}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12.5, color: "text.disabled" }}>Tap to reveal answer</Typography>
                  </Paper>

                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      borderRadius: "20px",
                      p: "28px",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      boxShadow: "0 4px 20px -8px rgba(24,24,32,.14)",
                    }}
                  >
                    <Typography sx={{ fontFamily: '"Space Mono", monospace', fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.8 }}>
                      Answer
                    </Typography>
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                      <Typography sx={{ fontSize: 16, lineHeight: 1.55 }}>{NOTES_FLASHCARDS[flashIndex].back}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12.5, opacity: 0.82 }}>Tap to flip back</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Button variant="outlined" onClick={goPrevCard} sx={{ minWidth: 42, width: 42, height: 42, borderRadius: "12px", px: 0 }}>
                  ←
                </Button>
                <Typography sx={{ flex: 1, textAlign: "center", color: "text.secondary", fontFamily: '"Space Mono", monospace', fontSize: 13 }}>
                  {flashIndex + 1} / {NOTES_FLASHCARDS.length}
                </Typography>
                <Button variant="outlined" onClick={goNextCard} sx={{ minWidth: 42, width: 42, height: 42, borderRadius: "12px", px: 0 }}>
                  →
                </Button>
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: '"Source Serif 4", serif',
                  fontSize: 18,
                  fontWeight: 600,
                  mb: 1.75,
                }}
              >
                AI-generated notes
              </Typography>

              <Box sx={{ display: "grid", gap: 1.5 }}>
                {NOTES_ITEMS.map((note) => (
                  <Paper
                    key={note.id}
                    variant="outlined"
                    onClick={() => setActiveNoteId(note.id)}
                    sx={{
                      p: "16px 18px",
                      borderRadius: "14px",
                      borderColor: "divider",
                      cursor: "pointer",
                      transition: "transform .2s ease, box-shadow .2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 16px -8px rgba(24,24,32,.14)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.8 }}>
                      <Chip
                        label={note.subject}
                        size="small"
                        sx={{
                          borderRadius: 2,
                          bgcolor: "primary.light",
                          color: "primary.main",
                          fontFamily: '"Space Mono", monospace',
                          fontSize: 11,
                        }}
                      />
                      <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                        {note.readMinutes} min read
                      </Typography>
                    </Box>

                    <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>
                      {note.title}
                    </Typography>
                    <Typography sx={{ mt: 0.65, color: "text.secondary", fontSize: 13, lineHeight: 1.5 }}>
                      {note.snippet}
                    </Typography>
                    <Typography sx={{ mt: 1.5, color: "primary.main", fontSize: 12.5, fontWeight: 600 }}>
                      Read note →
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {activeNote && (
          <Box sx={{ maxWidth: 980, mx: "auto" }}>
            <Typography
              component="button"
              onClick={() => setActiveNoteId(null)}
              sx={{
                all: "unset",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.9,
                fontSize: 13,
                fontWeight: 600,
                color: "text.secondary",
                cursor: "pointer",
                mb: 2.5,
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              ← Back to notes
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 236px" }, gap: { xs: 2, md: 4.25 } }}>
              <Paper variant="outlined" sx={{ p: 2.4, borderRadius: 2.4, borderColor: "divider" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.8 }}>
                  <Chip
                    label={activeNote.subject}
                    size="small"
                    sx={{
                      borderRadius: 2,
                      bgcolor: "primary.light",
                      color: "primary.main",
                      fontFamily: '"Space Mono", monospace',
                      fontSize: 11,
                    }}
                  />
                  <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                    {activeNote.readMinutes} min read · AI-generated
                  </Typography>
                </Box>

                <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 32 } }}>
                  {activeNote.title}
                </Typography>
                <Divider sx={{ my: 1.8 }} />

                <Box sx={{ maxWidth: 680 }}>
                  {activeNote.blocks.map((block, index) => renderNoteBlock(block, index))}
                </Box>
              </Paper>

              <Box sx={{ alignSelf: "start", position: { md: "sticky" }, top: { md: 20 }, display: "flex", flexDirection: "column", gap: 1.75 }}>
                <Paper variant="outlined" sx={{ borderRadius: "14px", borderColor: "divider", p: "16px 18px" }}>
                  <Typography
                    sx={{
                      fontSize: 11,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "text.disabled",
                      fontWeight: 700,
                      fontFamily: '"Space Mono", monospace',
                      mb: 1.4,
                    }}
                  >
                    Contents
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                    {activeNote.blocks
                      .filter((block): block is Extract<NoteBlock, { type: "heading" }> => block.type === "heading")
                      .map((heading) => (
                        <Box key={heading.text} sx={{ display: "flex", gap: 1.1 }}>
                          <Box sx={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "secondary.main", mt: 0.8, flex: "none" }} />
                          <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.45 }}>{heading.text}</Typography>
                        </Box>
                      ))}
                  </Box>
                </Paper>

                <Box sx={{ display: "grid", gap: 1.1 }}>
                  <Button variant="contained" onClick={() => onNavigateScreen?.("aiTutor")} sx={{ py: 1.35, borderRadius: "11px", fontSize: 13.5 }}>
                    Ask AI about this note
                  </Button>
                  <Button variant="outlined" sx={{ py: 1.35, borderRadius: "11px", fontSize: 13.5 }}>
                    Download PDF
                  </Button>
                  <Button variant="outlined" sx={{ py: 1.35, borderRadius: "11px", fontSize: 13.5 }}>
                    ☆ Bookmark
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        </Box>
      </Box>
  );
}
