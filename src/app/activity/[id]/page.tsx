"use client"
import { Header } from "@/components/Header/Header"
import { Footer } from "@/components/Footer/Footer"
import { Container, Box, Heading, HStack, VStack, Flex, Text, Card, Badge, Separator, Grid, GridItem, Avatar, Stack, Button, Spinner, IconButton, Input, Textarea } from "@chakra-ui/react"
import { Calendar, CheckCircle2, Users, Clock, Upload, Heart, ChevronDown, ChevronUp, Lock, Edit2, Save, X, UserPlus, Shield, ShieldCheck, UserMinus, Check, XCircle, Sparkles } from "lucide-react"
import { DialogRoot, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogActionTrigger, DialogCloseTrigger } from "@/components/ui/dialog"
import { FileUploadRoot, FileUploadDropzone, FileUploadList } from "@/components/ui/file-upload"
import Link from "next/link"
import { useState, useEffect, use } from "react"
import { toaster } from "@/components/ui/toaster"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Popover } from "@chakra-ui/react"

import { Skeleton } from "@/components/ui/skeleton"

interface User {
    id: string
    name: string
    image: string | null
    email?: string
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
    progress: any[]
}

interface Activity {
    id: number
    name: string
    description: string
    goals: Goal[]
    participants: { userId: string, role: string, user: User }[]
    interests: { id: number, name: string }[]
}

interface JoinRequest {
    id: number
    user: User
    createdAt: string
}

interface Invitation {
    id: number
    receiver: User
    createdAt: string
}

