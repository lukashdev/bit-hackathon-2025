"use client";

import {
  IconButton,
  Popover,
  VStack,
  HStack,
  Text,
  Button,
  Box,
  Separator
} from "@chakra-ui/react";
import { LuAccessibility, LuMinus, LuPlus, LuRefreshCcw } from "react-icons/lu";
import { useAccessibility } from "./accessibility-provider";
import { Switch } from "./switch";

export function AccessibilityControls() {
  const {
    isHighContrast,
    toggleHighContrast,
    fontSizeIndex,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
  } = useAccessibility();

  return (
    <Popover.Root positioning={{ placement: "bottom-end", gutter: 10 }}>
      <Popover.Trigger asChild>
        <IconButton
          variant="ghost"
          aria-label="Ustawienia dostępności"
          size="sm"
          color="brand.mainText"
        >
          <LuAccessibility size={20} />
        </IconButton>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content width="300px">
            <Popover.Arrow />
            <Popover.Body>
                <VStack gap={4} align="stretch">
                    <Text fontWeight="bold" fontSize="lg">Dostępność</Text>
                    <Separator />
                    
                    {/* High Contrast Toggle */}
                    <HStack justify="space-between">
                        <Text fontSize="sm">Zwiększ kontrast</Text>
                        <Switch 
                            checked={isHighContrast}
                            onCheckedChange={(e) => toggleHighContrast()}
                            colorPalette="blue"
                        />
                    </HStack>

                    <Separator />

                    {/* Font Size Controls */}
                    <VStack align="stretch" gap={2}>
                        <Text fontSize="sm">Rozmiar tekstu</Text>
                        <HStack justify="center" bg="gray.100" _dark={{ bg: "gray.700" }} p={2} borderRadius="md">
                            <IconButton 
                                onClick={decreaseFontSize} 
                                disabled={fontSizeIndex === 0}
                                size="sm"
                                variant="ghost"
                                aria-label="Zmniejsz tekst"
                            >
                                <LuMinus />
                            </IconButton>
                            <Box flex="1" textAlign="center">
                                <Text fontWeight="bold">
                                    {fontSizeIndex === 0 ? "A" : fontSizeIndex === 1 ? "A+" : fontSizeIndex === 2 ? "A++" : "A+++"}
                                </Text>
                            </Box>
                            <IconButton 
                                onClick={increaseFontSize} 
                                disabled={fontSizeIndex === 3}
                                size="sm"
                                variant="ghost"
                                aria-label="Zwiększ tekst"
                            >
                                <LuPlus />
                            </IconButton>
                        </HStack>
                        <Button size="xs" variant="ghost" onClick={resetFontSize} gap={2}>
                            <LuRefreshCcw /> Resetuj rozmiar
                        </Button>
                    </VStack>
                </VStack>
            </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
}
