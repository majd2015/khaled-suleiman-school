// Approved light-glass identity, independent of the OS color scheme.
export const colors = {
  light: {
    primary: "#2563EB",
    "primary-dark": "#10182F",
    accent: "#2563EB",
    "on-accent": "#FFFFFF",
    bg: "#F5F8FC",
    mint: "#EAF4FF",
    surface: "#FFFFFF",
    text: "#10182F",
    muted: "#53627A",
    border: "#DCE5F2",
    "on-dark": "#DAE5F6",
    g7: "#0E7490",
    g8: "#7C3AED",
    g9: "#C2410C",
    cyan: "#06B6D4",
    violet: "#7C3AED",
    orange: "#EA580C",
    danger: "#B42318",
    "danger-bg": "#FFF1EE",
    "danger-border": "#F3BEB5",
    success: "#176B4B",
    holiday: "#7C3AED",
    "pending-bg": "#F0F4FA",
    "pending-text": "#53627A",
  },
} as const;
export const themeColor = colors.light.bg;
export const brandCss =
  ":root{" +
  Object.entries(colors.light)
    .map(([k, v]) => "--" + k + ":" + v + ";")
    .join("") +
  "}";
