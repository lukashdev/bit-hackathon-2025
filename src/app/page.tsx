import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Box, Flex } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box as="main" flex="1">
        {/* Main content goes here */}
      </Box>
      <Footer />
    </Flex>
  );
}
