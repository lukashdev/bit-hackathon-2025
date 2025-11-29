"use client"
import { Box, Button, Container, HStack, Text, Flex, Heading } from "@chakra-ui/react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ColorModeButton } from "@/components/ui/color-mode";
import { AccessibilityControls } from "@/components/ui/accessibility-controls";
import Link from "next/link";
import { LuLogOut, LuUser } from "react-icons/lu";

export function Header() {
    const session = useSession();
    const router = useRouter()

    const signOutHandler = async () => {
        await signOut();
        router.push("/");
    }

    return (
        <Box
            as="header"
            w="100%"
            position="sticky"
            top="0"
            zIndex={100}
            bg={{ base: "rgba(255, 239, 234, 0.8)", _dark: "rgba(18, 18, 18, 0.8)" }}
            backdropFilter="blur(12px)"
            borderBottom="1px solid"
            borderColor="brand.borderColor"
            transition="background 0.2s"
        >
            <Container maxW="container.xl" h="70px">
                <Flex h="100%" justifyContent="space-between" alignItems="center">
                    {/* Logo */}
                    <Link href="/">
                        <HStack gap={2} cursor="pointer">
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
                                <Text color="brand.mainText" fontWeight="bold" fontSize="lg">G</Text>
                            </Box>
                            <Heading size="lg" color="brand.mainText" fontWeight="bold" letterSpacing="tight">
                                GlowUp
                            </Heading>
                        </HStack>
                    </Link>

                    <HStack gap={4}>
                        <AccessibilityControls />
                        <ColorModeButton />
                        
                        {session.data ? (
                            <HStack gap={4}>
                                <Link href="/profile">
                                    <Button variant="ghost" size="sm" gap={2} color="brand.mainText">
                                        <LuUser />
                                        <Text fontWeight="medium">{session.data.user.name}</Text>
                                    </Button>
                                </Link>
                                <Button 
                                    size="sm" 
                                    variant="surface"
                                    colorPalette="red"
                                    onClick={signOutHandler}
                                >
                                    <LuLogOut />
                                    Wyloguj
                                </Button>
                            </HStack>
                        ) : (
                            <HStack gap={2}>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" color="brand.mainText">
                                        Zaloguj
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button 
                                        size="sm" 
                                        bg="brand.accent" 
                                        color="brand.buttonText" 
                                        _hover={{ bg: "brand.accent2" }}
                                    >
                                        Zarejestruj
                                    </Button>
                                </Link>
                            </HStack>
                        )}
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
}