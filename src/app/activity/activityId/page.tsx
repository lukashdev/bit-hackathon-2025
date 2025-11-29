"use client"
import { Header } from "@/components/Header/Header"
import { Footer } from "@/components/Footer/Footer"
import { Container, Box, Heading, HStack, VStack, Flex, Text, Card, Badge, Separator, Grid, GridItem, Progress, Avatar, Stack } from "@chakra-ui/react"
import { Calendar, CheckCircle2, Users, Clock } from "lucide-react"

export default function ActivityPage() {
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
                    <Heading size="3xl" mb={2}>
                        Piłka nożna
                    </Heading>
                    <Text fontSize="lg" color="gray.500">
                        Regularne treningi i mecze w każdy wtorek i czwartek.
                    </Text>
                </Box>

                <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6}>
                    {/* Left Column: Goals */}
                    <GridItem>
                        <VStack gap={6} align="stretch">
                            <Heading size="xl">Cele aktywności</Heading>
                            
                            {/* Goal 1 */}
                            <Card.Root 
                                variant="elevated" 
                                bg={{ base: "whiteAlpha.800", _dark: "whiteAlpha.100" }}
                                backdropFilter="blur(10px)"
                                border="none"
                                shadow="md"
                            >
                                <Card.Body gap={4}>
                                    <Flex justify="space-between" align="start" direction={{ base: "column", sm: "row" }} gap={4}>
                                        <Box>
                                            <Heading size="md" mb={2}>Przebiec 10km</Heading>
                                            <Text color="gray.500" mb={4}>
                                                Przygotowanie kondycyjne do sezonu. Celem jest przebiegnięcie 10km poniżej 50 minut.
                                            </Text>
                                        </Box>
                                        <Badge colorPalette="green" variant="solid" size="lg">
                                            <CheckCircle2 size={14} style={{ marginRight: "4px" }} /> Aktywny
                                        </Badge>
                                    </Flex>

                                    <Separator />

                                    <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                        <HStack color="gray.500" fontSize="sm">
                                            <Calendar size={16} />
                                            <Text>01.12.2025 - 31.12.2025</Text>
                                        </HStack>
                                        <HStack color="gray.500" fontSize="sm">
                                            <Clock size={16} />
                                            <Text>Pozostało 30 dni</Text>
                                        </HStack>
                                    </Flex>

                                    <Box mt={2}>
                                        <Flex justify="space-between" mb={2}>
                                            <Text fontSize="sm" fontWeight="medium">Postęp</Text>
                                            <Text fontSize="sm" fontWeight="bold">40%</Text>
                                        </Flex>
                                        <Progress.Root value={40} colorPalette="blue" size="sm">
                                            <Progress.Track>
                                                <Progress.Range />
                                            </Progress.Track>
                                        </Progress.Root>
                                    </Box>
                                </Card.Body>
                            </Card.Root>

                            {/* Goal 2 */}
                            <Card.Root 
                                variant="elevated" 
                                bg={{ base: "whiteAlpha.800", _dark: "whiteAlpha.100" }}
                                backdropFilter="blur(10px)"
                                border="none"
                                shadow="md"
                            >
                                <Card.Body gap={4}>
                                    <Flex justify="space-between" align="start" direction={{ base: "column", sm: "row" }} gap={4}>
                                        <Box>
                                            <Heading size="md" mb={2}>Strzelić 5 bramek</Heading>
                                            <Text color="gray.500" mb={4}>
                                                Poprawa skuteczności w ataku podczas meczów sparingowych.
                                            </Text>
                                        </Box>
                                        <Badge colorPalette="orange" variant="subtle" size="lg">
                                            W trakcie
                                        </Badge>
                                    </Flex>

                                    <Separator />

                                    <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                        <HStack color="gray.500" fontSize="sm">
                                            <Calendar size={16} />
                                            <Text>15.11.2025 - 15.12.2025</Text>
                                        </HStack>
                                    </Flex>

                                    <Box mt={2}>
                                        <Flex justify="space-between" mb={2}>
                                            <Text fontSize="sm" fontWeight="medium">Postęp</Text>
                                            <Text fontSize="sm" fontWeight="bold">2/5</Text>
                                        </Flex>
                                        <Progress.Root value={40} colorPalette="orange" size="sm">
                                            <Progress.Track>
                                                <Progress.Range />
                                            </Progress.Track>
                                        </Progress.Root>
                                    </Box>
                                </Card.Body>
                            </Card.Root>

                        </VStack>
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