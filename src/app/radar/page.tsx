"use client";

import { useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Avatar,
  Badge,
  Spinner,
  SimpleGrid,
  Flex,
  Button
} from "@chakra-ui/react";
import { useRadar } from "@/hooks/use-api";
import NextLink from "next/link";
import { Header } from "@/components/Header/Header";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function RadarPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const router = useRouter();
  
  const { data: users, isLoading: isRadarLoading, isError } = useRadar();

  useEffect(() => {
    if (!isSessionPending && !session) {
      router.push("/login");
    }
  }, [session, isSessionPending, router]);

  if (isSessionPending || (!session && !isSessionPending)) {
     return (
        <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <Container maxW="container.xl" flex="1" py={10} display="flex" justifyContent="center" alignItems="center">
            <Spinner size="xl" color="brand.accent" />
        </Container>
        </Box>
    );
  }

  if (isRadarLoading) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <Container maxW="container.xl" flex="1" py={10} display="flex" justifyContent="center" alignItems="center">
          <Spinner size="xl" color="brand.accent" />
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
                        Znajdź osoby o podobnych zainteresowaniach. Im więcej wspólnych pasji, tym wyżej na liście!
                    </Text>
                </VStack>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
                    {users?.map((user) => (
                        <Box 
                            key={user.id} 
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
                        >


                            
                            <Flex direction="column" align="center" gap={4} mt={2}>
                                <Box position="relative">
                                    <Avatar.Root size="2xl" border="2px solid" borderColor="brand.accent">
                                        <Avatar.Fallback name={user.name} />
                                        <Avatar.Image src={user.image || undefined} />
                                    </Avatar.Root>
                                    {user.isOnline && (
                                        <Box
                                            position="absolute"
                                            bottom="2px"
                                            right="2px"
                                            w="16px"
                                            h="16px"
                                            bg="green.400"
                                            border="2px solid white"
                                            borderRadius="full"
                                            title="Online"
                                        />
                                    )}
                                </Box>
                                
                                <VStack gap={1}>
                                    <Heading size="md" color="brand.mainText" textAlign="center">{user.name}</Heading>
                                    <Text fontSize="sm" color="brand.content">
                                        {user.commonInterestsCount} wspólnych zainteresowań
                                    </Text>
                                </VStack>

                                <Flex wrap="wrap" gap={2} justify="center" flex="1">
                                    {user.interests.map((interest, index) => (
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
                                
                                <Button 
                                    asChild 
                                    width="full" 
                                    variant="outline" 
                                    borderColor="brand.accent" 
                                    color="brand.highlight"
                                    _hover={{ bg: "brand.accent", color: "white" }}
                                >
                                    <NextLink href={`/users/${user.id}`}>
                                        Zobacz Profil
                                    </NextLink>
                                </Button>
                            </Flex>
                        </Box>
                    ))}
                </SimpleGrid>

                {users?.length === 0 && (
                    <Flex direction="column" align="center" justify="center" py={20} gap={4}>
                        <Text textAlign="center" color="brand.content" fontSize="lg">
                            Nie znaleziono osób o podobnych zainteresowaniach.
                        </Text>
                        <Text color="brand.highlight">
                            Dodaj więcej zainteresowań do swojego profilu, aby znaleźć dopasowania!
                        </Text>
                    </Flex>
                )}
            </Box>
        </Container>
    </Box>
  );
}
