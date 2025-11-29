import { Box, Container, HStack} from "@chakra-ui/react";

export function Footer(){
    return (
        <Box w={"100%"} boxShadow="md" top={"0"} bg={"gray"} zIndex={10}>
            <Container paddingLeft={"15px"} paddingRight={"15px"} w={"100%"}>
                <HStack justifyContent="space-around" alignItems="center">
                    <Box>
                        Światłowody Makajlera © 2025 . Wszelkie prawa zastrzeżone.
                    </Box>
                </HStack>
            </Container>
        </Box>
    );
}