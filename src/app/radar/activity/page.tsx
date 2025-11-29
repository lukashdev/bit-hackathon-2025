"use client";

import { useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Badge,
  Spinner,
  SimpleGrid,
  Flex,
  Button,
  Skeleton,
  Icon
} from "@chakra-ui/react";
import { useRadarActivity } from "@/hooks/use-api";
import NextLink from "next/link";
import { Header } from "@/components/Header/Header";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FaUsers } from "react-icons/fa";

export default function RadarActivityPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const router = useRouter();
  
  const { data: activities, isLoading: isRadarLoading, isError } = useRadarActivity();

  useEffect(() => {
    if (!isSessionPending && !session) {
      router.push("/login");
    }
  }, [session, isSessionPending, router]);

  if (!session && !isSessionPending) {
     return (
        <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <Container maxW="container.xl" flex="1" py={10} display="flex" justifyContent="center" alignItems="center">
            <Spinner size="xl" color="brand.accent" />
        </Container>
        </Box>
    );
  }

  if (isRadarLoading || isSessionPending) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="brand.background">
        <Header />
        <Container maxW="container.xl" py={10} flex="1">
            <Box 
                borderRadius="xl" 
                p={{ base: 4, md: 8 }}
                border="brand"
                bg={{ base: "whiteAlpha.500", _dark: "whiteAlpha.100" }}
                backdropFilter="blur(10px)"
            >
                <VStack gap={2} mb={10}>
                    <Heading as="h1" size="2xl" textAlign="center" color="brand.mainText">
                        Radar Aktywności
                    </Heading>
                    <Text textAlign="center" color="brand.content" maxW="2xl">
                        Znajdź aktywności pasujące do Twoich zainteresowań.
                    </Text>
                </VStack>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Box 
                            key={index} 
                            border="brand" 
                            borderRadius="lg" 
                            p={6}
                            bg={{ base: "white", _dark: "gray.800" }}
                        >
                            <Flex direction="column" align="center" gap={4} mt={2}>
                                <Skeleton height="24px" width="150px" />
                                <Skeleton height="16px" width="200px" />
                                <Flex wrap="wrap" gap={2} justify="center" w="full">
                                    <Skeleton height="24px" width="60px" borderRadius="full" />
                                    <Skeleton height="24px" width="80px" borderRadius="full" />
                                </Flex>
                                <Skeleton height="40px" width="full" borderRadius="md" />
                            </Flex>
                        </Box>
                    ))}
                </SimpleGrid>
            </Box>
        </Container>
      </Box>
    );
  }

  if (isError) {
     return (
      <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <Container maxW="container.xl" flex="1" py={10} display="flex" justifyContent="center" alignItems="center">
          <Text color="red.500">Nie udało się załadować danych radaru.</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="brand.background">
        <Header />
        <Container maxW="container.xl" py={10} flex="1">
            <Box 
                borderRadius="xl" 
                p={{ base: 4, md: 8 }}
                border="brand"
                bg={{ base: "whiteAlpha.500", _dark: "whiteAlpha.100" }}
                backdropFilter="blur(10px)"
            >
                <VStack gap={2} mb={10}>
                    <Heading as="h1" size="2xl" textAlign="center" color="brand.mainText">
                        Radar Aktywności
                    </Heading>
                    <Text textAlign="center" color="brand.content" maxW="2xl">
                        Znajdź aktywności pasujące do Twoich zainteresowań.
                    </Text>
                </VStack>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
                    {activities?.map((activity) => (
                        <Box 
                            key={activity.id} 
                            border="brand" 
                            borderRadius="lg" 
                            p={6}
                            bg={{ base: "white", _dark: "gray.800" }}
                            transition="all 0.2s"
                            _hover={{ 
                                transform: "translateY(-4px)", 
                                boxShadow: "lg",
                                borderColor: "brand.accent"
                            }}
                            position="relative"
                            overflow="hidden"
                            display="flex"
                            flexDirection="column"
                        >
                            <VStack gap={3} flex="1" align="center">
                                <Heading size="md" color="brand.mainText" textAlign="center">{activity.name}</Heading>
                                
                                {activity.description && (
                                    <Text fontSize="sm" color="brand.content" textAlign="center">
                                        {activity.description}
                                    </Text>
                                )}

                                <Flex align="center" gap={2} color="brand.content" fontSize="sm">
                                    <Icon as={FaUsers} />
                                    <Text>{activity.participantsCount} uczestników</Text>
                                </Flex>

                                <Text fontSize="xs" color="brand.accent" fontWeight="bold">
                                    {activity.commonInterestsCount} wspólnych kategorii
                                </Text>

                                <Flex wrap="wrap" gap={2} justify="center" flex="1">
                                    {activity.interests.map((interest, index) => (
                                        <Badge 
                                            key={index} 
                                            variant="surface"
                                            bg="brand.background"
                                            color="brand.highlight"
                                            borderColor="brand.borderColor"
                                            borderWidth="1px"
                                        >
                                            {interest}
                                        </Badge>
                                    ))}
                                </Flex>
                            </VStack>
                            
                            <Button 
                                mt={4}
                                width="full" 
                                variant="outline" 
                                borderColor="brand.accent" 
                                color="brand.highlight"
                                _hover={{ bg: "brand.accent", color: "white" }}
                                onClick={() => {
                                    // Placeholder for join action
                                    alert("Funkcja dołączania wkrótce!");
                                }}
                            >
                                Dołącz
                            </Button>
                        </Box>
                    ))}
                </SimpleGrid>

                {activities?.length === 0 && (
                    <Flex direction="column" align="center" justify="center" py={20} gap={4}>
                        <Text textAlign="center" color="brand.content" fontSize="lg">
                            Nie znaleziono aktywności pasujących do Twoich zainteresowań.
                        </Text>
                        <Text color="brand.highlight">
                            Spróbuj dodać więcej zainteresowań lub stwórz własną aktywność!
                        </Text>
                    </Flex>
                )}
            </Box>
        </Container>
    </Box>
  );
}
