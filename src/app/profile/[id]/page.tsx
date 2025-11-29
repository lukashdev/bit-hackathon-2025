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
  Center
} from "@chakra-ui/react";
import { LuClock, LuMail } from "react-icons/lu";
import { useUserProfile, useActivities } from "@/hooks/use-api";
import { useParams } from "next/navigation";

export default function UserProfile() {
  const params = useParams();
  const userId = params.id as string;
  
  const { data: profile, isLoading: isProfileLoading } = useUserProfile(userId);
  const { data: activities, isLoading: isActivitiesLoading } = useActivities(userId);

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

  if (!profile) return (
      <Center h="100vh">
          <Text>Użytkownik nie znaleziony</Text>
      </Center>
  );

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
          <Card.Root width={["100%", "100%", "400px"]} {...cardStyles}>
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
                  <Text color="brand.content">Użytkownik</Text>
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
                  <DataList.ItemValue color="brand.mainText">{profile.email}</DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>

              <Separator borderColor="brand.borderColor" />

              <Box>
                <Text fontWeight="semibold" mb={3} color="brand.mainText">
                  Zainteresowania
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
              <Card.Header>
                <Heading size="lg" color="brand.mainText">Aktywności do których należysz</Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={3}>
                  {activities && activities.length > 0 ? (
                      activities.map((activity) => (
                          <Box
                            key={activity.id}
                            bg="brand.glassBgInner"
                            p={4}
                            borderRadius="md"
                            _hover={{ bg: "brand.glassBgInnerHover" }}
                            transition="background 0.2s"
                          >
                            <Heading size="md" color="brand.mainText">{activity.name}</Heading>
                            <Text fontSize="sm" color="brand.content">
                              {activity.goals ? `${activity.goals.length} celów` : "Brak celów"}
                            </Text>
                          </Box>
                      ))
                  ) : (
                      <Text color="brand.content">Nie należy do żadnych aktywności</Text>
                  )}
                </Stack>
              </Card.Body>
            </Card.Root>

            {/* Zakończone aktywności */}
            <Card.Root w="100%" {...cardStyles}>
              <Card.Header>
                <Heading size="lg" color="brand.mainText">Aktywności zakończone</Heading>
              </Card.Header>
              <Card.Body>
                {profile.lastCompletedGoal ? (
                    <>
                        <Box
                          bg="brand.glassBgInner"
                          p={4}
                          borderRadius="md"
                          borderLeftWidth="4px"
                          borderLeftColor="green.500"
                        >
                          <Heading size="md" mb={1} color="brand.mainText">
                            {profile.lastCompletedGoal.title}
                          </Heading>
                          <Text color="brand.content">Status: Zakończone</Text>
                        </Box>
                    </>
                ) : (
                    <Text color="brand.content">Brak zakończonych aktywności</Text>
                )}
              </Card.Body>
            </Card.Root>

          </VStack>
        </HStack>
      </Container>
      <Footer />
    </>
  );
}
