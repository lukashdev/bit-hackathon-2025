import { Box, Container, HStack, Text, Stack, Link, Icon, Separator, Heading } from "@chakra-ui/react";
import { LuGithub, LuTwitter, LuLinkedin } from "react-icons/lu";

export function Footer() {
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
                <Box 
                    w="32px" 
                    h="32px" 
                    bg="brand.accent" 
                    borderRadius="lg" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                    transform="rotate(15deg)"
                >
                    <Text color="brand.mainText" fontWeight="bold" fontSize="lg">L</Text>
                </Box>
                <Heading size="lg" color="brand.mainText" fontWeight="bold" letterSpacing="tight">
                    LosersLogo
                </Heading>
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
            <Text>© 2025 LosersLogo. Wszelkie prawa zastrzeżone.</Text>
            <HStack gap={4}>
              <Link href="#" color="brand.content" _hover={{ color: "brand.accent" }}>Polityka Prywatności</Link>
              <Link href="#" color="brand.content" _hover={{ color: "brand.accent" }}>Regulamin</Link>
              <Link href="#" color="brand.content" _hover={{ color: "brand.accent" }}>Kontakt</Link>
            </HStack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
