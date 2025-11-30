"use client"

import { useState } from "react"
import { Box, Button, VStack, Text, HStack, IconButton, Avatar } from "@chakra-ui/react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Users, ChevronRight, LogIn } from "lucide-react"

const DEMO_USERS = [
    {
        name: 'Jan Kowalski',
        email: 'jan.kowalski@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jan',
    },
    {
        name: 'Anna Nowak',
        email: 'anna.nowak@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    },
    {
        name: 'Piotr Wiśniewski',
        email: 'piotr.wisniewski@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Piotr',
    },
    {
        name: 'Maria Wójcik',
        email: 'maria.wojcik@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    },
    {
        name: 'Tomasz Zieliński',
        email: 'tomasz.zielinski@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tomasz',
    },
    {
        name: 'Katarzyna Mazur',
        email: 'katarzyna.mazur@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Katarzyna',
    },
    {
        name: 'Michał Lewandowski',
        email: 'michal.lewandowski@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michal',
    },
    {
        name: 'Agnieszka Kamińska',
        email: 'agnieszka.kaminska@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agnieszka',
    },
]

export function DemoSwitcher() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState<string | null>(null)
    const router = useRouter()
    const { data: session } = authClient.useSession()

    const handleLogin = async (email: string) => {
        setLoading(email)
        try {
            await authClient.signIn.email({
                email,
                password: "password123",
            }, {
                onSuccess: () => {
                    window.location.reload()
                },
                onError: (ctx) => {
                    alert(ctx.error.message)
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(null)
        }
    }

    return (
        <Box
            position="fixed"
            right={0}
            top="20%"
            zIndex={9999}
            display="flex"
            alignItems="flex-start"
        >
            <IconButton
                aria-label="Demo"
                onClick={() => setIsOpen(!isOpen)}
                borderTopLeftRadius="md"
                borderBottomLeftRadius="md"
                borderTopRightRadius={0}
                borderBottomRightRadius={0}
                colorPalette="blue"
                size="lg"
                variant="solid"
                shadow="lg"
            >
                {isOpen ? <ChevronRight /> : <Users />}
            </IconButton>
            
            <Box
                bg={{ base: "white", _dark: "gray.900" }}
                w={isOpen ? "280px" : "0px"}
                overflow="hidden"
                transition="width 0.2s ease-in-out"
                shadow={isOpen ? "xl" : "none"}
                borderBottomLeftRadius="md"
                height="auto"
                maxH="70vh"
                overflowY="auto"
                borderWidth={isOpen ? "1px" : "0px"}
                borderColor="border"
            >
                <VStack align="stretch" p={4} gap={3} minW="280px">
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">
                        Przełącz użytkownika (Demo)
                    </Text>
                    
                    {DEMO_USERS.map((user) => {
                        const isActive = session?.user?.email === user.email
                        return (
                            <Button
                                key={user.email}
                                variant={isActive ? "subtle" : "ghost"}
                                justifyContent="flex-start"
                                height="auto"
                                py={2}
                                onClick={() => handleLogin(user.email)}
                                loading={loading === user.email}
                                colorPalette={isActive ? "green" : "gray"}
                                disabled={isActive}
                            >
                                <HStack gap={3} width="100%">
                                    <Avatar.Root size="xs">
                                        <Avatar.Image src={user.image} />
                                        <Avatar.Fallback name={user.name} />
                                    </Avatar.Root>
                                    <VStack align="start" gap={0} flex={1}>
                                        <Text fontSize="sm" fontWeight="medium" truncate>{user.name}</Text>
                                        <Text fontSize="xs" color="gray.500" truncate>{user.email}</Text>
                                    </VStack>
                                    {isActive && <Box w={2} h={2} borderRadius="full" bg="green.500" />}
                                </HStack>
                            </Button>
                        )
                    })}

                    {!session && (
                        <Text fontSize="xs" color="orange.500" textAlign="center">
                            Nie jesteś zalogowany
                        </Text>
                    )}
                </VStack>
            </Box>
        </Box>
    )
}
