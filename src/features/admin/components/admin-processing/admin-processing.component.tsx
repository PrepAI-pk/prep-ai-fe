import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, LinearProgress, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { toApiErrorMessage } from "../../../../api/error";
import {
  useGetAdminDocumentsQuery,
  useGetAdminUploadUrlMutation,
  useRegisterAdminDocumentMutation,
  useRetryAdminPipelineMutation,
} from "../../../../api/admin/admin-documents.endpoints";
import { streamAdminPipeline } from "../../../../api/admin/admin-pipeline.stream";
import type { AdminDocType, PipelineSnapshot } from "../../../../api/admin/admin.types";
import { useAppSelector } from "../../../../store/hooks";
import { selectAccessToken } from "../../../../store/slices/auth-slice";
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
  onNavigateScreen?: (screen: AppScreen) => void;
};

function inferDocType(fileName: string): AdminDocType {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "doc" || ext === "docx") return "DOCX";
  if (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "gif" || ext === "webp") return "IMG";
  return "PDF";
}

export function AdminProcessingPage(props: AdminProcessingPageProps) {
  const { onNavigateScreen } = props;
  const accessToken = useAppSelector(selectAccessToken);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [getUploadUrl] = useGetAdminUploadUrlMutation();
  const [registerDocument, { isLoading: isRegistering }] = useRegisterAdminDocumentMutation();
  const [retryPipeline] = useRetryAdminPipelineMutation();
  const documentsQuery = useGetAdminDocumentsQuery({ page: 1 });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<PipelineSnapshot | null>(null);

  useEffect(() => {
    if (!activeDocumentId) {
      return;
    }
    let cancelled = false;
    void streamAdminPipeline(activeDocumentId, accessToken, (next) => {
      if (!cancelled) {
        setSnapshot(next);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeDocumentId, accessToken]);

  async function handleFileSelected(file: File): Promise<void> {
    setUploadError(null);
    try {
      const { uploadUrl, storageKey } = await getUploadUrl({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
      }).unwrap();

      const putResponse = await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type || "application/octet-stream" } });
      if (!putResponse.ok) {
        throw new Error(`Upload to storage failed (${putResponse.status}). Is the MinIO container running and the bucket created?`);
      }

      const { document } = await registerDocument({
        name: file.name,
        type: inferDocType(file.name),
        storageKey,
        sizeBytes: file.size,
      }).unwrap();

      setSnapshot(null);
      setActiveDocumentId((document as { id: string }).id);
      void documentsQuery.refetch();
    } catch (error) {
      setUploadError(toApiErrorMessage(error, "Upload failed. Please try again."));
    }
  }

  async function handleRetry(): Promise<void> {
    if (!activeDocumentId) {
      return;
    }
    setUploadError(null);
    try {
      await retryPipeline(activeDocumentId).unwrap();
      setSnapshot(null);
    } catch (error) {
      setUploadError(toApiErrorMessage(error, "Retry failed."));
    }
  }

  const running = snapshot?.status === "RUNNING" || snapshot?.status === "QUEUED";
  const done = snapshot?.status === "SUCCESS";
  const failed = snapshot?.status === "FAILED";

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
                PDF, DOCX, or images. The AI agents will OCR, extract, generate MCQs, explanations and notes, then queue them for your review.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 1.3, px: 2.4, py: 1.1, borderRadius: "11px", fontSize: 13.5 }}
                disabled={isRegistering || running}
                onClick={() => fileInputRef.current?.click()}
              >
                {isRegistering ? "Uploading..." : "Upload & process"}
              </Button>
              <Box
                component="input"
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                sx={{ display: "none" }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) {
                    void handleFileSelected(file);
                  }
                }}
              />
            </Box>

            {uploadError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {uploadError}
              </Alert>
            )}

            {snapshot && (
              <Paper variant="outlined" sx={adminProcessingStyles.fileCard}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "6px" }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{snapshot.document.name}</Typography>
                  <Box sx={{ ...adminProcessingStyles.fileStatus, ...processStatusToneSx(running, done) }}>
                    {snapshot.status.toLowerCase()}
                  </Box>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={snapshot.progress}
                  sx={{ mt: "12px", mb: "20px", height: 8, borderRadius: 99, backgroundColor: "background.default" }}
                />

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {snapshot.stages.map((stage) => {
                    const stageDone = stage.status === "SUCCESS";
                    const active = stage.status === "RUNNING";
                    const stageFailed = stage.status === "FAILED";
                    return (
                      <Box
                        key={stage.stage}
                        sx={{
                          ...adminProcessingStyles.stageChip,
                          ...stageChipToneSx(stageDone, active),
                          ...(stageFailed ? { borderColor: "error.main", color: "error.main" } : {}),
                        }}
                      >
                        <Box sx={stageDotToneSx(stageDone, active)} />
                        {stage.label}
                      </Box>
                    );
                  })}
                </Box>

                {done && (
                  <Typography sx={{ mt: 1.1, color: "success.main", fontSize: 13 }}>
                    Completed. New drafts were added to the review queue.
                  </Typography>
                )}

                {failed && (
                  <Box sx={{ mt: 1.1 }}>
                    <Typography sx={{ color: "error.main", fontSize: 13 }}>
                      {snapshot.stages.find((s) => s.status === "FAILED")?.error ?? "Processing failed."}
                    </Typography>
                    <Button size="small" variant="outlined" color="error" sx={{ mt: 1, borderRadius: "8px" }} onClick={() => void handleRetry()}>
                      Retry from failed stage
                    </Button>
                  </Box>
                )}
              </Paper>
            )}

            <Paper variant="outlined" sx={adminProcessingStyles.docsCard}>
              <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 17, fontWeight: 600, mb: "4px" }}>All documents</Typography>
              {(documentsQuery.data?.items ?? []).map((doc) => (
                <Box key={doc.id} sx={adminProcessingStyles.docRow}>
                  <Box sx={adminProcessingStyles.docType}>
                    {doc.type}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{doc.name}</Typography>
                    <Typography sx={{ fontSize: 12, color: "text.disabled", fontFamily: '"Space Mono", monospace' }}>
                      {doc.pages ?? "—"} pages · {new Date(doc.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: "text.secondary", fontFamily: '"Space Mono", monospace' }}>{doc.mcqCount} MCQs</Typography>
                  <Box sx={{ ...adminProcessingStyles.docStatus, ...docStatusToneSx(doc.status.toLowerCase()) }}>
                    {doc.status.toLowerCase()}
                  </Box>
                </Box>
              ))}
              {(documentsQuery.data?.items ?? []).length === 0 && (
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>No documents uploaded yet.</Typography>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
  );
}
