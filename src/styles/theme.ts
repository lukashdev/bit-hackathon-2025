import {
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react"

const config = defineConfig({
  conditions: {
    highContrast: "[data-high-contrast=true] &",
    highContrastDark: "[data-high-contrast=true].dark &, [data-high-contrast=true][data-theme=dark] &",
  },
  globalCss: {
    "html, body": {
      bg: "brand.background",
      backgroundImage: {
        base: "radial-gradient(circle at 10% 20%, rgba(150, 173, 206, 0.2) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(98, 113, 135, 0.2) 0%, transparent 40%)",
        _dark: "radial-gradient(circle at 10% 20%, rgba(66, 86, 117, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(45, 55, 72, 0.15) 0%, transparent 40%)",
      },
      backgroundAttachment: "fixed",
      color: "brand.mainText",
    },
  },
  theme: {
    semanticTokens: {
      colors: {
        brand: {
          mainText: { 
            value: { 
              base: "#282828", 
              _dark: "#EDEDED", 
              _highContrast: "#000000",
              _highContrastDark: "#FFFFFF"
            } 
          },
          content: { 
            value: { 
              base: "#333333", 
              _dark: "#E0E0E0",
              _highContrast: "#000000",
              _highContrastDark: "#FFFFFF"
            } 
          },
          background: { 
            value: { 
              base: "#FFEFEA", 
              _dark: "#121212",
              _highContrast: "#FFFFFF",
              _highContrastDark: "#000000"
            } 
          },
          accent: { 
            value: { 
              base: "#96ADCE", 
              _dark: "#7B9ABF",
              _highContrast: "#0000FF", // Blue on White (AAA)
              _highContrastDark: "#FFFF00" // Yellow on Black (AAA)
            } 
          },
          accent2: { 
            value: { 
              base: "#627187", 
              _dark: "#A0B1C5",
              _highContrast: "#000080", // Navy on White (AAA)
              _highContrastDark: "#FFD700" // Gold on Black (AAA)
            } 
          },
          highlight: { 
            value: { 
              base: "#627187", 
              _dark: "#A0B1C5",
              _highContrast: "#000080",
              _highContrastDark: "#FFD700"
            } 
          },
          buttonText: {
            value: {
              base: "#FFFFFF",
              _dark: "#FFFFFF",
              _highContrast: "#FFFFFF", // White on Blue/Navy
              _highContrastDark: "#000000" // Black on Yellow/Gold
            }
          },
          borderColor: { 
            value: { 
              base: "rgba(0, 0, 0, 0.2)", 
              _dark: "rgba(255, 255, 255, 0.2)",
              _highContrast: "#000000",
              _highContrastDark: "#FFFFFF"
            } 
          },
          glassBg: {
            value: {
              base: "rgba(255, 255, 255, 0.2)",
              _dark: "rgba(255, 255, 255, 0.05)",
              _highContrast: "transparent",
              _highContrastDark: "transparent"
            }
          },
          glassBgInner: {
            value: {
              base: "rgba(255, 255, 255, 0.1)",
              _dark: "rgba(255, 255, 255, 0.03)",
              _highContrast: "transparent",
              _highContrastDark: "transparent"
            }
          },
          glassBgInnerHover: {
            value: {
              base: "rgba(255, 255, 255, 0.15)",
              _dark: "rgba(255, 255, 255, 0.06)",
              _highContrast: "rgba(0, 0, 0, 0.1)",
              _highContrastDark: "rgba(255, 255, 255, 0.1)"
            }
          },
        },
      },
      borders: {
        brand: { value: "1px solid {colors.brand.borderColor}" },
      },
    },
  },
})

export const themeSystem = createSystem(defaultConfig, config)