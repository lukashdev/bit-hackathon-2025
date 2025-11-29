"use client"

import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { VStack, Field, Input, Container, Button, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

const loginSchema = z.object({
    email: z.string().email("Nieprawidłowy adres email"),
    password: z.string().min(1, "Hasło jest wymagane"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
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
        <div>
            <Header />
            <Container maxW={"md"} padding={"100px"}>
                Login Page
                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack gap={"12px"} padding={"15px"} bg={"gray"} borderRadius={"0.5rem"} color="black">
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
                        
                        <Button type="submit" w={"100%"} loading={isSubmitting}>
                            Zaloguj się
                        </Button>
                    </VStack>
                </form>
            </Container>
            {/* <Footer></Footer> */}
        </div>
    );
}
