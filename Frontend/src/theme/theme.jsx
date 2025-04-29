import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#e6f9ed",
      100: "#c7f2d9",
      200: "#a7e3b6",
      300: "#7fd18f",
      400: "#4fbb6b",
      500: "#2e865f",
      600: "#1a7c36",
      700: "#17612d",
      800: "#204d2a",
      900: "#0d2b14",
    },
    gray: {
      50: "#f7faf8",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    green: {
      500: "#2e865f",
      600: "#1a7c36",
      700: "#17612d",
    },
    red: {
      500: "#ef4444",
      700: "#b91c1c",
    },
    yellow: {
      500: "#eab308",
      700: "#a16207",
    },
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
  },
  fontWeights: {
    normal: 400,
    medium: 600,
    bold: 700,
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  radii: {
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  shadows: {
    card: "0 4px 16px 0 rgba(46,134,95,0.07)",
    outline: "0 0 0 3px #a7e3b6",
    navbar: "0 2px 4px 0 rgba(32,77,42,0.05)",
  },
  components: {
    Button: {
      baseStyle: {
        rounded: "md",
        fontWeight: "bold",
      },
      variants: {
        solid: {
          bg: "brand.700",
          color: "white",
          _hover: { bg: "brand.800" },
        },
        outline: {
          borderColor: "brand.700",
          color: "brand.700",
          _hover: { bg: "brand.50" },
        },
      },
    },
    Badge: {
      baseStyle: {
        rounded: "md",
        px: 2,
        py: 1,
        fontWeight: "bold",
        fontSize: "xs",
      },
      variants: {
        approved: {
          bg: "green.100",
          color: "green.700",
        },
        pending: {
          bg: "yellow.100",
          color: "yellow.700",
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "brand.800",
        fontFamily: "Inter, system-ui, sans-serif",
      },
    },
  },
});

export default theme;
