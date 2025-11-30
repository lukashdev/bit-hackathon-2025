"use client"
import { Header } from "@/components/Header/Header"
import { Footer } from "@/components/Footer/Footer"
import { Container, Box, Heading, HStack, VStack, Flex, Text, Card, Badge, Separator, Progress, Button, Circle, Spinner, Avatar } from "@chakra-ui/react"
import { Calendar, CheckCircle2, Clock, ArrowLeft, Check, Users, Trophy } from "lucide-react"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useSearchParams } from "next/navigation"

interface User {
    id: string
    name: string
    image: string | null
}

interface Like {
    userId: string
    proofId: number
}

interface Proof {
    id: number
    goalId: number
    userId: string
    createdAt: string
    user: User
    likes: Like[]
}

interface Goal {
    id: number
    title: string
    description: string
    startDate: string
    endDate: string
    proofs: Proof[]
}

interface Activity {
    id: number
    name: string
    description: string
    goals: Goal[]
    participants: { userId: string, role: string, user: User }[]
}

export default function ActivityProgressPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const searchParams = useSearchParams()
    const userIdParam = searchParams.get("userId")
    
    const { data: session } = authClient.useSession()
    const [activity, setActivity] = useState<Activity | null>(null)
    const [loading, setLoading] = useState(true)

    const targetUserId = userIdParam || session?.user?.id

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await fetch(`/api/activities/${id}`)
                if (!res.ok) throw new Error("Failed to fetch activity")
                const data = await res.json()
                setActivity(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchActivity()
    }, [id])

    if (loading) return <Container maxW="8xl" py={8}><Spinner /></Container>
    if (!activity || !targetUserId) return <Container maxW="8xl" py={8}><Text>Nie znaleziono danych</Text></Container>

    const targetUser = activity.participants.find(p => p.userId === targetUserId)?.user

    if (!targetUser) return <Container maxW="8xl" py={8}><Text>Użytkownik nie należy do tej aktywności</Text></Container>

    const totalGoals = activity.goals.length
    const completedGoals = activity.goals.filter(g => {
        const proof = g.proofs.find(p => p.userId === targetUserId)
        if (!proof) return false
        const requiredLikes = Math.ceil(activity.participants.length * 0.50)
        return proof.likes.length >= requiredLikes
    }).length

    const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0

    return (
        <>
            <Header />
            <Container maxW="8xl" py={8} minH="calc(100vh - 74px)">
                <Button asChild variant="ghost" mb={6} size="sm">
                    <Link href={`/activity/${id}`}>
                        <ArrowLeft /> Powrót do aktywności
                    </Link>
                </Button>

                <Box
                 w="100%"
                 p={8}
                 borderRadius="xl"
                 bg={{ base: "whiteAlpha.500", _dark: "whiteAlpha.100" }}
                 backdropFilter="blur(10px)"
                 mb={8}
                 borderWidth="1px"
                 borderColor="whiteAlpha.200"
                >
                    <HStack mb={4} gap={4}>
                        <Avatar.Root size="lg">
                            <Avatar.Image src={targetUser.image || undefined} />
                            <Avatar.Fallback name={targetUser.name} />
                        </Avatar.Root>
                        <Box>
                            <Heading size="2xl" mb={1}>
                                Postępy: {targetUser.name}
                            </Heading>
                            <Text fontSize="lg" color="gray.500">
                                Aktywność: {activity.name}
                            </Text>
                        </Box>
                    </HStack>
                    
                    <Box mt={6}>
                        <Flex justify="space-between" mb={2}>
                            <Text fontWeight="medium">Zaliczone cele</Text>
                            <Text fontWeight="bold">{completedGoals} / {totalGoals}</Text>
                        </Flex>
                        <Progress.Root value={progressPercentage} colorPalette="green" size="lg" striped animated>
                            <Progress.Track>
                                <Progress.Range />
                            </Progress.Track>
                        </Progress.Root>
                    </Box>
                </Box>

                <VStack gap={6} align="stretch">
                    <Heading size="xl" mb={2}>Szczegóły celów</Heading>

                    {activity.goals.map(goal => {
                        const proof = goal.proofs.find(p => p.userId === targetUserId)
                        const participantsCount = activity.participants.length
                        const requiredLikes = Math.ceil(participantsCount * 0.50)
                        const likesCount = proof ? proof.likes.length : 0
                        const isVerified = likesCount >= requiredLikes
                        const isSubmitted = !!proof
                        const isExpired = new Date(goal.endDate) < new Date()

                        let statusColor = "gray"
                        let statusText = "Oczekujący"
                        
                        if (isVerified) {
                            statusColor = "green"
                            statusText = "Ukończono"
                        } else if (isSubmitted) {
                            statusColor = "orange"
                            statusText = "Weryfikacja"
                        } else if (isExpired) {
                            statusColor = "red"
                            statusText = "Nieukończono"
                        }

                        return (
                            <Card.Root 
                                key={goal.id}
                                variant="elevated" 
                                bg={isVerified ? { base: "green.50", _dark: "whiteAlpha.50" } : { base: "whiteAlpha.800", _dark: "whiteAlpha.100" }}
                                borderColor={isVerified ? "green.200" : undefined}
                                borderWidth={isVerified ? "1px" : undefined}
                                backdropFilter="blur(10px)"
                            >
                                <Card.Body>
                                    <Flex justify="space-between" align="start" gap={4} direction={{ base: "column", sm: "row" }}>
                                        <Box>
                                            <HStack mb={2}>
                                                <Heading size="md">{goal.title}</Heading>
                                                <Badge colorPalette={statusColor} variant={isVerified ? "solid" : "subtle"}>{statusText}</Badge>
                                            </HStack>
                                            <Text color="gray.500" mb={4}>
                                                {goal.description}
                                            </Text>
                                        </Box>
                                        {isVerified && (
                                            <Box textAlign="right">
                                                <Text fontSize="sm" color="gray.500">Data ukończenia</Text>
                                                <Text fontWeight="medium">{new Date(proof!.createdAt).toLocaleDateString()}</Text>
                                            </Box>
                                        )}
                                    </Flex>

                                    {isSubmitted && !isVerified && (
                                        <Box mb={4} p={4} bg="whiteAlpha.200" borderRadius="md">
                                            <Heading size="sm" mb={3}>Status weryfikacji</Heading>
                                            <HStack gap={4}>
                                                <VStack align="center" gap={1}>
                                                    <Circle size={8} bg="green.500" color="white"><Check size={16}/></Circle>
                                                    <Text fontSize="xs">Wysłano</Text>
                                                </VStack>
                                                <Separator flex={1} borderColor="green.500" />
                                                <VStack align="center" gap={1}>
                                                    <Circle size={8} bg="orange.500" color="white"><Users size={16}/></Circle>
                                                    <Text fontSize="xs">Głosowanie ({likesCount}/{requiredLikes})</Text>
                                                </VStack>
                                                <Separator flex={1} />
                                                <VStack align="center" gap={1}>
                                                    <Circle size={8} bg="gray.200" color="gray.500"><Trophy size={16}/></Circle>
                                                    <Text fontSize="xs">Zaliczono</Text>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                    )}
                                    
                                    <Separator my={4} borderColor={isVerified ? "green.200" : undefined} />
                                    
                                    {isVerified ? (
                                        <HStack color="green.600">
                                            <CheckCircle2 size={20} />
                                            <Text fontWeight="medium">Zatwierdzone przez społeczność ({likesCount}/{participantsCount} głosów)</Text>
                                        </HStack>
                                    ) : (
                                        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                            <HStack color="gray.500" fontSize="sm">
                                                <Calendar size={16} />
                                                <Text>Termin: {new Date(goal.endDate).toLocaleDateString()}</Text>
                                            </HStack>
                                            {!isExpired && (
                                                <HStack color="gray.500" fontSize="sm">
                                                    <Clock size={16} />
                                                    <Text>Pozostało {Math.ceil((new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dni</Text>
                                                </HStack>
                                            )}
                                        </Flex>
                                    )}
                                </Card.Body>
                            </Card.Root>
                        )
                    })}
                </VStack>

            </Container>
            <Footer />
        </>
    )
}
