"use client"

import { Box, Container, Heading, Text, Button, VStack } from "@chakra-ui/react"
import Link from "next/link"
import { Header } from "@/components/Header/Header"
import { Footer } from "@/components/Footer/Footer"

export default function NotFound() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="brand.background">
      <Header />
      <Container maxW="container.xl" flex="1" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={6} textAlign="center">
          <Heading size="4xl" color="brand.accent">404</Heading>
          <Heading size="xl" color="brand.mainText">Strona nie znaleziona</Heading>
          <Text color="brand.content" fontSize="lg" maxW="md">
            Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.
          </Text>
          <Button asChild size="lg" bg="brand.accent" color="brand.buttonText" _hover={{ bg: "brand.accent2" }}>
            <Link href="/">
              Wróć na stronę główną
            </Link>
          </Button>
        </VStack>
      </Container>
      <Footer />
    </Box>
  )
}
