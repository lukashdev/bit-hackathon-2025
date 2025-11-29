"use client"
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Field } from "@/components/ui/field";
import { Container, Box, Input, Textarea, Heading, Button, Flex, Stack, IconButton } from "@chakra-ui/react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import { useEffect, useState, Suspense } from "react";

const goalSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Tytu³ celu jest wymagany"),
  description: z.string().optional().nullable(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Nieprawid³owa data"),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Nieprawid³owa data"),
}).refine((data) => {
    if (!data.startDate || !data.endDate) return true;
    return new Date(data.startDate) <= new Date(data.endDate);
}, {
  message: "Data zakoñczenia musi byæ póŸniejsza ni¿ data rozpoczêcia",
  path: ["endDate"],
});

const activitySchema = z.object({
  name: z.string().min(1, "Nazwa aktywnoœci jest wymagana"),
  description: z.string().optional().nullable(),
  goals: z.array(goalSchema).optional(),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

function EditActivityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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

  useEffect(() => {
    if (!activityId) {
        toaster.create({
            title: "B³¹d",
            description: "Brak ID aktywnoœci.",
            type: "error",
        });
        setIsLoading(false);
        return;
    }

    const fetchActivity = async () => {
        try {
            const response = await fetch(\/api/activities/\\);
            if (!response.ok) {
                throw new Error("Failed to fetch activity");
            }
            const data = await response.json();
            
            // Format dates for input type="date"
            const formattedGoals = data.goals?.map((goal: any) => ({
                ...goal,
                startDate: goal.startDate ? new Date(goal.startDate).toISOString().split('T')[0] : "",
                endDate: goal.endDate ? new Date(goal.endDate).toISOString().split('T')[0] : "",
            })) || [];

            reset({
                name: data.name,
                description: data.description,
                goals: formattedGoals,
            });
        } catch (error) {
            console.error(error);
            toaster.create({
                title: "B³¹d",
                description: "Nie uda³o siê pobraæ danych aktywnoœci.",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    fetchActivity();
  }, [activityId, reset]);

  const onSubmit = async (data: ActivityFormValues) => {
    if (!activityId) return;

    try {
      const response = await fetch(\/api/activities/\\, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update activity");
      }

      toaster.create({
        title: "Sukces",
        description: "Aktywnoœæ zosta³a zaktualizowana pomyœlnie.",
        type: "success",
      });

      router.push("/profile"); // Redirect to profile or activity list
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "B³¹d",
        description: "Wyst¹pi³ b³¹d podczas aktualizacji aktywnoœci.",
        type: "error",
      });
    }
  };

  if (isLoading) {
      return <Container maxW={"8xl"} padding={"30px 15px"}><Box>£adowanie...</Box></Container>;
  }

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
          mb={3}
        >
          <Heading size={"3xl"} mb={6}>
            Edytor aktywnoœci
          </Heading>
          <Box>
            Zedytuj swoj¹ aktywnoœæ i cele poni¿ej.
          </Box>
        </Box>
        <Box
          w="100%"
          p={8}
          border="brand"
          borderRadius="xl"
          bg="brand.glassBg"
          backdropFilter="blur(5px)"
          mb={10}
        >
            Edytujesz obecnie aktywnoœæ &quot;Nazwa Aktywnoœci&quot;.
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
                <Heading size="lg" mb={4}>Dane aktywnoœci</Heading>
                <Field label="Nazwa aktywnoœci" invalid={!!errors.name} errorText={errors.name?.message}>
                  <Input
                    placeholder="Pi³ka no¿na"
                    variant="outline"
                    borderColor="brand.borderColor"
                    _focus={{ borderColor: "brand.accent", outline: "none" }}
                    {...register("name")}
                  />
                </Field>
                <Field label="Opis aktywnoœci" invalid={!!errors.description} errorText={errors.description?.message}>
                  <Textarea
                    h="150px"
                    placeholder="Opis aktywnoœci..."
                    variant="outline"
                    borderColor="brand.borderColor"
                    _focus={{ borderColor: "brand.accent", outline: "none" }}
                    {...register("description")}
                  />
                </Field>
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
                <Heading size="lg">Cele (Goals)</Heading>
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
                            aria-label="Usuñ cel"
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
                        label="Tytu³ celu"
                        invalid={!!errors.goals?.[index]?.title}
                        errorText={errors.goals?.[index]?.title?.message}
                      >
                        <Input
                          placeholder="Np. Przebiec 10km"
                          {...register(\goals.\.title\)}
                        />
                      </Field>

                      <Field
                        label="Opis celu"
                        invalid={!!errors.goals?.[index]?.description}
                        errorText={errors.goals?.[index]?.description?.message}
                      >
                        <Textarea
                          placeholder="Szczegó³y celu..."
                          {...register(\goals.\.description\)}
                        />
                      </Field>

                      <Flex gap={4} direction={{ base: "column", md: "row" }}>
                        <Field
                          label="Data rozpoczêcia"
                          invalid={!!errors.goals?.[index]?.startDate}
                          errorText={errors.goals?.[index]?.startDate?.message}
                        >
                          <Input
                            type="date"
                            {...register(\goals.\.startDate\)}
                          />
                        </Field>

                        <Field
                          label="Data zakoñczenia"
                          invalid={!!errors.goals?.[index]?.endDate}
                          errorText={errors.goals?.[index]?.endDate?.message}
                        >
                          <Input
                            type="date"
                            {...register(\goals.\.endDate\)}
                          />
                        </Field>
                      </Flex>
                    </Stack>
                  </Box>
                ))}
                
                {fields.length === 0 && (
                    <Box textAlign="center" color="brand.content" py={8}>
                        Brak zdefiniowanych celów. Kliknij &quot;Dodaj cel&quot;, aby rozpocz¹æ.
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
                Zapisz aktywnoœæ i cele
              </Button>
          </Box>
        </form>
      </Container>
      <Footer />
    </>
  );
}

export default function EditActivity() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditActivityContent />
        </Suspense>
    )
}
