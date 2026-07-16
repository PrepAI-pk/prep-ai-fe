import { Box, Chip, LinearProgress } from "@mui/material";

type PracticeFiltersProps = {
  subjects: string[];
  selectedSubject: string;
  progressValue: number;
  onSelectSubject: (subject: string) => void;
};

export function PracticeFilters(props: PracticeFiltersProps) {
  const { subjects, selectedSubject, progressValue, onSelectSubject } = props;

  return (
    <>
      <Box sx={{ mb: 2.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {subjects.map((subject) => (
          <Chip
            key={subject}
            label={subject}
            color={selectedSubject === subject ? "primary" : "default"}
            variant={selectedSubject === subject ? "filled" : "outlined"}
            onClick={() => onSelectSubject(subject)}
            sx={{
              borderRadius: 5,
              px: 1.2,
              height: 34,
              fontWeight: selectedSubject === subject ? 600 : 500,
              borderColor: selectedSubject === subject ? "primary.main" : "divider",
              backgroundColor:
                selectedSubject === subject ? "primary.main" : "background.paper",
              color: selectedSubject === subject ? "#fff" : "text.secondary",
            }}
          />
        ))}
      </Box>

      <LinearProgress
        variant="determinate"
        value={progressValue}
        sx={{
          height: 8,
          borderRadius: 99,
          backgroundColor: "background.default",
          mb: 3,
        }}
      />
    </>
  );
}