export default function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [activity, setActivity] = useState<Activity | null>(null)
    const [loading, setLoading] = useState(true)
    const [showPast, setShowPast] = useState(false)
    const [showFuture, setShowFuture] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState<{
        name: string;
        description: string;
        goals: Partial<Goal>[];
    }>({ name: "", description: "", goals: [] })
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviting, setInviting] = useState(false)
    const [deleteConfirmName, setDeleteConfirmName] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    
    const [joinStatus, setJoinStatus] = useState<"NONE" | "PENDING" | "MEMBER">("NONE")
    const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
    const [invitations, setInvitations] = useState<Invitation[]>([])

    const { data: session } = authClient.useSession()
    const router = useRouter()

    const fetchActivity = async () => {
        try {
            const res = await fetch(`/api/activities/${id}`)
            if (!res.ok) throw new Error("Failed to fetch activity")
            const data = await res.json()
            setActivity(data)
            setEditForm({ 
                name: data.name, 
                description: data.description || "",
                goals: data.goals.map((g: any) => ({
                    id: g.id,
                    title: g.title,
                    description: g.description,
                    startDate: g.startDate,
                    endDate: g.endDate
                }))
            })
        } catch (error) {
            console.error(error)
            toaster.create({ title: "Błąd", description: "Nie udało się pobrać aktywności", type: "error" })
        } finally {
            setLoading(false)
        }
    }

    const checkJoinStatus = async () => {
        try {
            const res = await fetch(`/api/activities/${id}/join/status`)
            const data = await res.json()
            setJoinStatus(data.status)
        } catch (e) { console.error(e) }
    }

    const fetchRequests = async () => {
        try {
            const res = await fetch(`/api/activities/${id}/requests`)
            if (res.ok) setJoinRequests(await res.json())
        } catch (e) { console.error(e) }
    }

    const fetchInvitations = async () => {
        try {
            const res = await fetch(`/api/activities/${id}/invitations`)
            if (res.ok) setInvitations(await res.json())
        } catch (e) { console.error(e) }
    }

    useEffect(() => {
        fetchActivity()
        checkJoinStatus()
    }, [id])

    const isOwner = activity?.participants.some(p => p.userId === session?.user?.id && p.role === "OWNER")
    const isAdmin = activity?.participants.some(p => p.userId === session?.user?.id && ["OWNER", "ADMIN"].includes(p.role))

    useEffect(() => {
        if (isAdmin) {
            fetchRequests()
            fetchInvitations()
        }
    }, [isAdmin, id])

    const handleUpload = async (goalId: number) => {
        if (!selectedFile) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("goalId", goalId.toString())
            formData.append("file", selectedFile)

            const res = await fetch("/api/proofs", {
                method: "POST",
                body: formData
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Upload failed")
            }

            toaster.create({ title: "Sukces", description: "Dowód został wysłany", type: "success" })
            fetchActivity() // Refresh data
            setSelectedFile(null)
        } catch (error: any) {
            console.error(error)
            toaster.create({ title: "Błąd", description: error.message, type: "error" })
        } finally {
            setUploading(false)
        }
    }

    const handleLike = async (proofId: number) => {
        try {
            const res = await fetch(`/api/proofs/${proofId}/like`, { method: "POST" })
            if (!res.ok) throw new Error("Failed to like")
            fetchActivity() // Refresh to show new like count
        } catch (error) {
            console.error(error)
        }
    }

    const handleUpdateActivity = async () => {
        try {
            const res = await fetch(`/api/activities/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm) 
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Failed to update")
            }
            
            toaster.create({ title: "Sukces", description: "Zaktualizowano aktywność", type: "success" })
            setIsEditing(false)
            fetchActivity()
        } catch (error: any) {
            console.error(error)
            toaster.create({ title: "Błąd", description: error.message, type: "error" })
        }
    }

    const handleInvite = async () => {
        if (!inviteEmail) return
        setInviting(true)
        try {
            const res = await fetch(`/api/activities/${id}/invite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: inviteEmail })
            })
            
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Failed to invite")
            }

            toaster.create({ title: "Sukces", description: "Wysłano zaproszenie", type: "success" })
            setInviteEmail("")
            fetchInvitations()
        } catch (error: any) {
            console.error(error)
            toaster.create({ title: "Błąd", description: error.message, type: "error" })
        } finally {
            setInviting(false)
        }
    }

    const handlePromote = async (userId: string) => {
        try {
            const res = await fetch(`/api/activities/${id}/members/${userId}/role`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: "ADMIN" })
            })
            if (!res.ok) throw new Error("Failed to promote")
            toaster.create({ title: "Sukces", description: "Użytkownik został administratorem", type: "success" })
            fetchActivity()
        } catch (error) {
            console.error(error)
            toaster.create({ title: "Błąd", description: "Nie udało się zmienić roli", type: "error" })
        }
    }

    const handleJoin = async () => {
        try {
            const res = await fetch(`/api/activities/${id}/join`, { method: "POST" })
            if (!res.ok) throw new Error("Failed to join")
            setJoinStatus("PENDING")
            toaster.create({ title: "Sukces", description: "Wysłano prośbę o dołączenie", type: "success" })
        } catch (e) {
            toaster.create({ title: "Błąd", description: "Nie udało się wysłać prośby", type: "error" })
        }
    }

    const handleLeave = async () => {
        if (!confirm("Czy na pewno chcesz opuścić tę aktywność?")) return
        try {
            const res = await fetch(`/api/activities/${id}/leave`, { method: "DELETE" })
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Failed to leave")
            }
            toaster.create({ title: "Sukces", description: "Opuszczono aktywność", type: "success" })
            router.push("/profile")
        } catch (error: any) {
            toaster.create({ title: "Błąd", description: error.message, type: "error" })
        }
    }

    const handleDeleteActivity = async () => {
        try {
            const res = await fetch(`/api/activities/${id}`, { method: "DELETE" })
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Failed to delete")
            }
            toaster.create({ title: "Sukces", description: "Usunięto aktywność", type: "success" })
            router.push("/profile")
        } catch (error: any) {
            toaster.create({ title: "Błąd", description: error.message, type: "error" })
        }
    }

    const handleRespondRequest = async (requestId: number, action: "APPROVE" | "REJECT") => {
        try {
            await fetch(`/api/activities/${id}/requests/${requestId}/respond`, {
                method: "POST",
                body: JSON.stringify({ action })
            })
            fetchRequests()
            fetchActivity() 
            toaster.create({ title: "Sukces", description: action === "APPROVE" ? "Zatwierdzono" : "Odrzucono", type: "success" })
        } catch (e) {
            toaster.create({ title: "Błąd", description: "Wystąpił błąd", type: "error" })
        }
    }

    const handleCancelInvitation = async (invitationId: number) => {
        try {
            await fetch(`/api/invitations/${invitationId}`, { method: "DELETE" })
            fetchInvitations()
            toaster.create({ title: "Sukces", description: "Anulowano zaproszenie", type: "success" })
        } catch (e) {
            toaster.create({ title: "Błąd", description: "Wystąpił błąd", type: "error" })
        }
    }

    if (loading) return (
        <>
            <Header />
            <Container maxW="8xl" py={8} minH="calc(100vh - 74px)">
                <Box w="100%" p={8} borderRadius="xl" bg={{ base: "whiteAlpha.500", _dark: "whiteAlpha.100" }} mb={6} borderWidth="1px" borderColor="whiteAlpha.200">
                    <Flex justify="space-between" align="start" direction={{ base: "column", md: "row" }} gap={4}>
                        <Box flex={1}>
                            <Skeleton height="40px" width="300px" mb={2} />
                            <Skeleton height="20px" width="100%" mb={4} />
                            <Skeleton height="20px" width="80%" />
                        </Box>
                        <Skeleton height="40px" width="200px" />
                    </Flex>
                </Box>
                <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6}>
                    <GridItem>
                        <VStack gap={6} align="stretch">
                            <Skeleton height="30px" width="200px" />
                            <Skeleton height="200px" width="100%" />
                            <Skeleton height="200px" width="100%" />
                        </VStack>
                    </GridItem>
                    <GridItem>
                        <Skeleton height="300px" width="100%" />
                    </GridItem>
                </Grid>
            </Container>
            <Footer />
        </>
    )
    if (!activity) return <Container maxW="8xl" py={8}><Text>Nie znaleziono aktywności</Text></Container>

    const currentDate = new Date()
    const activeGoals = activity.goals.filter(g => new Date(g.startDate) <= currentDate && new Date(g.endDate) >= currentDate)
    const pastGoals = activity.goals.filter(g => new Date(g.endDate) < currentDate)
    const futureGoals = activity.goals.filter(g => new Date(g.startDate) > currentDate)

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pl-PL')
    const getDaysLeft = (dateStr: string) => Math.ceil((new Date(dateStr).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

    const allProofs = activity.goals.flatMap(g => g.proofs.map(p => ({ ...p, goalTitle: g.title }))).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const renderGoalCard = (goal: Goal, isActive: boolean) => {
        const userProof = goal.proofs.find(p => p.userId === session?.user?.id)
        const isCompleted = !!userProof

        return (
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
                        colorPalette={isCompleted ? "green" : (isActive ? "blue" : "gray")} 
                        variant="solid" 
                        size="lg"
                    >
                        {isCompleted ? (
                            <><CheckCircle2 size={14} style={{ marginRight: "4px" }} /> Zrealizowany</>
                        ) : (
                            isActive ? "Aktywny" : (new Date(goal.endDate) < currentDate ? "Zakończony" : "Nadchodzący")
                        )}
                    </Badge>
                </Flex>

                <Separator />

                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                    <HStack color="gray.500" fontSize="sm">
                        <Calendar size={16} />
                        <Text>{formatDate(goal.startDate)} - {formatDate(goal.endDate)}</Text>
                    </HStack>
                    {isActive && !isCompleted && (
                        <HStack color="gray.500" fontSize="sm">
                            <Clock size={16} />
                            <Text>Pozostało {getDaysLeft(goal.endDate)} dni</Text>
                        </HStack>
                    )}
                </Flex>

                <Box mt={4}>
                    {isActive && !isCompleted && joinStatus === "MEMBER" ? (
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
                                    <FileUploadRoot maxFiles={1} accept={["image/*"]} onFileChange={(e) => setSelectedFile(e.acceptedFiles[0])}>
                                        <FileUploadDropzone style={{ width: "100%" }} label="Przeciągnij i upuść zdjęcie tutaj" description="PNG, JPG do 5MB" />
                                        <FileUploadList showSize clearable />
                                    </FileUploadRoot>
                                </DialogBody>
                                <DialogFooter>
                                    <DialogActionTrigger asChild>
                                        <Button variant="outline">Anuluj</Button>
                                    </DialogActionTrigger>
                                    <Button colorPalette="blue" onClick={() => handleUpload(goal.id)} loading={uploading}>Wyślij zgłoszenie</Button>
                                </DialogFooter>
                                <DialogCloseTrigger />
                            </DialogContent>
                        </DialogRoot>
                    ) : (
                        <Button disabled variant="subtle" size="sm">
                            {isCompleted ? <><CheckCircle2 size={16} /> Wysłano dowód</> : <><Lock size={16} /> {joinStatus !== "MEMBER" ? "Dołącz aby wysłać" : (new Date(goal.endDate) < currentDate ? "Zakończono" : "Wkrótce")}</>}
                        </Button>
                    )}
                </Box>
            </Card.Body>
        </Card.Root>
    )}

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
                        <Box flex={1}>
                            {isEditing ? (
                                <Stack gap={6}>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="bold" mb={1}>Nazwa aktywności</Text>
                                        <Input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} fontSize="xl" fontWeight="bold" />
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="bold" mb={1}>Opis</Text>
                                        <Textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} />
                                    </Box>
                                    
                                    <Separator />
                                    
                                    <Box>
                                        <Heading size="md" mb={4}>Zarządzanie celami</Heading>
                                        <Stack gap={4}>
                                            {editForm.goals.map((goal, index) => {
                                                const isEnded = goal.endDate ? new Date(goal.endDate) < new Date() : false;
                                                return (
                                                    <Card.Root key={index} size="sm">
                                                        <Card.Body>
                                                            <Stack gap={2}>
                                                                <Flex justify="space-between" align="start">
                                                                    <Box flex={1}>
                                                                        <Input 
                                                                            size="sm" 
                                                                            value={goal.title} 
                                                                            onChange={(e) => {
                                                                                const newGoals = [...editForm.goals];
                                                                                newGoals[index] = { ...goal, title: e.target.value };
                                                                                setEditForm({...editForm, goals: newGoals});
                                                                            }}
                                                                            placeholder="Tytuł celu"
                                                                            mb={2}
                                                                        />
                                                                        <Textarea 
                                                                            size="sm" 
                                                                            value={goal.description || ""} 
                                                                            onChange={(e) => {
                                                                                const newGoals = [...editForm.goals];
                                                                                newGoals[index] = { ...goal, description: e.target.value };
                                                                                setEditForm({...editForm, goals: newGoals});
                                                                            }}
                                                                            placeholder="Opis"
                                                                        />
                                                                    </Box>
                                                                    <IconButton 
                                                                        aria-label="Usuń cel" 
                                                                        size="sm" 
                                                                        colorPalette="red" 
                                                                        variant="ghost"
                                                                        disabled={isEnded}
                                                                        title={isEnded ? "Nie można usunąć zakończonego celu" : "Usuń cel"}
                                                                        onClick={() => {
                                                                            const newGoals = [...editForm.goals];
                                                                            newGoals.splice(index, 1);
                                                                            setEditForm({...editForm, goals: newGoals});
                                                                        }}
                                                                        ml={2}
                                                                    >
                                                                        <X size={16} />
                                                                    </IconButton>
                                                                </Flex>
                                                                <HStack>
                                                                    <Input 
                                                                        type="date" 
                                                                        size="sm" 
                                                                        value={goal.startDate ? new Date(goal.startDate).toISOString().split('T')[0] : ""} 
                                                                        onChange={(e) => {
                                                                            const newGoals = [...editForm.goals];
                                                                            newGoals[index] = { ...goal, startDate: new Date(e.target.value).toISOString() };
                                                                            setEditForm({...editForm, goals: newGoals});
                                                                        }}
                                                                    />
                                                                    <Text>-</Text>
                                                                    <Input 
                                                                        type="date" 
                                                                        size="sm" 
                                                                        value={goal.endDate ? new Date(goal.endDate).toISOString().split('T')[0] : ""} 
                                                                        onChange={(e) => {
                                                                            const newGoals = [...editForm.goals];
                                                                            newGoals[index] = { ...goal, endDate: new Date(e.target.value).toISOString() };
                                                                            setEditForm({...editForm, goals: newGoals});
                                                                        }}
                                                                    />
                                                                </HStack>
                                                            </Stack>
                                                        </Card.Body>
                                                    </Card.Root>
                                                )
                                            })}
                                            
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => {
                                                    const newGoal = {
                                                        title: "Nowy cel",
                                                        description: "",
                                                        startDate: new Date().toISOString(),
                                                        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                                                    };
                                                    setEditForm({...editForm, goals: [...editForm.goals, newGoal]});
                                                }}
                                            >
                                                + Dodaj cel
                                            </Button>
                                        </Stack>
                                    </Box>

                                    <Separator />

                                    <HStack justify="space-between">
                                        <DialogRoot open={deleteDialogOpen} onOpenChange={(e) => setDeleteDialogOpen(e.open)}>
                                            <DialogTrigger asChild>
                                                <Button colorPalette="red" variant="outline" size="sm">Usuń aktywność</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Usuń aktywność</DialogTitle>
                                                </DialogHeader>
                                                <DialogBody>
                                                    <Text mb={4}>
                                                        Ta operacja jest nieodwracalna. Aby potwierdzić, wpisz nazwę aktywności: <strong>{activity.name}</strong>
                                                    </Text>
                                                    <Input 
                                                        placeholder="Nazwa aktywności" 
                                                        value={deleteConfirmName} 
                                                        onChange={(e) => setDeleteConfirmName(e.target.value)} 
                                                    />
                                                </DialogBody>
                                                <DialogFooter>
                                                    <DialogActionTrigger asChild>
                                                        <Button variant="outline">Anuluj</Button>
                                                    </DialogActionTrigger>
                                                    <Button 
                                                        colorPalette="red" 
                                                        onClick={handleDeleteActivity}
                                                        disabled={deleteConfirmName !== activity.name}
                                                    >
                                                        Usuń trwale
                                                    </Button>
                                                </DialogFooter>
                                                <DialogCloseTrigger />
                                            </DialogContent>
                                        </DialogRoot>

                                        <HStack>
                                            <Button size="sm" colorPalette="green" onClick={handleUpdateActivity}><Save size={16} /> Zapisz zmiany</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}><X size={16} /> Anuluj</Button>
                                        </HStack>
                                    </HStack>
                                </Stack>
                            ) : (
                                <>
                                    <HStack mb={2}>
                                        <Heading size="3xl">{activity.name}</Heading>
                                        {isOwner && (
                                            <IconButton aria-label="Edytuj" size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                                                <Edit2 size={16} />
                                            </IconButton>
                                        )}
                                    </HStack>
                                    <Text fontSize="lg" color="gray.500">
                                        {activity.description}
                                    </Text>
                                    {activity.interests && activity.interests.length > 0 && (
                                        <Box mt={4}>
                                            <HStack gap={1} mb={2} color="purple.400">
                                                <Sparkles size={14} />
                                                <Text fontSize="xs" fontWeight="medium">Kategorie dobrane przez AI</Text>
                                            </HStack>
                                            <HStack gap={2} wrap="wrap">
                                                {activity.interests.map((interest) => (
                                                    <Badge 
                                                        key={interest.id} 
                                                        variant="surface"
                                                        bg="brand.background"
                                                        color="brand.highlight"
                                                        borderColor="brand.borderColor"
                                                        borderWidth="1px"
                                                    >
                                                        {interest.name}
                                                    </Badge>
                                                ))}
                                            </HStack>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                        <HStack>
                            {joinStatus === "NONE" && (
                                <Button colorPalette="green" onClick={handleJoin}>
                                    <UserPlus size={16} /> Dołącz do aktywności
                                </Button>
                            )}
                            {joinStatus === "PENDING" && (
                                <Button disabled colorPalette="gray">
                                    <Clock size={16} /> Oczekiwanie na akceptację
                                </Button>
                            )}
                            {joinStatus === "MEMBER" && (
                                <>
                                    <Button asChild colorPalette="blue" variant="outline">
                                        <Link href={`/activity/${activity.id}/progress`}>
                                            Moje postępy
                                        </Link>
                                    </Button>
                                    {!isOwner && (
                                        <Button colorPalette="red" variant="ghost" onClick={handleLeave}>
                                            <UserMinus size={16} /> Opuść
                                        </Button>
                                    )}
                                </>
                            )}
                        </HStack>
                    </Flex>
                </Box>

                <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6}>
                    {/* Left Column: Goals */}
                    <GridItem>
                        <VStack gap={6} align="stretch">
                            <Heading size="xl">Cele aktywności</Heading>
                            
                            {/* Active Goals */}
                            {activeGoals.length > 0 ? activeGoals.map(goal => renderGoalCard(goal, true)) : <Text color="gray.500">Brak aktywnych celów.</Text>}

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
                                {allProofs.map((proof) => {
                                    const PARTICIPANTS_COUNT = activity.participants.length
                                    const REQUIRED_LIKES = Math.ceil(PARTICIPANTS_COUNT * 0.50)
                                    const likesCount = proof.likes.length
                                    const isVerified = likesCount >= REQUIRED_LIKES
                                    const isLikedByMe = proof.likes.some(l => l.userId === session?.user?.id)
                                    const isMyProof = proof.userId === session?.user?.id
                                    
                                    return (
                                        <Card.Root key={proof.id} variant="elevated" bg={{ base: "whiteAlpha.800", _dark: "whiteAlpha.100" }} backdropFilter="blur(10px)">
                                            <Card.Body>
                                                <HStack mb={4} gap={3}>
                                                    <Link href={`/activity/${activity.id}/progress?userId=${proof.userId}`}>
                                                        <Avatar.Root cursor="pointer" _hover={{ opacity: 0.8 }}>
                                                            <Avatar.Image src={proof.user.image || undefined} />
                                                            <Avatar.Fallback name={proof.user.name} />
                                                        </Avatar.Root>
                                                    </Link>
                                                    <Box>
                                                        <Link href={`/activity/${activity.id}/progress?userId=${proof.userId}`}>
                                                            <Text fontWeight="bold" _hover={{ textDecoration: "underline" }}>{proof.user.name}</Text>
                                                        </Link>
                                                        <Text fontSize="sm" color="gray.500">zrealizował cel: {proof.goalTitle} • {new Date(proof.createdAt).toLocaleString()}</Text>
                                                    </Box>
                                                </HStack>
                                                
                                                <Box borderRadius="md" overflow="hidden" mb={4}>
                                                    <img src={`/api/proofs/${proof.id}/image`} alt="Proof" style={{ width: "100%", maxHeight: "400px", objectFit: "contain", backgroundColor: "#000" }} />
                                                </Box>

                                                <Flex justify="space-between" align="center">
                                                    <HStack gap={4}>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            colorPalette={isLikedByMe ? "red" : "gray"}
                                                            onClick={() => handleLike(proof.id)}
                                                            disabled={isMyProof}
                                                            title={isMyProof ? "Nie możesz polubić własnego dowodu" : ""}
                                                        >
                                                            <Heart fill={isLikedByMe ? "currentColor" : "none"} /> {likesCount}
                                                        </Button>
                                                    </HStack>
                                                    
                                                    {isVerified ? (
                                                        <Badge colorPalette="green" variant="solid">
                                                            <CheckCircle2 size={12} style={{ marginRight: "4px" }} /> Zatwierdzone
                                                        </Badge>
                                                    ) : (
                                                        <Text fontSize="xs" color="gray.500">
                                                            Wymagane {REQUIRED_LIKES} głosów ({likesCount}/{REQUIRED_LIKES})
                                                        </Text>
                                                    )}
                                                </Flex>
                                            </Card.Body>
                                        </Card.Root>
                                    )
                                })}
                                {allProofs.length === 0 && <Text color="gray.500">Brak aktywności.</Text>}
                            </Stack>
                        </Box>
                    </GridItem>

                    {/* Right Column: Users */}
                    <GridItem>
                        <Stack gap={6}>
                            {/* Join Requests (Admin Only) */}
                            {isAdmin && joinRequests.length > 0 && (
                                <Box
                                    p={6}
                                    borderRadius="xl"
                                    bg={{ base: "whiteAlpha.500", _dark: "whiteAlpha.100" }}
                                    backdropFilter="blur(10px)"
                                    borderWidth="1px"
                                    borderColor="orange.200"
                                >
                                    <HStack mb={4} gap={2}>
                                        <UserPlus size={20} color="orange" />
                                        <Heading size="md">Prośby o dołączenie ({joinRequests.length})</Heading>
                                    </HStack>
                                    <Stack gap={4}>
                                        {joinRequests.map((req) => (
                                            <HStack key={req.id} justify="space-between">
                                                <HStack>
                                                    <Avatar.Root size="sm">
                                                        <Avatar.Fallback name={req.user.name} />
                                                        <Avatar.Image src={req.user.image || undefined} />
                                                    </Avatar.Root>
                                                    <Text fontSize="sm" fontWeight="medium">{req.user.name}</Text>
                                                </HStack>
                                                <HStack gap={1}>
                                                    <IconButton size="xs" colorPalette="green" variant="ghost" onClick={() => handleRespondRequest(req.id, "APPROVE")}>
                                                        <Check size={16} />
                                                    </IconButton>
                                                    <IconButton size="xs" colorPalette="red" variant="ghost" onClick={() => handleRespondRequest(req.id, "REJECT")}>
                                                        <X size={16} />
                                                    </IconButton>
                                                </HStack>
                                            </HStack>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {/* Sent Invitations (Admin Only) */}
                            {isAdmin && invitations.length > 0 && (
                                <Box
                                    p={6}
                                    borderRadius="xl"
                                    bg={{ base: "whiteAlpha.500", _dark: "whiteAlpha.100" }}
                                    backdropFilter="blur(10px)"
                                    borderWidth="1px"
                                    borderColor="blue.200"
                                >
                                    <HStack mb={4} gap={2}>
                                        <Clock size={20} color="blue" />
                                        <Heading size="md">Wysłane zaproszenia ({invitations.length})</Heading>
                                    </HStack>
                                    <Stack gap={4}>
                                        {invitations.map((inv) => (
                                            <HStack key={inv.id} justify="space-between">
                                                <HStack>
                                                    <Avatar.Root size="sm">
                                                        <Avatar.Fallback name={inv.receiver.name} />
                                                        <Avatar.Image src={inv.receiver.image || undefined} />
                                                    </Avatar.Root>
                                                    <Box>
                                                        <Text fontSize="sm" fontWeight="medium">{inv.receiver.name}</Text>
                                                        <Text fontSize="xs" color="gray.500">{inv.receiver.email}</Text>
                                                    </Box>
                                                </HStack>
                                                <IconButton size="xs" colorPalette="red" variant="ghost" onClick={() => handleCancelInvitation(inv.id)} title="Anuluj zaproszenie">
                                                    <XCircle size={16} />
                                                </IconButton>
                                            </HStack>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            <Box
                                p={6}
                                borderRadius="xl"
                                bg={{ base: "whiteAlpha.500", _dark: "whiteAlpha.100" }}
                                backdropFilter="blur(10px)"
                                borderWidth="1px"
                                borderColor="whiteAlpha.200"
                            >
                                <HStack mb={6} gap={2} justify="space-between">
                                    <HStack>
                                        <Users size={20} />
                                        <Heading size="md">Uczestnicy ({activity.participants.length})</Heading>
                                    </HStack>
                                    {isAdmin && (
                                        <Popover.Root positioning={{ placement: "bottom-end" }}>
                                            <Popover.Trigger asChild>
                                                <Button size="xs" variant="ghost"><UserPlus size={16} /></Button>
                                            </Popover.Trigger>
                                            <Popover.Positioner>
                                                <Popover.Content width="300px">
                                                    <Popover.Arrow />
                                                    <Popover.Body>
                                                        <Heading size="sm" mb={2}>Zaproś użytkownika</Heading>
                                                        <HStack>
                                                            <Input placeholder="Email" size="sm" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                                                            <Button size="sm" onClick={handleInvite} loading={inviting}>Wyślij</Button>
                                                        </HStack>
                                                    </Popover.Body>
                                                </Popover.Content>
                                            </Popover.Positioner>
                                        </Popover.Root>
                                    )}
                                </HStack>
                                
                                <Stack gap={4}>
                                    {activity.participants.map((p) => (
                                        <HStack key={p.userId} gap={3} justify="space-between">
                                            <HStack>
                                                <Avatar.Root size="sm">
                                                    <Avatar.Fallback name={p.user.name} />
                                                    <Avatar.Image src={p.user.image || undefined} />
                                                </Avatar.Root>
                                                <Box>
                                                    <Text fontWeight="medium" fontSize="sm">{p.user.name}</Text>
                                                    <Text fontSize="xs" color="gray.500">
                                                        {p.role === "OWNER" ? "Organizator" : (p.role === "ADMIN" ? "Administrator" : "Członek")}
                                                    </Text>
                                                </Box>
                                            </HStack>
                                            {isOwner && p.role === "MEMBER" && (
                                                <Button size="xs" variant="ghost" title="Mianuj administratorem" onClick={() => handlePromote(p.userId)}>
                                                    <Shield size={14} />
                                                </Button>
                                            )}
                                            {p.role === "ADMIN" && <ShieldCheck size={14} color="green" />}
                                        </HStack>
                                    ))}
                                </Stack>
                            </Box>
                        </Stack>
                    </GridItem>
                </Grid>
            </Container>
            <Footer />
        </>
    )

}
