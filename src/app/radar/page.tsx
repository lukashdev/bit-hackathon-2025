"use client"
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Button, Container, Heading, HStack, Box, Text, SimpleGrid, VStack, Circle, Image } from "@chakra-ui/react";
import Link from "next/link";
import { Target, Image as ImageIcon, Users, Activity, ScanLine, Radio, LucideIcon } from "lucide-react";


const StatCard = ({ icon: Icon, label, value, color }: { icon: LucideIcon, label: string, value: string, color: string }) => (
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
            <Text fontWeight="bold" fontSize="2xl">{value}</Text>
        </HStack>
        <Text fontSize="sm" color="gray.400">{label}</Text>
    </VStack>
)

export default function RadarPage() {
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
                                    Radar Aktywności
                                </Heading>
                                <Text color="gray.400" fontSize="lg">
                                    Uruchom skaner i zobacz osoby gotowe do działania. Algorytm pomaga znaleźć idealnego partnera do wspólnej realizacji celów.
                                </Text>
                            </Box>
                            
                            <Box py={8}>
                               <Image src="/radar.png" alt="Radar" mx="auto" className="radar" />
                            </Box>

                            <Button 
                                asChild 
                                size="xl" 
                                colorPalette="green" 
                                variant="solid"
                                className="group"
                            >
                                <Link href="/radar/activity">
                                    <ScanLine /> Rozpocznij skanowanie
                                </Link>
                            </Button>
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
                                value="1,248" 
                                color="blue.400" 
                            />
                            <StatCard 
                                icon={ImageIcon} 
                                label="Wstawionych Zdjęć" 
                                value="8,502" 
                                color="purple.400" 
                            />
                            <StatCard 
                                icon={Users} 
                                label="Aktywnych Użytkowników" 
                                value="342" 
                                color="orange.400" 
                            />
                            <StatCard 
                                icon={Activity} 
                                label="Dostępnych Aktywności" 
                                value="56" 
                                color="green.400" 
                            />
                        </SimpleGrid>
                    </Box>
                </HStack>
            </Container>
            <Footer />
        </>
    );
}