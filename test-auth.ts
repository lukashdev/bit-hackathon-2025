
import { auth } from "./src/lib/auth";

async function main() {
    try {
        console.log("Attempting to create user...");
        const res = await auth.api.signUpEmail({
            body: {
                email: `test-${Date.now()}@example.com`,
                password: "password123",
                name: "Test User",
            }
        });
        console.log("User created:", res);
    } catch (e) {
        console.error("Error creating user:", e);
    }
}

main();
