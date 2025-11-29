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
  Link as ChakraLink,
  Card
} from "@chakra-ui/react";
import { useRadar } from "@/hooks/use-api";
import NextLink from "next/link";
import { Header } from "@/components/Header/Header";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function RadarPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const router = useRouter();
  
  // Only fetch radar data if we have a session (though the redirect will handle non-session users)
  const { data: users, isLoading: isRadarLoading, isError } = useRadar();

  useEffect(() => {
    if (!isSessionPending && !session) {
      router.push("/login");
    }
  }, [session, isSessionPending, router]);

  if (isSessionPending || (!session && !isSessionPending)) {
     return (
        <>
        <Header />
        <Container maxW="8xl" py={10}>
            <Flex justify="center" align="center" minH="50vh">
            <Spinner size="xl" />
            </Flex>
        </Container>
        </>
    );
  }

  if (isRadarLoading) {
    return (
      <Container maxW="container.xl" py={10}>
        <Header />
        <Flex justify="center" align="center" minH="50vh">
          <Spinner size="xl" />
        </Flex>
      </Container>
    );
  }

  if (isError) {
     return (
      <Container maxW="8xl" py={10}>
        <Header />
        <Flex justify="center" align="center" minH="50vh">
          <Text color="red.500">Failed to load radar data.</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <>
    <Header />
    <Container maxW="8xl" py={10}  padding={"30px 15px"} as={"main"} minW={"calc(100vh - 74px)"}>
        <Box borderRadius={"0.5rem"} h="100%" padding="15px" bg="gray">
            <Heading as="h1" size="xl" textAlign="center">
                Radar Aktywności
            </Heading>
            
            <Text textAlign="center" mb={10} color="gray.500">
                Znajdź osoby o podobnych zainteresowaniach. Im więcej wspólnych pasji, tym wyżej na liście!
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                {users?.map((user) => (
                    <Card.Root key={user.id} variant="elevated" _hover={{ transform: "translateY(-2px)", transition: "0.2s" }}>
                        <Card.Body>
                            <Flex direction="column" align="center" gap={4}>
                                <Box position="relative">
                                    <Avatar.Root size="2xl">
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
                                    <Heading size="md">{user.name}</Heading>
                                    <Text fontSize="sm" color="gray.500">
                                        {user.commonInterestsCount} wspólnych zainteresowań
                                    </Text>
                                </VStack>

                                <Flex wrap="wrap" gap={2} justify="center">
                                    {user.interests.map((interest, index) => (
                                        <Badge key={index} colorPalette="blue" variant="subtle">
                                            {interest}
                                        </Badge>
                                    ))}
                                </Flex>
                            </Flex>
                        </Card.Body>
                        <Card.Footer justifyContent="center">
                            <ChakraLink asChild colorPalette="teal">
                                <NextLink href={`/users/${user.id}`}>
                                    Zobacz Profil
                                </NextLink>
                            </ChakraLink>
                        </Card.Footer>
                    </Card.Root>
                ))}
            </SimpleGrid>

            {users?.length === 0 && (
                <Text textAlign="center" color="gray.500" mt={10}>
                    Nie znaleziono osób o podobnych zainteresowaniach. Dodaj więcej zainteresowań do swojego profilu!
                </Text>
            )}
        </Box>
    </Container></>
  );
}
