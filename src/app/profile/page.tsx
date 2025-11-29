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
} from "@chakra-ui/react";
import { LuClock, LuMail } from "react-icons/lu";

export default function Profile() {
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
          <Card.Root width={["100%", "100%", "400px"]} variant="elevated">
            <Card.Header>
              <HStack gap={4}>
                <Box
                  w="100px"
                  h="100px"
                  borderRadius="full"
                  overflow="hidden"
                  flexShrink={0}
                  borderWidth="2px"
                  borderColor="blue.500"
                >
                  <Image
                    src="/profilowe.jpg"
                    w="100%"
                    h="100%"
                    alt="Profile Picture"
                    objectFit="cover"
                  />
                </Box>
                <VStack align="flex-start" gap={0}>
                  <Heading size="2xl">Nick123321</Heading>
                  <Text color="fg.muted">Użytkownik Premium</Text>
                </VStack>
              </HStack>
            </Card.Header>
            <Card.Body gap={4}>
              <DataList.Root orientation="horizontal" divideY="1px">
                <DataList.Item>
                  <DataList.ItemLabel>
                    <HStack gap={2}>
                      <Icon fontSize="lg" color="gray.500">
                        <LuClock />
                      </Icon>
                      <Text>Ostatnio online</Text>
                    </HStack>
                  </DataList.ItemLabel>
                  <DataList.ItemValue>8h temu</DataList.ItemValue>
                </DataList.Item>
                <DataList.Item pt={2}>
                  <DataList.ItemLabel>
                    <HStack gap={2}>
                      <Icon fontSize="lg" color="gray.500">
                        <LuMail />
                      </Icon>
                      <Text>E-mail</Text>
                    </HStack>
                  </DataList.ItemLabel>
                  <DataList.ItemValue>testowymail@test.com</DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>

              <Separator />

              <Box>
                <Text fontWeight="semibold" mb={3}>
                  Zainteresowania
                </Text>
                <HStack wrap="wrap" gap={2}>
                  <Tag.Root size="lg" colorPalette="blue" variant="solid">
                    <Tag.Label>Siłownia</Tag.Label>
                  </Tag.Root>
                  <Tag.Root size="lg" colorPalette="green" variant="solid">
                    <Tag.Label>Bieganie</Tag.Label>
                  </Tag.Root>
                  <Tag.Root size="lg" colorPalette="red" variant="solid">
                    <Tag.Label>Piłka nożna</Tag.Label>
                  </Tag.Root>
                  <Tag.Root size="lg" colorPalette="pink" variant="solid">
                    <Tag.Label>Gitara</Tag.Label>
                  </Tag.Root>
                  <Tag.Root size="lg" colorPalette="yellow" variant="solid">
                    <Tag.Label>Pizza</Tag.Label>
                  </Tag.Root>
                </HStack>
              </Box>
            </Card.Body>
          </Card.Root>

          {/* Prawa kolumna - Aktywności */}

          {/* Bieżąca aktywność */}
          <VStack w="100%" gap={6}>
            <Card.Root w="100%" variant="outline">
              <Card.Header>
                <Heading size="lg">Bieżąca aktywność</Heading>
              </Card.Header>
              <Card.Body>
                <Box
                  bg="bg.subtle"
                  p={4}
                  borderRadius="md"
                  borderLeftWidth="4px"
                  borderLeftColor="yellow.500"
                >
                  <Heading size="md" mb={1}>
                    Bieganie
                  </Heading>
                  <Text color="fg.muted">Status: W trakcie</Text>
                </Box>
              </Card.Body>
            </Card.Root>

            {/* Aktywności do których należysz */}

            <Card.Root w="100%" variant="outline">
              <Card.Header>
                <Heading size="lg">Aktywności do których należysz</Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={3}>
                  <Box
                    bg="bg.subtle"
                    p={4}
                    borderRadius="md"
                    _hover={{ bg: "bg.muted" }}
                    transition="background 0.2s"
                  >
                    <Heading size="md">Siłownia</Heading>
                    <Text fontSize="sm" color="fg.muted">
                      3 treningi w tym tygodniu
                    </Text>
                  </Box>
                </Stack>
              </Card.Body>
            </Card.Root>

            {/* Zakończone aktywności */}

            <Card.Root w="100%" variant="outline">
              <Card.Header>
                <Heading size="lg">Aktywności zakończone</Heading>
              </Card.Header>
              <Card.Body>
                <Box
                  bg="bg.subtle"
                  p={4}
                  borderRadius="md"
                  borderLeftWidth="4px"
                  borderLeftColor="green.500"
                >
                  <Heading size="md" mb={1}>
                    Wspinaczka
                  </Heading>
                  <Text color="fg.muted">Status: Zakończone</Text>
                  <Text fontSize="sm" color="fg.muted" paddingTop={"10px"}>
                    Świetna robota. Teraz udokumentuj swoje osiągnięcie. Prześlij zdjęcie lub zrzut ekranu, aby partner mógł potwierdzić wykonanie zadania i odnotować Twój sukces.
                  </Text>
                </Box>
                <Button mt={3} colorScheme="green" size="sm" w="50%" margin="auto">Prześlij dowód</Button>
              </Card.Body>
            </Card.Root>


          </VStack>
        </HStack>
      </Container>
      <Footer />
    </>
  );
}
