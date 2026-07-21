import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Paper, Snackbar, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { toApiErrorMessage } from "../../../../api/error";
import {
  useGetAdminAgentRunsQuery,
  useGetAdminPromptsQuery,
  useSaveAdminPromptMutation,
} from "../../../../api/admin/admin-agent-ops.endpoints";
import { adminAgentLogsStyles } from "./admin-agent-logs.styles";
import { adminSharedStyles, statusToneStyles } from "../../admin-shared.styles";
import { PracticeTopbar } from "../../../practice";

type AdminAgentLogsPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

const PROMPT_AGENT = "MCQ_GENERATION";

export function AdminAgentLogsPage(props: AdminAgentLogsPageProps) {
  const { onNavigateScreen } = props;

  const runsQuery = useGetAdminAgentRunsQuery({ page: 1 });
  const promptsQuery = useGetAdminPromptsQuery();
  const [savePrompt, { isLoading: isSaving, isSuccess: saved }] = useSaveAdminPromptMutation();

  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const active = promptsQuery.data?.find((p) => p.agent === PROMPT_AGENT);
    if (active?.content) {
      setPrompt(active.content);
    }
  }, [promptsQuery.data]);

  return (
    <Box sx={adminSharedStyles.shell}>
        <PracticeTopbar
          currentScreen="adminAgentLogs"
          title="AI Agent Logs"
          subtitle="Monitor runs and manage prompt templates"
          searchPlaceholder="Search Agent Logs"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={adminSharedStyles.scrollBody}>
          <Box sx={adminAgentLogsStyles.wrap}>
            <Paper variant="outlined" sx={adminAgentLogsStyles.card}>
              <Typography sx={{ ...adminAgentLogsStyles.title, mb: "6px" }}>Agent runs</Typography>

              {runsQuery.isError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  Could not load agent runs. {toApiErrorMessage(runsQuery.error, "Please try again.")}
                </Alert>
              )}

              {runsQuery.isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  <CircularProgress size={22} />
                </Box>
              )}

              {(runsQuery.data?.items ?? []).map((run) => {
                const t = statusToneStyles(run.status.toLowerCase());
                return (
                  <Box key={run.id} sx={adminAgentLogsStyles.row}>
                    <Box sx={{ width: 9, height: 9, borderRadius: "50%", flex: "none", bgcolor: t.dot }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{run.label}</Typography>
                      <Typography sx={{ fontSize: 11.5, color: "text.disabled" }}>{run.note}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12, color: "text.secondary", fontFamily: '"Space Mono", monospace' }}>{run.tokens}</Typography>
                    <Typography sx={{ fontSize: 12, color: "text.disabled", fontFamily: '"Space Mono", monospace', width: 60, textAlign: "right" }}>
                      {run.ms > 0 ? `${(run.ms / 1000).toFixed(2)}s` : "—"}
                    </Typography>
                    <Box sx={{ ...adminAgentLogsStyles.statusBadge, backgroundColor: t.bg, color: t.fg }}>
                      {run.status.toLowerCase()}
                    </Box>
                  </Box>
                );
              })}
            </Paper>

            <Paper variant="outlined" sx={adminAgentLogsStyles.promptCard}>
              <Typography sx={adminAgentLogsStyles.title}>Prompt management</Typography>
              <Typography sx={adminAgentLogsStyles.promptLabel}>
                MCQ Generation Agent
              </Typography>

              <Box
                component="textarea"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="No prompt saved yet — write one and save to activate it."
                sx={adminAgentLogsStyles.promptTextarea}
              />

              <Box sx={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  disabled={isSaving || prompt.trim().length === 0}
                  sx={{ px: "20px", py: "9px", borderRadius: "10px", fontWeight: 600, fontSize: 13 }}
                  onClick={() => void savePrompt({ agent: PROMPT_AGENT, content: prompt })}
                >
                  {isSaving ? "Saving..." : "Save prompt"}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>

        <Snackbar open={saved} autoHideDuration={2500} message="Prompt saved and activated" />
      </Box>
  );
}
