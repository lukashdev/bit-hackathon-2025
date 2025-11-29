"use client"
import { Box, Button, Container, HStack, Text, Flex, Heading, Skeleton, Popover } from "@chakra-ui/react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ColorModeButton } from "@/components/ui/color-mode";
import { AccessibilityControls } from "@/components/ui/accessibility-controls";
import Link from "next/link";
import { LuLogOut, LuUser, LuBell, LuPlus } from "react-icons/lu";
import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";

interface Invitation {
    id: number
    sender: { name: string }
    activity: { name: string }
}

export function Header() {
    const session = useSession();
    const router = useRouter()
    const [invitations, setInvitations] = useState<Invitation[]>([])

    const signOutHandler = async () => {
        await signOut();
        router.push("/");
    }

    const fetchInvitations = async () => {
        if (!session.data) return
        try {
            const res = await fetch("/api/invitations")
            if (res.ok) {
                const data = await res.json()
                setInvitations(data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchInvitations()
    }, [session.data])

    const handleRespond = async (id: number, action: "accept" | "reject") => {
        try {
            const res = await fetch(`/api/invitations/${id}/respond`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action })
            })
            if (res.ok) {
                toaster.create({ title: "Sukces", description: action === "accept" ? "Zaakceptowano zaproszenie" : "Odrzucono zaproszenie", type: "success" })
                fetchInvitations()
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Box
            as="header"
            w="100%"
            position="sticky"
            top="0"
            zIndex={100}
            bg={{ base: "rgba(255, 239, 234, 0.3)", _dark: "rgba(18, 18, 18, 0.3)" }}
            backdropFilter="blur(6px)"
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
                                <Text color="brand.mainText" fontWeight="bold" fontSize="lg">L</Text>
                            </Box>
                            <Heading size="lg" color="brand.mainText" fontWeight="bold" letterSpacing="tight">
                                LosersLogo
                            </Heading>
                        </HStack>
                    </Link>

                    <HStack gap={4}>
                        <AccessibilityControls />
                        <ColorModeButton />
                        
                        {session.isPending ? (
                            <HStack gap={4}>
                                <Skeleton width="120px" height="32px" />
                                <Skeleton width="90px" height="32px" />
                            </HStack>
                        ) : session.data ? (
                            <HStack gap={4}>
                                <Link href="/activity/add">
                                    <Button variant="ghost" size="sm" title="Utwórz aktywność">
                                        <LuPlus />
                                    </Button>
                                </Link>

                                <Popover.Root positioning={{ placement: "bottom-end", gutter: 10 }}>
                                    <Popover.Trigger asChild>
                                        <Button variant="ghost" size="sm" position="relative">
                                            <LuBell />
                                            {invitations.length > 0 && (
                                                <Box position="absolute" top="0" right="0" w="8px" h="8px" bg="red.500" borderRadius="full" />
                                            )}
                                        </Button>
                                    </Popover.Trigger>
                                    <Popover.Positioner>
                                        <Popover.Content width="300px">
                                            <Popover.Arrow />
                                            <Popover.Body>
                                                <Heading size="sm" mb={2}>Zaproszenia</Heading>
                                                {invitations.length === 0 ? (
                                                    <Text fontSize="sm" color="gray.500">Brak nowych zaproszeń</Text>
                                                ) : (
                                                    <Flex direction="column" gap={2}>
                                                        {invitations.map(inv => (
                                                            <Box key={inv.id} p={2} borderWidth="1px" borderRadius="md">
                                                                <Text fontSize="sm">
                                                                    <Text as="span" fontWeight="bold">{inv.sender.name}</Text> zaprasza do <Text as="span" fontWeight="bold">{inv.activity.name}</Text>
                                                                </Text>
                                                                <HStack mt={2} justify="flex-end">
                                                                    <Button size="xs" colorPalette="green" onClick={() => handleRespond(inv.id, "accept")}>Akceptuj</Button>
                                                                    <Button size="xs" colorPalette="red" variant="ghost" onClick={() => handleRespond(inv.id, "reject")}>Odrzuć</Button>
                                                                </HStack>
                                                            </Box>
                                                        ))}
                                                    </Flex>
                                                )}
                                            </Popover.Body>
                                        </Popover.Content>
                                    </Popover.Positioner>
                                </Popover.Root>

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