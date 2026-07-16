import { useEffect, useMemo, useState } from "react";
import { Box, Button, LinearProgress, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import type { AdminDocument, AdminDraft } from "../../admin.types";
import { PROCESS_FILE_NAME, PROCESS_STAGES } from "../../admin.constants";
import {
  adminProcessingStyles,
  docStatusToneSx,
  processStatusToneSx,
  stageChipToneSx,
  stageDotToneSx,
} from "./admin-processing.styles";
import { adminSharedStyles } from "../../admin-shared.styles";
import { PracticeTopbar } from "../../../practice";

type AdminProcessingPageProps = {
  documents: AdminDocument[];
  onPushDocument: (document: AdminDocument) => void;
  onPushDraft: (draft: AdminDraft) => void;
  onNavigateScreen?: (screen: AppScreen) => void;
};

export function AdminProcessingPage(props: AdminProcessingPageProps) {
  const { documents, onPushDocument, onPushDraft, onNavigateScreen } = props;

  const [running, setRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const activeFileName = PROCESS_FILE_NAME;

  useEffect(() => {
    if (!running) {
      return;
    }

    const timerId = window.setInterval(() => {
      setCurrentStage((previous) => {
        if (previous >= PROCESS_STAGES.length - 1) {
          window.clearInterval(timerId);
          setRunning(false);

          const draftId = `draft-${Date.now()}`;

          onPushDocument({
            id: `doc-${Date.now()}`,
            type: "PDF",
            name: activeFileName,
            pages: 21,
            date: new Date().toLocaleDateString(),
            mcqCount: 20,
            status: "review",
          });

          onPushDraft({
            id: draftId,
            subject: "Pakistan Affairs",
            body: "CSS",
            difficulty: "Medium",
            question: "Which constitutional change most directly expanded provincial autonomy?",
            options: ["Objectives Resolution", "18th Amendment", "One Unit", "LFO 2002"],
            correctIndex: 1,
            explanation: "The 18th Amendment devolved significant powers to provinces.",
            validation: "Validated",
            duplicate: "No duplicate",
            status: "pending",
          });

          return previous;
        }

        return previous + 1;
      });
    }, 520);

    return () => window.clearInterval(timerId);
  }, [activeFileName, onPushDocument, onPushDraft, running]);

  const progress = useMemo(() => Math.round(((currentStage + 1) / PROCESS_STAGES.length) * 100), [currentStage]);
  const done = !running && currentStage >= PROCESS_STAGES.length - 1;

  const processBtnLabel = running ? "Processing..." : done ? "Process again" : "Simulate upload & process";
  const processStatusText = running ? "processing" : done ? "completed" : "idle";

  function startSimulation(): void {
    if (running) {
      return;
    }

    setCurrentStage(0);
    setRunning(true);
  }

  return (
    <Box sx={adminSharedStyles.shell}>
        <PracticeTopbar
          currentScreen="adminProcessing"
          title="Document Processing"
          subtitle="Upload, process pipeline, and generate review drafts"
          searchPlaceholder="Search Documents"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={adminSharedStyles.scrollBody}>
          <Box sx={adminProcessingStyles.wrap}>
            <Box sx={adminProcessingStyles.uploadCard}>
              <Box sx={adminProcessingStyles.uploadIcon}>
                ↑
              </Box>
              <Typography sx={adminProcessingStyles.title}>
                Upload documents to process
              </Typography>
              <Typography sx={{ fontSize: 13.5, color: "text.secondary", mt: "6px", maxWidth: 480, mx: "auto", lineHeight: 1.55 }}>
                PDF, DOCX, PPT, images or scanned books. The AI agents will OCR, extract, generate MCQs, explanations and notes, then queue them for your review.
              </Typography>
              <Button variant="contained" sx={{ mt: 1.3, px: 2.4, py: 1.1, borderRadius: "11px", fontSize: 13.5 }} onClick={startSimulation}>
                {processBtnLabel}
              </Button>
            </Box>

            <Paper variant="outlined" sx={adminProcessingStyles.fileCard}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "6px" }}>
                <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{activeFileName}</Typography>
                <Box sx={{ ...adminProcessingStyles.fileStatus, ...processStatusToneSx(running, done) }}>
                  {processStatusText}
                </Box>
              </Box>

              <LinearProgress
                variant="determinate"
                value={running || done ? progress : 0}
                sx={{ mt: "12px", mb: "20px", height: 8, borderRadius: 99, backgroundColor: "background.default" }}
              />

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {PROCESS_STAGES.map((stage, index) => {
                  const stageDone = index < currentStage;
                  const active = running && index === currentStage;
                  return (
                    <Box key={stage} sx={{ ...adminProcessingStyles.stageChip, ...stageChipToneSx(stageDone, active) }}>
                      <Box sx={stageDotToneSx(stageDone, active)} />
                      {stage}
                    </Box>
                  );
                })}
              </Box>

              {done && (
                <Typography sx={{ mt: 1.1, color: "success.main", fontSize: 13 }}>
                  Completed. A new draft was added to the review queue.
                </Typography>
              )}
            </Paper>

            <Paper variant="outlined" sx={adminProcessingStyles.docsCard}>
              <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 17, fontWeight: 600, mb: "4px" }}>All documents</Typography>
              {documents.map((doc) => (
                <Box key={doc.id} sx={adminProcessingStyles.docRow}>
                  <Box sx={adminProcessingStyles.docType}>
                    {doc.type}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{doc.name}</Typography>
                    <Typography sx={{ fontSize: 12, color: "text.disabled", fontFamily: '"Space Mono", monospace' }}>
                      {doc.pages} pages · {doc.date}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: "text.secondary", fontFamily: '"Space Mono", monospace' }}>{doc.mcqCount} MCQs</Typography>
                  <Box sx={{ ...adminProcessingStyles.docStatus, ...docStatusToneSx(doc.status) }}>
                    {doc.status}
                  </Box>
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>
      </Box>
  );
}
