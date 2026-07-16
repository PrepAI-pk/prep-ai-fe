import { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { AGENT_LOG_RUNS } from "../../admin.constants";
import { adminAgentLogsStyles } from "./admin-agent-logs.styles";
import { adminSharedStyles, statusToneStyles } from "../../admin-shared.styles";
import { PracticeTopbar } from "../../../practice";

type AdminAgentLogsPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

export function AdminAgentLogsPage(props: AdminAgentLogsPageProps) {
  const { onNavigateScreen } = props;
  const [prompt, setPrompt] = useState(
    "You are the MCQ Generation Agent for PrepAI.\n- Generate 4 options (A-D) with exactly one correct answer.\n- Target the exam syllabus and selected subject topic.\n- Set difficulty: Easy | Medium | Hard.\n- Write a 2-3 sentence explanation grounded in the source passage.\n- Return strict JSON. Never invent facts absent from provided context.",
  );

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
              {AGENT_LOG_RUNS.map((run) => {
                const t = statusToneStyles(run.status);
                return (
                  <Box key={run.name} sx={adminAgentLogsStyles.row}>
                    <Box sx={{ width: 9, height: 9, borderRadius: "50%", flex: "none", bgcolor: t.dot }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{run.name}</Typography>
                      <Typography sx={{ fontSize: 11.5, color: "text.disabled" }}>{run.note}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12, color: "text.secondary", fontFamily: '"Space Mono", monospace' }}>{run.tokens}</Typography>
                    <Typography sx={{ fontSize: 12, color: "text.disabled", fontFamily: '"Space Mono", monospace', width: 52, textAlign: "right" }}>{run.duration}</Typography>
                    <Box sx={{ ...adminAgentLogsStyles.statusBadge, backgroundColor: t.bg, color: t.fg }}>
                      {run.status}
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
                sx={adminAgentLogsStyles.promptTextarea}
              />

              <Box sx={{ textAlign: "right" }}>
                <Button variant="contained" sx={{ px: "20px", py: "9px", borderRadius: "10px", fontWeight: 600, fontSize: 13 }}>
                  Save prompt
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
  );
}
