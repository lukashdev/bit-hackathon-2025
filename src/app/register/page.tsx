import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import {VStack, Field, Input, Container, Button } from "@chakra-ui/react";


export default function Login() {
  return (
    <div>
      <Header></Header>
      <Container maxW={"md"} padding={"100px"}>   
        Register Page
        <VStack gap={"12px"} padding={"15px"} bg={"gray"} borderRadius={"0.5rem"}>
            <Field.Root>
                <Field.Root>
                    <Field.Label>Nazwa użytkownika</Field.Label>
                    <Input placeholder="Twoja nazwa użytkownika" type="text"/>
                </Field.Root>
                <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Input placeholder="me@example.com" type="email"/>
                </Field.Root>
                <Field.Root>
                    <Field.Label>Hasło</Field.Label>
                    <Input placeholder="" type="password"/>
                </Field.Root>
                <Field.Root>
                    <Field.Label>Potwierdź hasło</Field.Label>
                    <Input placeholder="" type="password"/>
                </Field.Root>
                <Button type="submit" alignSelf="flex-start">
                    Zarejestruj się
                </Button>
            </Field.Root>
        </VStack>
      </Container>
      {/* <Footer></Footer> */}
    </div>
  );
}
