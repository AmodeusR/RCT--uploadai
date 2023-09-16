import { useState } from "react";
import { Github, Wand2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Button, Separator, Textarea, Label } from "./components/ui";
import { Slider } from "./components/ui/slider";
import { PromptSelect, VideoInputForm } from "./components";
import { useCompletion } from "ai/react";

function App() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [temperature, setTemperature] = useState(0.5);

  const { input, setInput, handleInputChange, handleSubmit, completion, isLoading } = useCompletion({
    api: "http://localhost:3333/ai/complete",
    body: {
      videoId,
      temperature
    },
    headers: {
      "Content-Type": "application/json"
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between px-6 py-3 border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Desenvolvidor por Amodeus R.
          </span>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline">
            <Github className="w-4 h-4 mr-1" />
            Github
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6 gap-6 flex">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none px-4 py-2 leading-relaxed"
              placeholder="Inclua o prompt para a IA..."
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none px-4 py-2 leading-relaxed"
              placeholder="Resultado gerado pela IA"
              readOnly
              value={completion}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode usar a variável{" "}
            <code className="text-violet-400">{"{transcription}"}</code> para
            adicionar o conteúdo da transcrição do vídeo.
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={setVideoId} />

          <Separator />
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <PromptSelect onPromptSelection={setInput} />
            </div>
            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                Você poderá personalizar essa opção em breve
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Criatividade</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />
              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                Valores mais altos tendem a deixar o resultado mais criativos,
                porém imprecisos.
              </span>
            </div>

            <Separator />

            <Button type="submit" className="w-full flex items-center" disabled={isLoading}>
              Executar
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}

export default App;
