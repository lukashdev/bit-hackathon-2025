"use client"

import { Header } from "@/components/Header/Header";
import { VStack, Box, Input, Container, Button, Text, Heading } from "@chakra-ui/react";
import { Field } from "@/components/ui/field"
import { PasswordInput } from "@/components/ui/password-input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

const registerSchema = z.object({
    name: z.string().min(2, "Nazwa musi mieć co najmniej 2 znaki"),
    email: z.string().email("Nieprawidłowy adres email"),
    password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być takie same",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        await signUp.email({
            email: data.email,
            password: data.password,
            name: data.name,
        }, {
            onSuccess: () => {
                toaster.create({
                    title: "Rejestracja udana",
                    description: "Możesz się teraz zalogować",
                    type: "success",
                });
                router.push("/login");
            },
            onError: (ctx) => {
                 toaster.create({
                    title: "Błąd rejestracji",
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
                            Zarejestruj się
                        </Heading>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <VStack gap={4}>
                                <Field label="Nazwa użytkownika" invalid={!!errors.name} errorText={errors.name?.message}>
                                    <Input 
                                        placeholder="Twoja nazwa użytkownika" 
                                        type="text" 
                                        variant="outline"
                                        borderColor="brand.borderColor"
                                        _focus={{ borderColor: "brand.accent", outline: "none" }}
                                        {...register("name")} 
                                    />
                                </Field>

                                <Field label="Email" invalid={!!errors.email} errorText={errors.email?.message}>
                                    <Input 
                                        placeholder="me@example.com" 
                                        type="email" 
                                        variant="outline"
                                        borderColor="brand.borderColor"
                                        _focus={{ borderColor: "brand.accent", outline: "none" }}
                                        {...register("email")} 
                                    />
                                </Field>

                                <Field label="Hasło" invalid={!!errors.password} errorText={errors.password?.message}>
                                    <PasswordInput
                                        placeholder="Hasło (min. 6 znaków)" 
                                        borderColor="brand.borderColor"
                                        _focus={{ borderColor: "brand.accent", outline: "none" }}
                                        {...register("password")} 
                                    />
                                </Field>

                                <Field label="Potwierdź hasło" invalid={!!errors.confirmPassword} errorText={errors.confirmPassword?.message}>
                                    <PasswordInput 
                                        placeholder="Powtórz hasło" 
                                        borderColor="brand.borderColor"
                                        _focus={{ borderColor: "brand.accent", outline: "none" }}
                                        {...register("confirmPassword")} 
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
                                    Zarejestruj się
                                </Button>
                            </VStack>
                        </form>
                         <Text fontSize="sm" textAlign="center" color="brand.mainText">
                            Masz już konto?{" "}
                            <Button 
                                variant="plain" 
                                color="brand.accent" 
                                onClick={() => router.push("/login")}
                                fontSize="sm"
                            >
                                Zaloguj się
                            </Button>
                        </Text>
                    </VStack>
                </Box>
            </Container>
        </Box>
    );
}
