"use client"
import { Header } from "@/components/Header/Header"
import { Footer } from "@/components/Footer/Footer"
import { Container, Box, Heading, HStack, VStack, Flex, Text, Card, Badge, Separator, Grid, GridItem, Avatar, Stack, Button } from "@chakra-ui/react"
import { Calendar, CheckCircle2, Users, Clock, Upload, Heart, ChevronDown, ChevronUp, Lock } from "lucide-react"
import { DialogRoot, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogActionTrigger, DialogCloseTrigger } from "@/components/ui/dialog"
import { FileUploadRoot, FileUploadDropzone, FileUploadList } from "@/components/ui/file-upload"
import Link from "next/link"
import { useState } from "react"

interface Goal {
    id: number
    title: string
    description: string
    startDate: Date
    endDate: Date
    status: "active" | "completed" | "pending"
}

// Helper to create dates relative to now
const now = new Date()
const days = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000)

const MOCK_GOALS: Goal[] = [
    {
        id: 1,
        title: "Przebiec 10km",
        description: "Przygotowanie kondycyjne do sezonu. Celem jest przebiegnięcie 10km poniżej 50 minut.",
        startDate: days(-5), // Started 5 days ago
        endDate: days(25),   // Ends in 25 days
        status: "active"
    },
    {
        id: 2,
        title: "Strzelić 5 bramek",
        description: "Poprawa skuteczności w ataku podczas meczów sparingowych.",
        startDate: days(-10),
        endDate: days(20),
        status: "active"
    },
    {
        id: 3,
        title: "Trening siłowy (Stary)",
        description: "Zbudowanie bazy siłowej przed sezonem.",
        startDate: days(-60),
        endDate: days(-10), // Ended 10 days ago
        status: "completed"
    },
    {
        id: 4,
        title: "Obóz kondycyjny (Przyszły)",
        description: "Wyjazdowy obóz w górach.",
        startDate: days(30), // Starts in 30 days
        endDate: days(40),
        status: "pending"
    }
]

