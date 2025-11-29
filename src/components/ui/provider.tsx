"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { themeSystem } from "@/styles/theme"
import { Toaster } from "./toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function Provider(props: ColorModeProviderProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={themeSystem}>
        <ColorModeProvider {...props} />
        <Toaster />
      </ChakraProvider>
    </QueryClientProvider>
  )
}
