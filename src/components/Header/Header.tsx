"use client"
import { Box, Button, Container, HStack, Text, Flex, Heading, Skeleton, Popover, VStack, IconButton, Image, ClientOnly } from "@chakra-ui/react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ColorModeButton, useColorModeValue } from "@/components/ui/color-mode";
import { AccessibilityControls } from "@/components/ui/accessibility-controls";
import Link from "next/link";
import { LuLogOut, LuUser, LuBell, LuPlus, LuMenu, LuX, LuRadar } from "react-icons/lu";
import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";

interface Invitation {
    id: number
    sender: { name: string }
    activity: { id: number, name: string }
}

export function Header() {
    const session = useSession();
    const router = useRouter()
    const [invitations, setInvitations] = useState<Invitation[]>([])
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const logoSrc = useColorModeValue("/logo-black.png", "/logo.png")

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

    const handleRespond = async (id: number, activityId: number, action: "accept" | "reject") => {
        try {
            const res = await fetch(`/api/invitations/${id}/respond`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action })
            })
            if (res.ok) {
                toaster.create({ title: "Sukces", description: action === "accept" ? "Zaakceptowano zaproszenie" : "Odrzucono zaproszenie", type: "success" })
                fetchInvitations()
                if (action === "accept") {
                    router.push(`/activity/${activityId}`)
                    setIsMobileMenuOpen(false)
                }
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
            bg={{ base: "rgba(255, 239, 234, 0.95)", _dark: "rgba(18, 18, 18, 0.95)" }}
            backdropFilter="blur(10px)"
            borderBottom="1px solid"
            borderColor="brand.borderColor"
            transition="background 0.2s"
        >
            <Container maxW="container.xl" h="70px">
                <Flex h="100%" justifyContent="space-between" alignItems="center">
                    {/* Logo */}
                    <Link href="/">
                        <HStack gap={2} cursor="pointer">
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
                    </Link>

                    {/* Desktop Navigation */}
                    <HStack gap={4} display={{ base: "none", md: "flex" }}>
                        <AccessibilityControls />
                        <ColorModeButton />
                        
                        {session.isPending ? (
                            <HStack gap={4}>
                                <Skeleton width="120px" height="32px" />
                                <Skeleton width="90px" height="32px" />
                            </HStack>
                        ) : session.data ? (
                            <HStack gap={4}>
                                <Link href="/radar">
                                    <Button variant="ghost" size="sm" gap={2}>
                                        <LuRadar /> Radar
                                    </Button>
                                </Link>

                                <Tooltip content="Utwórz aktywność">
                                    <Link href="/activity/add">
                                        <Button variant="ghost" size="sm">
                                            <LuPlus />
                                            Utwórz aktywność
                                        </Button>
                                    </Link>
                                </Tooltip>

                                <Popover.Root positioning={{ placement: "bottom-end", gutter: 10 }}>
                                    <Popover.Trigger asChild>
                                        <Box display="inline-block">
                                            <Tooltip content="Powiadomienia">
                                                <Button variant="ghost" size="sm" position="relative">
                                                    <LuBell />
                                                    {invitations.length > 0 && (
                                                        <Box position="absolute" top="0" right="0" w="8px" h="8px" bg="red.500" borderRadius="full" />
                                                    )}
                                                </Button>
                                            </Tooltip>
                                        </Box>
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
                                                                    <Button size="xs" colorPalette="green" onClick={() => handleRespond(inv.id, inv.activity.id, "accept")}>Akceptuj</Button>
                                                                    <Button size="xs" colorPalette="red" variant="ghost" onClick={() => handleRespond(inv.id, inv.activity.id, "reject")}>Odrzuć</Button>
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
                                    Wyloguj się
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

                    {/* Mobile Navigation Toggle */}
                    <HStack display={{ base: "flex", md: "none" }} gap={2}>
                        <AccessibilityControls />
                        <ColorModeButton />
                        <Button variant="ghost" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
                        </Button>
                    </HStack>
                </Flex>
            </Container>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <Box
                    position="absolute"
                    top="70px"
                    left="0"
                    w="100%"
                    h="calc(100vh - 70px)"
                    bg="brand.background"
                    zIndex={99}
                    p={4}
                    borderBottom="1px solid"
                    borderColor="brand.borderColor"
                    overflowY="auto"
                >
                    <VStack gap={4} align="stretch">
                        {session.data ? (
                            <>
                                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="ghost" w="100%" justifyContent="flex-start" gap={3}>
                                        <LuUser /> Profil ({session.data.user.name})
                                    </Button>
                                </Link>
                                <Link href="/radar" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="ghost" w="100%" justifyContent="flex-start" gap={3}>
                                        <LuRadar /> Radar aktywności
                                    </Button>
                                </Link>
                                <Link href="/activity/add" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="ghost" w="100%" justifyContent="flex-start" gap={3}>
                                        <LuPlus /> Utwórz aktywność
                                    </Button>
                                </Link>
                                
                                {/* Mobile Invitations */}
                                <Box p={4} borderWidth="1px" borderRadius="md" bg="whiteAlpha.200">
                                    <Heading size="sm" mb={2} display="flex" alignItems="center" gap={2}>
                                        <LuBell /> Zaproszenia ({invitations.length})
                                    </Heading>
                                    {invitations.length === 0 ? (
                                        <Text fontSize="sm" color="gray.500">Brak nowych zaproszeń</Text>
                                    ) : (
                                        <VStack gap={2} align="stretch">
                                            {invitations.map(inv => (
                                                <Box key={inv.id} p={2} borderWidth="1px" borderRadius="md" bg="whiteAlpha.500">
                                                    <Text fontSize="sm" mb={2}>
                                                        <strong>{inv.sender.name}</strong> zaprasza do <strong>{inv.activity.name}</strong>
                                                    </Text>
                                                    <HStack>
                                                        <Button size="xs" colorPalette="green" flex={1} onClick={() => handleRespond(inv.id, inv.activity.id, "accept")}>Akceptuj</Button>
                                                        <Button size="xs" colorPalette="red" variant="ghost" flex={1} onClick={() => handleRespond(inv.id, inv.activity.id, "reject")}>Odrzuć</Button>
                                                    </HStack>
                                                </Box>
                                            ))}
                                        </VStack>
                                    )}
                                </Box>

                                <Button 
                                    variant="surface" 
                                    colorPalette="red" 
                                    w="100%" 
                                    justifyContent="flex-start" 
                                    gap={3}
                                    onClick={() => {
                                        signOutHandler();
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    <LuLogOut /> Wyloguj
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="ghost" w="100%" justifyContent="flex-start">
                                        Zaloguj
                                    </Button>
                                </Link>
                                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button 
                                        w="100%" 
                                        bg="brand.accent" 
                                        color="brand.buttonText" 
                                        _hover={{ bg: "brand.accent2" }}
                                    >
                                        Zarejestruj
                                    </Button>
                                </Link>
                            </>
                        )}
                    </VStack>
                </Box>
            )}
        </Box>
    );
}