"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { themeSystem } from "@/styles/theme"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={themeSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
