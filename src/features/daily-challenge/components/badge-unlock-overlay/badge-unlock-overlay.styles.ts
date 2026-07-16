import type { SxProps } from "@mui/material/styles";

const OverlayBackdrop: SxProps = {
  position: "fixed",
  inset: 0,
  zIndex: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  background: "rgba(10, 12, 20, 0.55)",
  backdropFilter: "blur(4px)",
  animation: "ovBackdrop 0.25s ease both",
};

const OverlayCard: SxProps = {
  background: "#ffffff",
  border: "1px solid #e8e3d9",
  borderRadius: "24px",
  padding: "40px 38px 32px",
  maxWidth: "380px",
  width: "100%",
  textAlign: "center",
  boxShadow: "0 30px 70px -20px rgba(0, 0, 0, 0.5)",
  animation: "ovCard 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.2) both",
  position: "relative",
  overflow: "visible",
};

const OverlayHeader: SxProps = {
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "1.8px",
  color: "#E8711D",
  marginBottom: "20px",
  textTransform: "uppercase",
  display: "block",
};

const IconContainer: SxProps = {
  position: "relative",
  width: "112px",
  height: "112px",
  margin: "22px auto 4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "visible",
};

const IconRayStyle: SxProps = {
  position: "absolute",
  inset: "-34px",
  borderRadius: "50%",
  animation: "raySpin 9s linear infinite",
  zIndex: 0,
};

const IconGlowCircle: SxProps = {
  position: "absolute",
  inset: "-10px",
  borderRadius: "50%",
  background: "radial-gradient(circle, #2f7d5b55 0%, transparent 68%)",
  animation: "glowPulse 2.2s ease-in-out infinite",
  zIndex: 1,
};

const OverlayIcon: SxProps = {
  position: "relative",
  zIndex: 2,
  width: "112px",
  height: "112px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "50px",
  background: "#e9f3ec",
  color: "#2f7d5b",
  boxShadow: "0 0 0 6px #e9f3ec, 0 18px 40px -12px #2f7d5b",
  animation: "badgePop 0.7s cubic-bezier(0.17, 0.89, 0.32, 1.28) both",
};

const OverlayTitle: SxProps = {
  fontSize: "24px",
  fontWeight: 700,
  marginTop: "12px",
  marginBottom: "8px",
  color: "#1a1a1a",
  fontFamily: "'Georgia', 'Source Serif 4', serif",
};

const OverlayDescription: SxProps = {
  fontSize: "14px",
  color: "#808080",
  marginBottom: "18px",
  fontWeight: 400,
  lineHeight: 1.5,
};

const XpChip: SxProps = {
  background: "#E8F5E9",
  color: "#2e7d32",
  fontSize: "14px",
  fontWeight: 700,
  marginBottom: "16px",
  height: "44px",
  borderRadius: "8px",
  border: "none",
};

const OverlayButton: SxProps = {
  marginTop: "12px",
  padding: "12px 20px",
  fontSize: "15px",
  fontWeight: 700,
  borderRadius: "10px",
  textTransform: "none",
  backgroundColor: "#1e3a5f",
  color: "#ffffff",
  width: "100%",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#152a47",
    opacity: 0.92,
  },
};

export const styles = {
  OverlayBackdrop,
  OverlayCard,
  OverlayHeader,
  IconContainer,
  IconRayStyle,
  IconGlowCircle,
  OverlayIcon,
  OverlayTitle,
  OverlayDescription,
  XpChip,
  OverlayButton,
};

// Global keyframes matching the design spec
export const globalKeyframes = `
  @keyframes ovBackdrop {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes ovCard {
    0% { opacity: 0; transform: translateY(20px) scale(0.94); }
    100% { opacity: 1; transform: none; }
  }
  
  @keyframes badgePop {
    0% { opacity: 0; transform: scale(0.2) rotate(-25deg); }
    55% { opacity: 1; transform: scale(1.18) rotate(6deg); }
    75% { transform: scale(0.96) rotate(-2deg); }
    100% { transform: scale(1) rotate(0); }
  }
  
  @keyframes raySpin {
    from { transform: rotate(0); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes glowPulse {
    0%, 100% { opacity: 0.55; transform: scale(1); }
    50% { opacity: 0.9; transform: scale(1.08); }
  }
`;
