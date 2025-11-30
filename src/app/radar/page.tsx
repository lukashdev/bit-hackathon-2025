"use client"
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Button, Container, Heading, HStack, Box, Text, SimpleGrid, VStack, Circle, Image, Skeleton } from "@chakra-ui/react";
import Link from "next/link";
import { Target, Image as ImageIcon, Users, Activity, ScanLine, Radio, LucideIcon } from "lucide-react";
import { useStats } from "@/hooks/use-api";


const StatCard = ({ icon: Icon, label, value, color, loading }: { icon: LucideIcon, label: string, value: string | number, color: string, loading?: boolean }) => (
    <VStack 
        bg="whiteAlpha.100" 
        p={4} 
        borderRadius="lg" 
        align="start" 
        gap={1}
        transition="all 0.2s"
        _hover={{ bg: "whiteAlpha.200", transform: "translateY(-2px)" }}
    >
        <HStack color={color} mb={2}>
            <Icon size={20} />
            {loading ? <Skeleton height="32px" width="60px" /> : <Text fontWeight="bold" fontSize="2xl">{value}</Text>}
        </HStack>
        <Text fontSize="sm" color="gray.400">{label}</Text>
    </VStack>
)

export default function RadarPage() {
    const { data: stats, isLoading } = useStats();

    return (
        <> 
            <Header />
            <Container maxW="8xl" py={12} minH="calc(100vh - 74px)">
                <HStack 
                    mb={6} 
                    justify="space-between" 
                    align="center" 
                    gap={12} 
                    flexDirection={{ base: "column", lg: "row" }}
                >
                    {/* Left Column: Radar & Action */}
                    <Box w={{ base: "100%", lg: "50%" }} textAlign="center">
                        <VStack gap={8}>
                            <Box>
                                <Heading size="3xl" mb={2} bgGradient="to-r" gradientFrom="green.400" gradientTo="blue.500" bgClip="text">
                                    Radar
                                </Heading>
                                <Text color="gray.400" fontSize="lg">
                                    Uruchom skaner i znajdź to, czego szukasz. Algorytm pomaga znaleźć idealne aktywności oraz partnerów do wspólnej realizacji celów.
                                </Text>
                            </Box>
                            
                            <Box py={8}>
                               <Image src="/radar.png" alt="Radar" mx="auto" className="radar" />
                            </Box>

                            <HStack gap={4} wrap="wrap" justify="center">
                                <Button 
                                    asChild 
                                    size="xl" 
                                    colorPalette="green" 
                                    variant="solid"
                                    className="group"
                                >
                                    <Link href="/radar/activity">
                                        <Activity /> Radar Aktywności
                                    </Link>
                                </Button>
                                <Button 
                                    asChild 
                                    size="xl" 
                                    colorPalette="blue" 
                                    variant="solid"
                                    className="group"
                                >
                                    <Link href="/radar/users">
                                        <Users /> Radar Użytkowników
                                    </Link>
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>

                    {/* Right Column: Stats */}
                    <Box 
                        w={{ base: "100%", lg: "50%" }}
                        p={8}
                        borderRadius="2xl"
                        bg={{ base: "whiteAlpha.800", _dark: "whiteAlpha.100" }}
                        backdropFilter="blur(20px)"
                        borderWidth="1px"
                        borderColor="whiteAlpha.200"
                        shadow="xl"
                    >
                        <HStack mb={8} gap={3}>
                            <Radio className="animate-pulse" color="var(--chakra-colors-green-400)" />
                            <Heading size="lg">Statystyki Systemu</Heading>
                        </HStack>

                        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                            <StatCard 
                                icon={Target} 
                                label="Zrealizowanych Celów" 
                                value={stats?.completedGoals || 0} 
                                color="blue.400" 
                                loading={isLoading}
                            />
                            <StatCard 
                                icon={ImageIcon} 
                                label="Wstawionych Zdjęć" 
                                value={stats?.proofsCount || 0} 
                                color="purple.400" 
                                loading={isLoading}
                            />
                            <StatCard 
                                icon={Users} 
                                label="Aktywnych Użytkowników" 
                                value={stats?.usersCount || 0} 
                                color="orange.400" 
                                loading={isLoading}
                            />
                            <StatCard 
                                icon={Activity} 
                                label="Dostępnych Aktywności" 
                                value={stats?.activitiesCount || 0} 
                                color="green.400" 
                                loading={isLoading}
                            />
                        </SimpleGrid>
                    </Box>
                </HStack>
            </Container>
            <Footer />
        </>
    );
}