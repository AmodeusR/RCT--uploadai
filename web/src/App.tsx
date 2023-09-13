import { Button } from "./components/ui/button";
import { Github, FileVideo, Upload, Wand2 } from "lucide-react";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";

function App() {
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
            />
            <Textarea
              className="resize-none px-4 py-2 leading-relaxed"
              placeholder="Resultado gerado pela IA"
              readOnly
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode usar a variável{" "}
            <code className="text-violet-400">{"{transcription}"}</code> para
            adicionar o conteúdo da transcrição do vídeo.
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <form className="space-y-6">
            <label
              htmlFor="video"
              className="flex flex-col gap-2 justify-center items-center text-sm text-muted-foreground border rounded-lg aspect-video hover:cursor-pointer hover:bg-primary/5 transition-colors"
            >
              <FileVideo className="w-4 h-4" />
              Selecione um vídeo
            </label>
            <input
              type="file"
              id="video"
              accept="video/mp4"
              className="sr-only"
            />

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="transcription">Prompt de transcrição</Label>
              <Textarea
                id="transcription"
                className="h-24 resize-none leading-relaxed"
                placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula."
              />
            </div>
            <Button type="submit" className="w-full">
              Carregar vídeo
              <Upload className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <Separator />

          <form className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um prompt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Título do Youtube</SelectItem>
                  <SelectItem value="description">Descrição do Youtube</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">Você poderá personalizar essa opção em breve</span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Criatividade</Label>
              <Slider min={0} max={100} step={0.1} defaultValue={[50]} />
              <span className="block text-xs text-muted-foreground italic leading-relaxed">Valores mais altos tendem a deixar o resultado mais criativos, porém imprecisos.</span>
            </div>

            <Separator />

            <Button type="submit" className="w-full flex items-center">
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
