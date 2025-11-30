"use client"
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Field } from "@/components/ui/field";
import { Container, Box, Input, Textarea, Heading, Button, Flex, Stack, IconButton, Text } from "@chakra-ui/react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus, Sparkles, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";

const goalSchema = z.object({
  title: z.string().min(1, "Tytuł celu jest wymagany"),
  description: z.string().optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Nieprawidłowa data"),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Nieprawidłowa data"),
}).refine((data) => {
    if (!data.startDate || !data.endDate) return true;
    return new Date(data.startDate) <= new Date(data.endDate);
}, {
  message: "Data zakończenia musi być późniejsza niż data rozpoczęcia",
  path: ["endDate"],
});

const activitySchema = z.object({
  name: z.string().min(1, "Nazwa aktywności jest wymagana"),
  description: z.string().optional(),
  goals: z.array(goalSchema).optional(),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

export default function AddActivity() {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: "",
      description: "",
      goals: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "goals",
  });

  const handleGenerateDescription = async () => {
    const name = getValues("name");
    if (!name) {
        toaster.create({ title: "Błąd", description: "Wpisz nazwę aktywności, aby wygenerować opis.", type: "error" });
        return;
    }
    
    setGenerating(true);
    try {
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                prompt: `Napisz bardzo krótki i zwięzły opis (max 1-2 zdania) dla aktywności o nazwie: "${name}". Opis ma motywować do działania. Język polski.` 
            })
        });
        
        if (!response.ok) throw new Error("Failed to generate");
        
        const data = await response.json();
        setValue("description", data.response);
        toaster.create({ title: "Sukces", description: "Opis został wygenerowany.", type: "success" });
    } catch (error) {
        console.error(error);
        toaster.create({ title: "Błąd", description: "Nie udało się wygenerować opisu.", type: "error" });
    } finally {
        setGenerating(false);
    }
  };

  const onSubmit = async (data: ActivityFormValues) => {
    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create activity");
      }

      toaster.create({
        title: "Sukces",
        description: "Aktywność została utworzona pomyślnie.",
        type: "success",
      });

      const dataJson = await response.json();
      router.push(`/activity/${dataJson.id}`);
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Błąd",
        description: "Wystąpił błąd podczas tworzenia aktywności.",
        type: "error",
      });
    }
  };

  return (
    <>
      <Header />
      <Container
        maxW={"8xl"}
        padding={"30px 15px"}
        as={"main"}
        minH={"calc(100vh - 74px)"}
      >
        <Box
          w="100%"
          p={8}
          border="brand"
          borderRadius="xl"
          bg="brand.glassBg"
          backdropFilter="blur(5px)"
          mb={10}
        >
          <Heading size={"3xl"} mb={6}>
            Kreator aktywności
          </Heading>
          <Box>
            Wyznacz jasny cel i obierz konkretny kierunek działania. Cel musi być
            jasny i jednoznaczny. Mierz wysoko i przekraczaj własne granice.
          </Box>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex gap={8} direction={{ base: "column", lg: "row" }} align="start">
            {/* Activity Form */}
            <Box
              flex={1}
              w="100%"
              p={8}
              border="brand"
              borderRadius="xl"
              bg="brand.glassBg"
              backdropFilter="blur(5px)"
            >
              <Stack gap={4}>
                <Heading size="lg" mb={4}>Dane aktywności</Heading>
                <Field label="Nazwa aktywności" invalid={!!errors.name} errorText={errors.name?.message}>
                  <Input
                    placeholder="Piłka nożna"
                    variant="outline"
                    borderColor="brand.borderColor"
                    _focus={{ borderColor: "brand.accent", outline: "none" }}
                    {...register("name")}
                  />
                </Field>
                <Field label={
                    <Flex align="center" gap={2}>
                        Opis aktywności
                        <Button 
                            size="xs" 
                            variant="ghost" 
                            colorPalette="purple" 
                            loading={generating} 
                            onClick={handleGenerateDescription}
                            title="Wygeneruj opis za pomocą AI"
                        >
                            <Sparkles size={14} /> Generuj z AI
                        </Button>
                    </Flex>
                } invalid={!!errors.description} errorText={errors.description?.message}>
                  <Textarea
                    h="150px"
                    placeholder="Opis aktywności..."
                    variant="outline"
                    borderColor="brand.borderColor"
                    _focus={{ borderColor: "brand.accent", outline: "none" }}
                    {...register("description")}
                  />
                </Field>
                
                <Box p={3} bg="blue.50" borderRadius="md" fontSize="sm" color="blue.600" _dark={{ bg: "blue.900/30", color: "blue.200" }}>
                    <Flex gap={2} align="start">
                        <Box mt={0.5}><Info size={16} /></Box>
                        <Text>
                            Zainteresowania dla tej aktywności zostaną dobrane automatycznie przez AI na podstawie Twojego profilu, tytułu oraz opisu aktywności.
                        </Text>
                    </Flex>
                </Box>
              </Stack>
            </Box>

            {/* Goals Form */}
            <Box
              flex={1}
              w="100%"
              p={8}
              border="brand"
              borderRadius="xl"
              bg="brand.glassBg"
              backdropFilter="blur(5px)"
            >
              <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg">Zaplanuj cele</Heading>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => append({ title: "", description: "", startDate: "", endDate: "" })}
                >
                  <Plus /> Dodaj cel
                </Button>
              </Flex>

              <Stack gap={6}>
                {fields.map((field, index) => (
                  <Box
                    key={field.id}
                    p={4}
                    borderWidth="1px"
                    borderColor="brand.borderColor"
                    borderRadius="md"
                    position="relative"
                  >
                    <Flex justify="space-between" mb={4}>
                        <Heading size="sm">Cel #{index + 1}</Heading>
                        <IconButton
                            aria-label="Usuń cel"
                            size="xs"
                            colorPalette="red"
                            variant="ghost"
                            onClick={() => remove(index)}
                        >
                            <Trash2 />
                        </IconButton>
                    </Flex>
                    
                    <Stack gap={4}>
                      <Field
                        label="Tytuł celu"
                        invalid={!!errors.goals?.[index]?.title}
                        errorText={errors.goals?.[index]?.title?.message}
                      >
                        <Input
                          placeholder="Np. Przebiec 10km"
                          {...register(`goals.${index}.title`)}
                        />
                      </Field>

                      <Field
                        label="Opis celu"
                        invalid={!!errors.goals?.[index]?.description}
                        errorText={errors.goals?.[index]?.description?.message}
                      >
                        <Textarea
                          placeholder="Szczegóły celu..."
                          {...register(`goals.${index}.description`)}
                        />
                      </Field>

                      <Flex gap={4} direction={{ base: "column", md: "row" }}>
                        <Field
                          label="Data rozpoczęcia"
                          invalid={!!errors.goals?.[index]?.startDate}
                          errorText={errors.goals?.[index]?.startDate?.message}
                        >
                          <Input
                            type="date"
                            {...register(`goals.${index}.startDate`)}
                          />
                        </Field>

                        <Field
                          label="Data zakończenia"
                          invalid={!!errors.goals?.[index]?.endDate}
                          errorText={errors.goals?.[index]?.endDate?.message}
                        >
                          <Input
                            type="date"
                            {...register(`goals.${index}.endDate`)}
                          />
                        </Field>
                      </Flex>
                    </Stack>
                  </Box>
                ))}
                
                {fields.length === 0 && (
                    <Box textAlign="center" color="brand.content" py={8}>
                        Brak zdefiniowanych celów. Kliknij &quot;Dodaj cel&quot;, aby rozpocząć.
                    </Box>
                )}
              </Stack>
            </Box>
          </Flex>
          
          <Box mt={8} textAlign="right">
             <Button
                type="submit"
                size="xl"
                bg="brand.accent"
                color="brand.buttonText"
                _hover={{ bg: "brand.accent2" }}
                px={10}
                loading={isSubmitting}
              >
                Zapisz aktywność i cele
              </Button>
          </Box>
        </form>
      </Container>
      <Footer />
    </>
  );
}