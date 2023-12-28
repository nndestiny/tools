import { Box, Button } from "@mui/material";

interface LogProps {
  title: string;
  logs: string[];
  onClear: () => void;
}
export default function Log({ title, logs, onClear }: LogProps) {
  return (
    <div className="mt-5 flex flex-col gap-2">
      <div className=" flex items-center gap-4">
        <span>{title}</span>
        <Button
          variant="contained"
          color="secondary"
          className="rounded-[24px] h-[32px] px-[26px] bg-white"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
      <Box className=" flex h-[600px] flex-col gap-1 overflow-auto rounded-lg px-4 py-2 bg-[#1D2127]">
        {logs.map((log, index) => (
          <div key={log + index} className=" flex items-center">
            {log}
          </div>
        ))}
      </Box>
    </div>
  );
}
