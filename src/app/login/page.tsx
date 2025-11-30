"use client"

import { Header } from "@/components/Header/Header";
import { VStack, Box, Input, Container, Button, Text, Heading, Stack, Collapsible } from "@chakra-ui/react";
import { Field } from "@/components/ui/field"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import { PasswordInput } from "@/components/ui/password-input"
import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Nieprawidłowy adres email"),
    password: z.string().min(1, "Hasło jest wymagane"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
    const router = useRouter();
    const [showDemo, setShowDemo] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        await signIn.email({
            email: data.email,
            password: data.password,
        }, {
            onSuccess: () => {
                toaster.create({
                    title: "Zalogowano pomyślnie",
                    type: "success",
                });
                router.push("/");
            },
            onError: (ctx) => {
                toaster.create({
                    title: "Błąd logowania",
                    description: ctx.error.message,
                    type: "error",
                });
            }
        });
    };

    return (
        <Box minH="100vh" display="flex" flexDirection="column">
            <Header />
            <Container maxW="md" flex="1" display="flex" alignItems="center" justifyContent="center" py={10}>
                <Box 
                    w="100%" 
                    p={8} 
                    border="brand" 
                    borderRadius="xl" 
                    bg="brand.glassBg"
                    backdropFilter="blur(5px)"
                >
                    <VStack gap={6} align="stretch">
                        <Heading textAlign="center" size="xl" color="brand.mainText">
                            Zaloguj się
                        </Heading>
                        
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <VStack gap={4}>
                                <Field label="Email" invalid={!!errors.email} errorText={errors.email?.message}>
                                    <Input 
                                        placeholder="twoj@email.com" 
                                        type="email" 
                                        variant="outline"
                                        borderColor="brand.borderColor"
                                        _focus={{ borderColor: "brand.accent", outline: "none" }}
                                        {...register("email")} 
                                    />
                                </Field>

                                <Field label="Hasło" invalid={!!errors.password} errorText={errors.password?.message}>
                                    <PasswordInput 
                                        placeholder="••••••••" 
                                        borderColor="brand.borderColor"
                                        _focus={{ borderColor: "brand.accent", outline: "none" }}
                                        {...register("password")} 
                                    />
                                </Field>
                                
                                <Button 
                                    type="submit" 
                                    w="100%" 
                                    loading={isSubmitting}
                                    bg="brand.accent"
                                    color="brand.buttonText"
                                    _hover={{ bg: "brand.accent2" }}
                                    mt={2}
                                >
                                    Zaloguj się
                                </Button>
                            </VStack>
                        </form>
                        
                        <Text fontSize="sm" textAlign="center" color="brand.mainText">
                            Nie masz jeszcze konta?{" "}
                                                            <Button 
                                                                variant="plain" 
                                                                color="brand.accent" 
                                                                onClick={() => router.push("/register")}
                                                                fontSize="sm"
                                                            >
                                                                Zarejestruj się
                                                            </Button>                        </Text>
                    </VStack>
                </Box>

                <Box w="100%" mt={6} textAlign="center">
                    <Collapsible.Root open={showDemo} onOpenChange={(e) => setShowDemo(e.open)}>
                        <Collapsible.Trigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                color="brand.muted"
                                gap={2}
                            >
                                Demo {showDemo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </Button>
                        </Collapsible.Trigger>
                        <Collapsible.Content>
                            <Box 
                                mt={4}
                                p={6} 
                                border="brand" 
                                borderRadius="xl" 
                                bg="brand.glassBg"
                                backdropFilter="blur(5px)"
                                textAlign="left"
                                animationName="fade-in"
                                animationDuration="0.2s"
                            >
                                <Heading size="sm" mb={4} color="brand.mainText" display="flex" alignItems="center" gap={2}>
                                    <Info size={16} /> Konta testowe
                                </Heading>
                                <Text fontSize="xs" color="brand.muted" mb={3}>Hasło dla wszystkich: <strong>password123</strong></Text>
                                <Stack gap={2}>
                                    {[
                                        "jan.kowalski@example.com",
                                        "anna.nowak@example.com",
                                        "piotr.wisniewski@example.com",
                                        "maria.wojcik@example.com"
                                    ].map(email => (
                                        <Button 
                                            key={email} 
                                            variant="outline" 
                                            size="sm" 
                                            justifyContent="flex-start"
                                            fontWeight="normal"
                                            onClick={() => {
                                                setValue("email", email);
                                                setValue("password", "password123");
                                            }}
                                        >
                                            {email}
                                        </Button>
                                    ))}
                                </Stack>
                            </Box>
                        </Collapsible.Content>
                    </Collapsible.Root>
                </Box>
            </Container>
        </Box>
    );
}
