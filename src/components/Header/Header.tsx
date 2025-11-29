import { Box, Button, Container, HStack, Link } from "@chakra-ui/react";


export function Header(){
    return (
        <Box w={"100%"} boxShadow="md" top={"0"} bg={"gray"} zIndex={10} h={"50px"}>
            <Container paddingLeft={"15px"} paddingRight={"15px"} w={"100%"} h={"100%"}>
                <HStack justifyContent="space-between" alignItems="center" h={"100%"}>
                <Box>
                    {/* Logo */}
                    Logo
                </Box>
                <HStack gap={"30px"}>
                    <Box>
                        {/* zaloguj */}
                    <Link href="/login"><Button h={"25px"}>Zaloguj</Button></Link>
                    </Box>
                    <Box>
                    {/* zarejestruj */}
                    <Link href="/register"><Button h={"25px"}>Zarejestruj</Button></Link>
                    </Box>
                </HStack>
                </HStack>
            </Container>
        </Box>
    );
}