export default function ActivityPage() {
    const [showPast, setShowPast] = useState(false)
    const [showFuture, setShowFuture] = useState(false)

    const currentDate = new Date()

    const activeGoals = MOCK_GOALS.filter(g => g.startDate <= currentDate && g.endDate >= currentDate)
    const pastGoals = MOCK_GOALS.filter(g => g.endDate < currentDate)
    const futureGoals = MOCK_GOALS.filter(g => g.startDate > currentDate)

    const formatDate = (date: Date) => date.toLocaleDateString('pl-PL')
    const getDaysLeft = (date: Date) => Math.ceil((date.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

    const renderGoalCard = (goal: Goal, isActive: boolean) => (
        <Card.Root 
            key={goal.id}
            variant="elevated" 
            bg={{ base: "whiteAlpha.800", _dark: "whiteAlpha.100" }}
            backdropFilter="blur(10px)"
            border="none"
            shadow="md"
            opacity={isActive ? 1 : 0.7}
        >
            <Card.Body gap={4}>
                <Flex justify="space-between" align="start" direction={{ base: "column", sm: "row" }} gap={4}>
                    <Box>
                        <Heading size="md" mb={2}>{goal.title}</Heading>
                        <Text color="gray.500" mb={4}>
                            {goal.description}
                        </Text>
                    </Box>
                    <Badge 
                        colorPalette={isActive ? "green" : (goal.endDate < currentDate ? "gray" : "blue")} 
                        variant="solid" 
                        size="lg"
                    >
                        {isActive ? (
                            <><CheckCircle2 size={14} style={{ marginRight: "4px" }} /> Aktywny</>
                        ) : (
                            goal.endDate < currentDate ? "Zakończony" : "Nadchodzący"
                        )}
                    </Badge>
                </Flex>

                <Separator />

                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                    <HStack color="gray.500" fontSize="sm">
                        <Calendar size={16} />
                        <Text>{formatDate(goal.startDate)} - {formatDate(goal.endDate)}</Text>
                    </HStack>
                    {isActive && (
                        <HStack color="gray.500" fontSize="sm">
                            <Clock size={16} />
                            <Text>Pozostało {getDaysLeft(goal.endDate)} dni</Text>
                        </HStack>
                    )}
                </Flex>

                <Box mt={4}>
                    {isActive ? (
                        <DialogRoot>
                            <DialogTrigger asChild>
                                <Button variant="solid" colorPalette="blue" size="sm">
                                    <Upload size={16} /> Wyślij dowód
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Wyślij dowód: {goal.title}</DialogTitle>
                                </DialogHeader>
                                <DialogBody>
                                    <Text mb={4} color="gray.500">
                                        Prześlij zdjęcie potwierdzające postęp (np. zdjęcie z meczu).
                                    </Text>
                                    <FileUploadRoot maxFiles={1} accept={["image/*"]}>
                                        <FileUploadDropzone label="Przeciągnij i upuść zdjęcie tutaj" description="PNG, JPG do 5MB" />
                                        <FileUploadList showSize clearable />
                                    </FileUploadRoot>
                                </DialogBody>
                                <DialogFooter>
                                    <DialogActionTrigger asChild>
                                        <Button variant="outline">Anuluj</Button>
                                    </DialogActionTrigger>
                                    <Button colorPalette="blue">Wyślij zgłoszenie</Button>
                                </DialogFooter>
                                <DialogCloseTrigger />
                            </DialogContent>
                        </DialogRoot>
                    ) : (
                        <Button disabled variant="subtle" size="sm">
                            <Lock size={16} /> {goal.endDate < currentDate ? "Zakończono przyjmowanie zgłoszeń" : "Zgłoszenia wkrótce"}
                        </Button>
                    )}
                </Box>
            </Card.Body>
        </Card.Root>
    )

    return (
        <>
            <Header />
            <Container maxW="8xl" py={8} minH="calc(100vh - 74px)">
                {/* Activity Header */}
                <Box
                 w="100%"
                 p={8}
                 borderRadius="xl"
                 bg={{ base: "whiteAlpha.500", _dark: "whiteAlpha.100" }}
                 backdropFilter="blur(10px)"
                 mb={6}
                 borderWidth="1px"
                 borderColor="whiteAlpha.200"
                >
                    <Flex justify="space-between" align="start" direction={{ base: "column", md: "row" }} gap={4}>
                        <Box>
                            <Heading size="3xl" mb={2}>
                                Piłka nożna
                            </Heading>
                            <Text fontSize="lg" color="gray.500">
                                Regularne treningi i mecze w każdy wtorek i czwartek.
                            </Text>
                        </Box>
                        <Button asChild colorPalette="blue" variant="outline">
                            <Link href="/activity/1/progress">
                                Moje postępy
                            </Link>
                        </Button>
                    </Flex>
                </Box>

                <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6}>
                    {/* Left Column: Goals */}
                    <GridItem>
                        <VStack gap={6} align="stretch">
                            <Heading size="xl">Cele aktywności</Heading>
                            
                            {/* Active Goals */}
                            {activeGoals.map(goal => renderGoalCard(goal, true))}

                            {/* Past Goals Section */}
                            {pastGoals.length > 0 && (
                                <Box>
                                    <Button 
                                        variant="ghost" 
                                        width="full" 
                                        onClick={() => setShowPast(!showPast)}
                                        justifyContent="space-between"
                                        mb={4}
                                    >
                                        <Text>Starsze cele ({pastGoals.length})</Text>
                                        {showPast ? <ChevronUp /> : <ChevronDown />}
                                    </Button>
                                    {showPast && (
                                        <Stack gap={6}>
                                            {pastGoals.map(goal => renderGoalCard(goal, false))}
                                        </Stack>
                                    )}
                                </Box>
                            )}

                            {/* Future Goals Section */}
                            {futureGoals.length > 0 && (
                                <Box>
                                    <Button 
                                        variant="ghost" 
                                        width="full" 
                                        onClick={() => setShowFuture(!showFuture)}
                                        justifyContent="space-between"
                                        mb={4}
                                    >
                                        <Text>Nadchodzące cele ({futureGoals.length})</Text>
                                        {showFuture ? <ChevronUp /> : <ChevronDown />}
                                    </Button>
                                    {showFuture && (
                                        <Stack gap={6}>
                                            {futureGoals.map(goal => renderGoalCard(goal, false))}
                                        </Stack>
                                    )}
                                </Box>
                            )}
                        </VStack>

                        <Box mt={10}>
                            <Heading size="lg" mb={6}>Ostatnie zmiany</Heading>
                            <Stack gap={6}>
                                {[
                                    {
                                        id: 1,
                                        user: "Jan Kowalski",
                                        avatar: "https://bit.ly/dan-abramov",
                                        action: "zrealizował cel: Przebiec 10km",
                                        time: "2 godz. temu",
                                        image: "https://images.unsplash.com/photo-1452626038306-3a29120ddabd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
                                        likes: 5,
                                        liked: true
                                    },
                                    {
                                        id: 2,
                                        user: "Anna Nowak",
                                        avatar: "https://bit.ly/code-beast",
                                        action: "zrealizował cel: Strzelić 5 bramek",
                                        time: "5 godz. temu",
                                        image: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
                                        likes: 12,
                                        liked: false
                                    }
                                ].map((item) => {
                                    const PARTICIPANTS_COUNT = 17
                                    const REQUIRED_LIKES = Math.ceil(PARTICIPANTS_COUNT * 0.51)
                                    const isVerified = item.likes >= REQUIRED_LIKES
                                    
                                    return (
                                        <Card.Root key={item.id} variant="elevated" bg={{ base: "whiteAlpha.800", _dark: "whiteAlpha.100" }} backdropFilter="blur(10px)">
                                            <Card.Body>
                                                <HStack mb={4} gap={3}>
                                                    <Avatar.Root>
                                                        <Avatar.Image src={item.avatar} />
                                                        <Avatar.Fallback name={item.user} />
                                                    </Avatar.Root>
                                                    <Box>
                                                        <Text fontWeight="bold">{item.user}</Text>
                                                        <Text fontSize="sm" color="gray.500">{item.action} • {item.time}</Text>
                                                    </Box>
                                                </HStack>
                                                
                                                <Box borderRadius="md" overflow="hidden" mb={4}>
                                                    <img src={item.image} alt="Proof" style={{ width: "100%", height: "300px", objectFit: "cover" }} />
                                                </Box>

                                                <Flex justify="space-between" align="center">
                                                    <HStack gap={4}>
                                                        <Button variant="ghost" size="sm" colorPalette={item.liked ? "red" : "gray"}>
                                                            <Heart fill={item.liked ? "currentColor" : "none"} /> {item.likes}
                                                        </Button>
                                                    </HStack>
                                                    
                                                    {isVerified ? (
                                                        <Badge colorPalette="green" variant="solid">
                                                            <CheckCircle2 size={12} style={{ marginRight: "4px" }} /> Zatwierdzone
                                                        </Badge>
                                                    ) : (
                                                        <Text fontSize="xs" color="gray.500">
                                                            Wymagane {REQUIRED_LIKES} głosów ({item.likes}/{REQUIRED_LIKES})
                                                        </Text>
                                                    )}
                                                </Flex>
                                            </Card.Body>
                                        </Card.Root>
                                    )
                                })}
                            </Stack>
                        </Box>
                    </GridItem>

                    {/* Right Column: Users */}
                    <GridItem>
                        <Box
                            p={6}
                            borderRadius="xl"
                            bg={{ base: "whiteAlpha.500", _dark: "whiteAlpha.100" }}
                            backdropFilter="blur(10px)"
                            position="sticky"
                            top="20px"
                            borderWidth="1px"
                            borderColor="whiteAlpha.200"
                        >
                            <HStack mb={6} gap={2}>
                                <Users size={20} />
                                <Heading size="md">Uczestnicy</Heading>
                            </HStack>
                            
                            <Stack gap={4}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <HStack key={i} gap={3}>
                                        <Avatar.Root size="sm">
                                            <Avatar.Fallback name={`User ${i}`} />
                                            <Avatar.Image src={`https://i.pravatar.cc/150?u=${i}`} />
                                        </Avatar.Root>
                                        <Box>
                                            <Text fontWeight="medium" fontSize="sm">Użytkownik {i}</Text>
                                            <Text fontSize="xs" color="gray.500">Członek</Text>
                                        </Box>
                                    </HStack>
                                ))}
                                <Separator />
                                <Text fontSize="sm" color="gray.500" textAlign="center">
                                    + 12 innych
                                </Text>
                            </Stack>
                        </Box>
                    </GridItem>
                </Grid>
            </Container>
            <Footer />
        </>
    )
}