import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import {VStack, Container, Box, HStack, Stack, Heading} from "@chakra-ui/react";


export default function Profile() {
  return (
    <>
      <Header></Header>
      <Container maxW={"8xl"} padding={" 30px 15px"} as={"main"} minH={"calc(100vh - 74px)"}>   
        <Box padding={"15px"} bg={"gray"} borderRadius={"0.5rem"} h={"100%"}>
            <HStack alignItems="flex-start">
                <VStack w={["100%" ,"300px"]} alignItems={"flex-start"}>
                    <Box>
                        Zdjęcie Nick
                    </Box>
                    <Box>
                        Ostatnio online:
                    </Box>
                    <Box>
                        E-mail
                    </Box>
                    <Box paddingTop={"50px"}>
                        Wybrane zainteresowania:
                        <Box paddingTop={"15px"}>
                            <ul>
                                <li>Siłownia</li>
                                <li>Bieganie</li>
                                <li>Piłka nożna</li>
                            </ul>
                        </Box>
                    </Box>
                </VStack>
                <VStack minW={"600px"} w={"100%"}>
                    <VStack minW={"600px"} w={"100%"} className="bloczki-profilu" padding={"10px"}>
                        <Heading size="2xl" textAlign="left" w="100%">
                            Bieżąca aktywność
                        </Heading>
                        <Stack alignItems={"flex-start"} bg={"darkgray"} borderRadius={"10px"} minW={"500px"} w={"100%"} padding={"5px"}>
                            Bieganie
                        </Stack>
                    </VStack>
                    <VStack minW={"600px"} w={"100%"} className="bloczki-profilu" padding={"10px"}>
                        <Heading size="2xl" textAlign="left" w="100%">
                            Aktywności do których należysz
                        </Heading>
                        <Stack alignItems={"flex-start"} bg={"darkgray"} borderRadius={"10px"} minW={"500px"} w={"100%"} padding={"5px"}>
                            Siłownia
                        </Stack>
                    </VStack>
                </VStack>

            </HStack>
        </Box>
      </Container>
      <Footer></Footer>
    </>
  );
}
