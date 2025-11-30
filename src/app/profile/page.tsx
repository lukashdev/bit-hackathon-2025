"use client"

import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import {
  VStack,
  Container,
  Box,
  HStack,
  Stack,
  Heading,
  Image,
  Tag,
  Card,
  Separator,
  DataList,
  Text,
  Icon,
  Button,
  Spinner,
  Center,
  SimpleGrid
} from "@chakra-ui/react";
import { LuClock, LuMail, LuPlus } from "react-icons/lu";
import { useProfile, useActivities } from "@/hooks/use-api";
import Link from "next/link";

export default function Profile() {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: activities, isLoading: isActivitiesLoading } = useActivities();

  const cardStyles = {
    bg: "brand.glassBg",
    backdropFilter: "blur(5px)",
    border: "brand",
    borderRadius: "xl",
    boxShadow: "none",
  };

  if (isProfileLoading || isActivitiesLoading) {
      return (
          <Center h="100vh">
              <Spinner size="xl" color="brand.accent" />
          </Center>
      )
  }

  if (!profile) return null;

  // Helper for time ago
  const timeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return `${diffInSeconds}s temu`;
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) return `${diffInMinutes}min temu`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h temu`;
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} dni temu`;
  }

  return (
    <>
      <Header />
      <Container
        maxW={"8xl"}
        padding={"30px 15px"}
        as={"main"}
        minH={"calc(100vh - 74px)"}
      >
        <HStack alignItems="flex-start" gap={6} wrap={{ base: "wrap", md: "nowrap" }}>
          {/* Lewa kolumna - Profil */}
          <Card.Root width={["100%", "100%", "400px"]} {...cardStyles} overflow={"hidden"}>
            <Card.Header>
              <HStack gap={4}>
                <Box
                  w="100px"
                  h="100px"
                  borderRadius="full"
                  overflow="hidden"
                  flexShrink={0}
                  borderWidth="2px"
                  borderColor="brand.accent"
                >
                  <Image
                    src={profile.image || `https://avatar.iran.liara.run/public?username=${profile.nick}`}
                    w="100%"
                    h="100%"
                    alt="Profile Picture"
                    objectFit="cover"
                  />
                </Box>
                <VStack align="flex-start" gap={0}>
                  <Heading size="2xl" color="brand.mainText">{profile.nick}</Heading>
                  <Text color="brand.content">Użytkownik Premium</Text>
                </VStack>
              </HStack>
            </Card.Header>
            <Card.Body gap={4}>
              <DataList.Root orientation="horizontal" divideY="1px">
                <DataList.Item>
                  <DataList.ItemLabel>
                    <HStack gap={2}>
                      <Icon fontSize="lg" color="brand.content">
                        <LuClock />
                      </Icon>
                      <Text color="brand.content">Ostatnio online</Text>
                    </HStack>
                  </DataList.ItemLabel>
                  <DataList.ItemValue color="brand.mainText">{timeAgo(profile.lastActivity)}</DataList.ItemValue>
                </DataList.Item>
                <DataList.Item pt={2}>
                  <DataList.ItemLabel>
                    <HStack gap={2}>
                      <Icon fontSize="lg" color="brand.content">
                        <LuMail />
                      </Icon>
                      <Text color="brand.content">E-mail</Text>
                    </HStack>
                  </DataList.ItemLabel>
                  <DataList.ItemValue color="brand.mainText" wordBreak="break-all">{profile.email}</DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>

              <Separator borderColor="brand.borderColor" />

              <SimpleGrid columns={2} gap={4} w="full">
                  <Box textAlign="center" p={3} bg="brand.glassBgInner" borderRadius="md">
                      <Text fontSize="2xl" fontWeight="bold" color="brand.accent">{profile.stats.completedTasks}</Text>
                      <Text fontSize="xs" color="brand.content" textTransform="uppercase" letterSpacing="wider">Zaliczone cele</Text>
                  </Box>
                  <Box textAlign="center" p={3} bg="brand.glassBgInner" borderRadius="md">
                      <Text fontSize="2xl" fontWeight="bold" color="brand.accent">{profile.stats.likesReceived}</Text>
                      <Text fontSize="xs" color="brand.content" textTransform="uppercase" letterSpacing="wider">Polubienia</Text>
                  </Box>
              </SimpleGrid>

              <Separator borderColor="brand.borderColor" />

              <Box>
                <Text fontWeight="semibold" mb={3} color="brand.mainText">
                  Zainteresowania <Link href="/interests" style={{ fontSize: '14px', marginLeft: '8px', color: '#3182CE' }}>(Edytuj)</Link>
                </Text>
                <HStack wrap="wrap" gap={2}>
                  {profile.interests.map((interest, index) => (
                      <Tag.Root key={index} size="lg" colorPalette="blue" variant="solid">
                        <Tag.Label>{interest}</Tag.Label>
                      </Tag.Root>
                  ))}
                  {profile.interests.length === 0 && <Text color="brand.content">Brak zainteresowań</Text>}
                </HStack>
              </Box>
            </Card.Body>
          </Card.Root>

          {/* Prawa kolumna - Aktywności */}
          <VStack w="100%" gap={6}>
            
            {/* Bieżąca aktywność */}
            <Card.Root w="100%" {...cardStyles}>
              <Card.Header>
                <Heading size="lg" color="brand.mainText">Bieżąca aktywność</Heading>
              </Card.Header>
              <Card.Body>
                {profile.activeGoals && profile.activeGoals.length > 0 ? (
                    <Box
                      bg="brand.glassBgInner"
                      p={4}
                      borderRadius="md"
                      borderLeftWidth="4px"
                      borderLeftColor="yellow.500"
                    >
                      <Heading size="md" mb={1} color="brand.mainText">
                        {profile.activeGoals[0].title}
                      </Heading>
                      <Text color="brand.content">Status: W trakcie</Text>
                    </Box>
                ) : (
                    <Text color="brand.content">Brak bieżących aktywności</Text>
                )}
              </Card.Body>
            </Card.Root>

            {/* Aktywności do których należysz */}
            <Card.Root w="100%" {...cardStyles}>
              <Card.Header display="flex" justifyContent="space-between" alignItems="center">
                <Heading size="lg" color="brand.mainText">Aktywności do których należysz</Heading>
                <Link href="/activity/add">
                    <Button size="sm" variant="ghost" title="Utwórz nową aktywność">
                        <LuPlus /> Utwórz
                    </Button>
                </Link>
              </Card.Header>
              <Card.Body>
                <Stack gap={3}>
                  {activities && activities.length > 0 ? (
                      activities.map((activity) => {
                        const userRole = activity.participants?.find(p => p.userId === profile.id)?.role;
                        return (
                        <Link key={activity.id} href={`/activity/${activity.id}`}>
                          <Box
                            bg="brand.glassBgInner"
                            p={4}
                            borderRadius="md"
                            _hover={{ bg: "brand.glassBgInnerHover" }}
                            transition="background 0.2s"
                          >
                            <HStack justify="space-between" mb={1}>
                                <Heading size="md" color="brand.mainText">{activity.name}</Heading>
                                {userRole === 'OWNER' && (
                                    <Tag.Root colorPalette="purple" size="sm">
                                        <Tag.Label>Założyciel</Tag.Label>
                                    </Tag.Root>
                                )}
                                {userRole === 'ADMIN' && (
                                    <Tag.Root colorPalette="blue" size="sm">
                                        <Tag.Label>Admin</Tag.Label>
                                    </Tag.Root>
                                )}
                            </HStack>
                            <Text fontSize="sm" color="brand.content">
                              {activity.goals ? `${activity.goals.length} celów` : "Brak celów"}
                            </Text>
                          </Box>
                        </Link>
                      )})
                  ) : (
                      <Text color="brand.content">Nie należysz do żadnych aktywności</Text>
                  )}
                </Stack>
              </Card.Body>
            </Card.Root>
          </VStack>
        </HStack>
      </Container>
      <Footer />
    </>
  );
}
