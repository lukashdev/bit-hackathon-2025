import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Box, Container, Heading, Text, Stack, List } from "@chakra-ui/react";

export default function Privacy() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" py={10}>
        <Container maxW="container.lg">
            <Stack gap={8}>
                <Heading as="h1" size="2xl" textAlign="center" mb={8}>
                    Polityka Prywatności
                </Heading>

                <Stack gap={4}>
                    <Heading as="h2" size="lg">1. Postanowienia ogólne</Heading>
                    <Text>
                        Niniejsza polityka prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem z serwisu GlowUp Together.
                    </Text>
                </Stack>

                <Stack gap={4}>
                    <Heading as="h2" size="lg">2. Administrator Danych</Heading>
                    <Text>
                        Administratorem danych osobowych zawartych w serwisie jest GlowUp Together z siedzibą w [Adres Firmy].
                    </Text>
                </Stack>

                <Stack gap={4}>
                    <Heading as="h2" size="lg">3. Zakres zbieranych danych</Heading>
                    <Text>
                        W celu świadczenia usług zbieramy następujące dane:
                    </Text>
                    <List.Root ps={5}>
                        <List.Item>Adres e-mail</List.Item>
                        <List.Item>Imię i nazwisko / Nazwa użytkownika</List.Item>
                        <List.Item>Dane dotyczące aktywności w aplikacji</List.Item>
                    </List.Root>
                </Stack>

                <Stack gap={4}>
                    <Heading as="h2" size="lg">4. Cel przetwarzania danych</Heading>
                    <Text>
                        Dane przetwarzane są w celu:
                    </Text>
                    <List.Root ps={5}>
                        <List.Item>Umożliwienia logowania i korzystania z serwisu</List.Item>
                        <List.Item>Kontaktu z Użytkownikiem</List.Item>
                        <List.Item>Przesyłania powiadomień systemowych</List.Item>
                    </List.Root>
                </Stack>

                <Stack gap={4}>
                    <Heading as="h2" size="lg">5. Prawa użytkownika</Heading>
                    <Text>
                        Użytkownik ma prawo do wglądu w swoje dane, ich edycji oraz żądania ich usunięcia. W tym celu należy skontaktować się z administratorem.
                    </Text>
                </Stack>

                <Stack gap={4}>
                    <Heading as="h2" size="lg">6. Kontakt</Heading>
                    <Text>
                        W razie pytań dotyczących ochrony prywatności, prosimy o kontakt pod adresem: kontakt@glowuptogether.pl
                    </Text>
                </Stack>
            </Stack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}