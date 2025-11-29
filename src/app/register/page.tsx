"use client"

import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { VStack, Field, Input, Container, Button, Text } from "@chakra-ui/react";
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
        <div>
            <Header />
            <Container maxW={"md"} padding={"100px"}>
                Register Page
                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack gap={"12px"} padding={"15px"} bg={"gray.100"} borderRadius={"0.5rem"} color="black">
                        <Field.Root invalid={!!errors.name}>
                            <Field.Label>Nazwa użytkownika</Field.Label>
                            <Input 
                                placeholder="Twoja nazwa użytkownika" 
                                type="text" 
                                {...register("name")} 
                            />
                            {errors.name && <Text color="red.500" fontSize="sm">{errors.name.message}</Text>}
                        </Field.Root>
                        <Field.Root invalid={!!errors.email}>
                            <Field.Label>Email</Field.Label>
                            <Input 
                                placeholder="me@example.com" 
                                type="email" 
                                {...register("email")} 
                            />
                            {errors.email && <Text color="red.500" fontSize="sm">{errors.email.message}</Text>}
                        </Field.Root>
                        <Field.Root invalid={!!errors.password}>
                            <Field.Label>Hasło</Field.Label>
                            <Input 
                                placeholder="" 
                                type="password" 
                                {...register("password")} 
                            />
                            {errors.password && <Text color="red.500" fontSize="sm">{errors.password.message}</Text>}
                        </Field.Root>
                        <Field.Root invalid={!!errors.confirmPassword}>
                            <Field.Label>Potwierdź hasło</Field.Label>
                            <Input 
                                placeholder="" 
                                type="password" 
                                {...register("confirmPassword")} 
                            />
                            {errors.confirmPassword && <Text color="red.500" fontSize="sm">{errors.confirmPassword.message}</Text>}
                        </Field.Root>
                        
                        <Button type="submit" alignSelf="flex-start" loading={isSubmitting}>
                            Zarejestruj się
                        </Button>
                    </VStack>
                </form>
            </Container>
            {/* <Footer></Footer> */}
        </div>
    );
}
