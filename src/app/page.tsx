"use client";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Box, Flex, Heading, Image, Stack, Button, Text, Link } from "@chakra-ui/react";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box 
      as="main" 
      margin={{ base: "10px auto", md: "20px auto" }}
      w={{ base: "95%", md: "80%" }} 
      p={{ base: 4, md: 8 }} 
      >
        {/* Main content goes here */}
        <Stack direction={{ base: "column", md: "row" }} gap={8} align="center">
          <Box w={{ base: "100%", md: "50%" }}>
            <Heading size={{ base: "4xl", md: "5xl" }} mb={{ base: 6, md: 10 }}>
              Witamy w GlowUp Together
            </Heading>
            <Heading size={{ base: "3xl", md: "4xl" }} mb={{ base: 6, md: 10 }}>
              Dołącz do społeczności nastawionej na <Text as="span" color="brand.accent">sukces.</Text>
            </Heading>
            <Heading size={{ base: "xl", md: "2xl" }} mb={{ base: 10, md: 20 }}>
              Porzuć prokrastynację i odzyskaj kontrolę nad swoim życiem.
            </Heading>
            <Button 
              size={{ base: "md", md: "lg" }} 
              bg="brand.accent"
              color="brand.buttonText"
              _hover={{ bg: "brand.accent2" }}
              boxShadow="md"
              w={{ base: "full", md: "auto" }}
              >
                {!session ? <Link href="/register" _hover={{ textDecoration: "none", color: "inherit" }}>
              Rozpocznij swoją podróż już dziś!
              </Link> : <Link href="/profile" _hover={{ textDecoration: "none", color: "inherit" }}>
              Przejdź do swojego profilu
              </Link>}
            </Button>
          </Box>
          <Box w={{ base: "100%", md: "50%" }} display="flex" justifyContent={{ base: "center", md: "flex-end" }}>
            <Image src="/mainpicture.png" alt="Welcome Image" maxW="100%" height="auto"/>
          </Box>
        </Stack>
      </Box>
      <Footer />
    </Flex>
  );
}
