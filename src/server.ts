import { PORT } from "./config/index.js";
import { connectToDatabase } from "./config/database.js";
import app from "./app.js";

const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1); // Exit the process with failure
    }
}

startServer().catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1); // Exit the process with failure
});