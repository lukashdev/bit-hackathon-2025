"use client"
import { Header } from "@/components/Header/Header"
import { Footer } from "@/components/Footer/Footer"
import { Container, Box, Heading, HStack, VStack, Flex, Text, Card, Badge, Separator, Progress, Button, Circle } from "@chakra-ui/react"
import { Calendar, CheckCircle2, Clock, ArrowLeft, Check, Users, Trophy } from "lucide-react"
import Link from "next/link"

export default function ActivityProgressPage() {
    return (
        <>
            <Header />
            <Container maxW="8xl" py={8} minH="calc(100vh - 74px)">
                <Button asChild variant="ghost" mb={6} size="sm">
                    <Link href="/activity/1">
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
                    <Heading size="2xl" mb={2}>
                        Moje postępy
                    </Heading>
                    <Text fontSize="lg" color="gray.500">
                        Aktywność: Piłka nożna
                    </Text>
                    
                    <Box mt={6}>
                        <Flex justify="space-between" mb={2}>
                            <Text fontWeight="medium">Zaliczone cele</Text>
                            <Text fontWeight="bold">1 / 2</Text>
                        </Flex>
                        <Progress.Root value={50} colorPalette="green" size="lg" striped animated>
                            <Progress.Track>
                                <Progress.Range />
                            </Progress.Track>
                        </Progress.Root>
                    </Box>
                </Box>

                <VStack gap={6} align="stretch">
                    <Heading size="xl" mb={2}>Szczegóły celów</Heading>

                    {/* Completed Goal */}
                    <Card.Root 
                        variant="elevated" 
                        bg={{ base: "green.50", _dark: "whiteAlpha.50" }}
                        borderColor="green.200"
                        borderWidth="1px"
                    >
                        <Card.Body>
                            <Flex justify="space-between" align="start" gap={4} direction={{ base: "column", sm: "row" }}>
                                <Box>
                                    <HStack mb={2}>
                                        <Heading size="md">Przebiec 10km</Heading>
                                        <Badge colorPalette="green" variant="solid">Ukończono</Badge>
                                    </HStack>
                                    <Text color="gray.500">
                                        Zadanie wykonane pomyślnie. Gratulacje!
                                    </Text>
                                </Box>
                                <Box textAlign="right">
                                    <Text fontSize="sm" color="gray.500">Data ukończenia</Text>
                                    <Text fontWeight="medium">28.11.2025</Text>
                                </Box>
                            </Flex>
                            
                            <Separator my={4} borderColor="green.200" />
                            
                            <HStack color="green.600">
                                <CheckCircle2 size={20} />
                                <Text fontWeight="medium">Zatwierdzone przez społeczność (12/17 głosów)</Text>
                            </HStack>
                        </Card.Body>
                    </Card.Root>

                    {/* In Progress Goal */}
                    <Card.Root 
                        variant="elevated" 
                        bg={{ base: "whiteAlpha.800", _dark: "whiteAlpha.100" }}
                        backdropFilter="blur(10px)"
                    >
                        <Card.Body>
                            <Flex justify="space-between" align="start" gap={4} direction={{ base: "column", sm: "row" }}>
                                <Box>
                                    <HStack mb={2}>
                                        <Heading size="md">Strzelić 5 bramek</Heading>
                                        <Badge colorPalette="orange" variant="subtle">Weryfikacja</Badge>
                                    </HStack>
                                    <Text color="gray.500" mb={4}>
                                        Status: Oczekiwanie na weryfikację przez społeczność.
                                    </Text>
                                </Box>
                            </Flex>

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
                                        <Text fontSize="xs">Głosowanie (5/9)</Text>
                                    </VStack>
                                    <Separator flex={1} />
                                    <VStack align="center" gap={1}>
                                        <Circle size={8} bg="gray.200" color="gray.500"><Trophy size={16}/></Circle>
                                        <Text fontSize="xs">Zaliczono</Text>
                                    </VStack>
                                </HStack>
                            </Box>
                            
                            <Separator my={4} />
                            
                            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                <HStack color="gray.500" fontSize="sm">
                                    <Calendar size={16} />
                                    <Text>Termin: 15.12.2025</Text>
                                </HStack>
                                <HStack color="gray.500" fontSize="sm">
                                    <Clock size={16} />
                                    <Text>Pozostało 16 dni</Text>
                                </HStack>
                            </Flex>
                        </Card.Body>
                    </Card.Root>
                </VStack>

            </Container>
            <Footer />
        </>
    )
}
