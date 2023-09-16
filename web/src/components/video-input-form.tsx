import { FileVideo, Upload } from "lucide-react";
import { Button, Label, Separator, Textarea } from "./ui";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";

type Status = "waiting" | "converting" | "uploading" | "generating" | "success";
const statusMessage = {
  converting: "Convertendo...",
  uploading: "Subindo arquivo...",
  generating: "Transcrevendo...",
  success: "Completo!",
};

type VideoInputFormProps = {
  onVideoUploaded: React.Dispatch<React.SetStateAction<string | null>>;
}

const VideoInputForm = ({ onVideoUploaded }: VideoInputFormProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("waiting");
  const promptRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setStatus("waiting");
  }, [videoFile]);
  function handleFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const { files } = e.currentTarget;

    if (!files) return;

    const selectedFile = files[0];
    setVideoFile(selectedFile);
  }


  const previewURL = useMemo(() => {
    if (!videoFile) return null;

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  async function convertVideoToAudio(video: File) {
    console.log("Conversão iniciada");

    const ffmpeg = await getFFmpeg();
    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    ffmpeg.on("progress", ({ progress }) => {
      console.log(`Progresso de conversão: ${Math.round(progress * 100)}`);
    });

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    console.log("Conversão finalizada");

    return audioFile;
  }

  async function handleVideoUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!videoFile) return;

    const prompt = promptRef.current?.value;

    setStatus("converting");
    const audio = await convertVideoToAudio(videoFile);

    const data = new FormData();
    data.append("audio", audio);

    setStatus("uploading");

    const response = await api.post("/video", data);
    const videoId = response.data.video.id;
    
    setStatus("generating");
    
    await api.post(`./video/${videoId}/transcription`, { prompt });
    
    onVideoUploaded(videoId);
    setStatus("success");
  }

  return (
    <form className="space-y-6" onSubmit={handleVideoUpload}>
      <label
        htmlFor="video"
        className="flex flex-col gap-2 justify-center items-center text-sm text-muted-foreground border rounded-lg aspect-video hover:cursor-pointer hover:bg-primary/5 transition-colors"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none rounded-lg"
          />
        ) : (
          <>
            <FileVideo className="w-4 h-4" />
            Selecione um vídeo
          </>
        )}
      </label>
      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription">Prompt de transcrição</Label>
        <Textarea
          id="transcription"
          className="h-24 resize-none leading-relaxed"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula."
          ref={promptRef}
          disabled={status !== "waiting"}
        />
      </div>
      <Button
        type="submit"
        className="w-full data-[success=true]:bg-emerald-500"
        disabled={status !== "waiting"}
        data-success={status === "success"}
      >
        {status === "waiting" ? (
          <>
            Carregar vídeo
            <Upload className="w-4 h-4 ml-2" />
          </>
        ) : (
          statusMessage[status]
        )}
      </Button>
    </form>
  );
};

export { VideoInputForm };
