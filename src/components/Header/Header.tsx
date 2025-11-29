"use client"
import { Box, Button, Container, HStack, Link, Text } from "@chakra-ui/react";
import { useSession, signOut } from "../../lib/auth-client";
import { useRouter } from "next/navigation";

export function Header(){
    const session = useSession();
    const router = useRouter()

    const signOutHandler = () => {
        signOut();
        router.push("/");
    }
    
    return (
        <Box w={"100%"} boxShadow="md" top={"0"} bg={"gray"} zIndex={10} h={"50px"}>
            <Container paddingLeft={"15px"} paddingRight={"15px"} w={"100%"} h={"100%"}>
                <HStack justifyContent="space-between" alignItems="center" h={"100%"}>
                <Box>
                    {/* Logo */}
                    Logo
                </Box>
                <HStack gap={"30px"}>
                    {session.data ? (
                        <HStack>
                            <Text>{session.data.user.name}</Text>
                            <Button h={"25px"} onClick={signOutHandler}>Wyloguj</Button>
                        </HStack>
                    ) : (
                        <>
                            <Box>
                                <Link href="/login"><Button h={"25px"}>Zaloguj</Button></Link>
                            </Box>
                            <Box>
                                <Link href="/register"><Button h={"25px"}>Zarejestruj</Button></Link>
                            </Box>
                        </>
                    )}
                </HStack>
                </HStack>
            </Container>
        </Box>
    );
}