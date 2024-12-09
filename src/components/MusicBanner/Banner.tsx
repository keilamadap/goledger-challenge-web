import React from "react";
import { Box, useTheme } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const MusicBanner: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        height: "120px",
        overflow: "hidden",
        position: "relative",
        backgroundColor: theme.palette.primary.main,
        marginBottom: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path
          d="M0,0 Q250,60 500,30 T1000,60 L1000,120 L0,120 Z"
          fill={theme.palette.primary.dark}
          opacity="0.5"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,0 Q250,60 500,30 T1000,60 L1000,120 L0,120 Z;
              M0,0 Q250,30 500,60 T1000,30 L1000,120 L0,120 Z;
              M0,0 Q250,60 500,30 T1000,60 L1000,120 L0,120 Z"
          />
        </path>
      </svg>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          zIndex: 1,
        }}
      >
        {[0, 1, 2].map((index) => (
          <MusicNoteIcon
            key={index}
            sx={{
              fontSize: "3rem",
              color: theme.palette.primary.contrastText,
              animation: "fadeInOut 2s ease-in-out infinite",
              animationDelay: `${index * 0.5}s`,
              "@keyframes fadeInOut": {
                "0%, 100%": { opacity: 0.3 },
                "50%": { opacity: 1 },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MusicBanner;
