"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AccessibilityContextType {
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  fontSizeIndex: number; // 0: Normal, 1: Medium, 2: Large
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(0);

  // Font size percentages corresponding to indices: 0=100%, 1=110%, 2=125%, 3=150%
  const fontSizes = [100, 110, 125, 150];

  useEffect(() => {
    // Load preferences from local storage
    const savedContrast = localStorage.getItem("accessibility-high-contrast");
    const savedFontSize = localStorage.getItem("accessibility-font-size");

    if (savedContrast) setIsHighContrast(JSON.parse(savedContrast));
    if (savedFontSize) setFontSizeIndex(parseInt(savedFontSize));
  }, []);

  useEffect(() => {
    // Apply High Contrast
    if (isHighContrast) {
      document.documentElement.setAttribute("data-high-contrast", "true");
    } else {
      document.documentElement.removeAttribute("data-high-contrast");
    }
    localStorage.setItem("accessibility-high-contrast", JSON.stringify(isHighContrast));
  }, [isHighContrast]);

  useEffect(() => {
    // Apply Font Size
    const size = fontSizes[fontSizeIndex];
    document.documentElement.style.fontSize = `${size}%`;
    localStorage.setItem("accessibility-font-size", fontSizeIndex.toString());
  }, [fontSizeIndex]);

  const toggleHighContrast = () => setIsHighContrast((prev) => !prev);

  const increaseFontSize = () => {
    setFontSizeIndex((prev) => Math.min(prev + 1, fontSizes.length - 1));
  };

  const decreaseFontSize = () => {
    setFontSizeIndex((prev) => Math.max(prev - 1, 0));
  };

  const resetFontSize = () => setFontSizeIndex(0);

  return (
    <AccessibilityContext.Provider
      value={{
        isHighContrast,
        toggleHighContrast,
        fontSizeIndex,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
