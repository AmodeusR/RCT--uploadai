import { fastify } from "fastify";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateAICompletionRoute } from "./routes/generate-ai-completion";
import { fastifyCors } from "@fastify/cors";

const app = fastify();
const port = 3333;
app.register(fastifyCors, {
  origin: "http://localhost:5173/"
})
const routes = [getAllPromptsRoute, uploadVideoRoute, createTranscriptionRoute, generateAICompletionRoute];

routes.forEach(route => {
  app.register(route);
})

app.listen({
  port
}).then(() => {
  console.log("Server running");
  console.log(`Access it at http://localhost:${port}`);
});