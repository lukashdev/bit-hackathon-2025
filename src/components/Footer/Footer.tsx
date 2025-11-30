"use client"
import { Box, Container, HStack, Text, Stack, Link, Icon, Separator, Heading, Image, ClientOnly, Skeleton } from "@chakra-ui/react";
import { LuGithub, LuTwitter, LuLinkedin } from "react-icons/lu";
import { useColorModeValue } from "@/components/ui/color-mode";

export function Footer() {
  const logoSrc = useColorModeValue("/logo-black.png", "/logo.png");
  return (
    
    <Box 
      as="footer" 
      w="100%" 
      bg={{ base: "rgba(255, 239, 234, 0.3)", _dark: "rgba(18, 18, 18, 0.3)" }}
      backdropFilter="blur(6px)"
      borderTopWidth="1px" 
      borderColor="brand.borderColor"
      py={8}
      transition="background 0.2s"
    >
      <Container maxW="container.xl" px={4}>
        <Stack gap={6}>
          <Stack 
            direction={{ base: "column", md: "row" }} 
            justify="space-between" 
            align="center"
            gap={4}
          >
            <HStack gap={2}>
                    <ClientOnly fallback={<Skeleton w="40px" h="40px" />}>
                        <Image 
                          src={logoSrc}
                          alt="Logo" 
                          maxH="52px"
                          objectFit="contain"
                        />
                    </ClientOnly>
                <Text fontWeight="bold" color="brand.mainText" fontSize="lg" ml={2}>GlowUp Together</Text>
            </HStack>
            
            <HStack gap={4}>
              <Link href="#" color="brand.mainText" _hover={{ color: "brand.accent" }}>
                <Icon fontSize="xl"><LuGithub /></Icon>
              </Link>
              <Link href="#" color="brand.mainText" _hover={{ color: "brand.accent" }}>
                <Icon fontSize="xl"><LuTwitter /></Icon>
              </Link>
              <Link href="#" color="brand.mainText" _hover={{ color: "brand.accent" }}>
                <Icon fontSize="xl"><LuLinkedin /></Icon>
              </Link>
            </HStack>
          </Stack>
          
          <Separator borderColor="brand.borderColor" />
          
          <Stack 
            direction={{ base: "column", md: "row" }} 
            justify="space-between" 
            align="center"
            fontSize="sm"
            color="brand.content"
            gap={4}
          >
            <Text>© 2025 Światłowody Makajlera. Wszelkie prawa zastrzeżone.</Text>
            <HStack gap={4}>
              <Link href="/privacy" color="brand.content" _hover={{ color: "brand.accent" }}>Polityka Prywatności</Link>
              <Link href="#" color="brand.content" _hover={{ color: "brand.accent" }}>Regulamin</Link>
              <Link href="#" color="brand.content" _hover={{ color: "brand.accent" }}>Kontakt</Link>
            </HStack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
