import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import fastifyMultipart from "@fastify/multipart";
import path from "node:path";
import fs from "node:fs";
import { pipeline } from "node:stream";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25,
    },
  });

  app.post("/video", async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: "File missing" });
    }

    const extension = path.extname(data.filename);

    if (extension !== ".mp3") {
      return reply
        .status(400)
        .send({ error: "Invalid input type, file should be MP3." });
    }

    const fileBasename = path.basename(data.filename, extension);

    const fileUploadName = `${fileBasename}-${randomUUID()}${extension}`;

    const uploadDestination = path.resolve("./tmp", fileUploadName);

    await pump(data.file, fs.createWriteStream(uploadDestination));

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination
      }
    })

    return {
      video
    }
  });
}
