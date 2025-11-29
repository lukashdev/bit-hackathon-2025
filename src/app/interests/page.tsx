"use client"

import { ActivityModels } from "@/components/ActivityModel/ActivityModel";
import { Header } from "@/components/Header/Header";
import { Box, Container, Heading, VStack, Text } from "@chakra-ui/react";

export default function Page() {
    return (
        <Box minH="100vh" display="flex" flexDirection="column">
            <Header />
            <Container maxW="4xl" flex="1" display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={10}>
                <VStack gap={6} w="100%">
                    <VStack gap={2} textAlign="center">
                        <Heading size="xl" color="brand.mainText">
                            Wybierz swoje zainteresowania
                        </Heading>
                        <Text color="brand.mainText" fontSize="lg">
                            Zaznacz 5 przedmiotów, które najlepiej Cię opisują
                        </Text>
                    </VStack>
                    
                    <Box 
                        w="100%" 
                        h="600px"
                        border="brand" 
                        borderRadius="xl" 
                        bg="brand.glassBg"
                        backdropFilter="blur(5px)"
                        overflow="hidden"
                        position="relative"
                    >
                        <ActivityModels />
                    </Box>
                </VStack>
            </Container>
        </Box>
    )
}
