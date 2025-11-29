import { Box, Container, HStack, Text, Stack, Link, Icon, Separator } from "@chakra-ui/react";
import { LuGithub, LuTwitter, LuLinkedin } from "react-icons/lu";

export function Footer() {
  return (
    <Box 
      as="footer" 
      w="100%" 
      bg="bg.subtle" 
      borderTopWidth="1px" 
      borderColor="border.muted"
      py={8}
    >
      <Container maxW="8xl" px={4}>
        <Stack gap={6}>
          <Stack 
            direction={{ base: "column", md: "row" }} 
            justify="space-between" 
            align="center"
            gap={4}
          >
            <Text fontWeight="bold" fontSize="lg">Światłowody Makajlera</Text>
            
            <HStack gap={4}>
              <Link href="#" color="fg.muted" _hover={{ color: "fg" }}>
                <Icon fontSize="xl"><LuGithub /></Icon>
              </Link>
              <Link href="#" color="fg.muted" _hover={{ color: "fg" }}>
                <Icon fontSize="xl"><LuTwitter /></Icon>
              </Link>
              <Link href="#" color="fg.muted" _hover={{ color: "fg" }}>
                <Icon fontSize="xl"><LuLinkedin /></Icon>
              </Link>
            </HStack>
          </Stack>
          
          <Separator />
          
          <Stack 
            direction={{ base: "column", md: "row" }} 
            justify="space-between" 
            align="center"
            fontSize="sm"
            color="fg.muted"
            gap={4}
          >
            <Text>© 2025 Światłowody Makajlera. Wszelkie prawa zastrzeżone.</Text>
            <HStack gap={4}>
              <Link href="#" _hover={{ color: "fg" }}>Polityka Prywatności</Link>
              <Link href="#" _hover={{ color: "fg" }}>Regulamin</Link>
              <Link href="#" _hover={{ color: "fg" }}>Kontakt</Link>
            </HStack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
