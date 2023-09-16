import { useEffect, useState } from "react";
import { Label } from "./ui";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "./ui/select";
import { api } from "@/lib/axios";

type prompt = {
  id: string;
  title: string;
  template: string;
}

type PromptSelectProps = {
  onPromptSelection: (template: string) => void;
}

const PromptSelect = ({ onPromptSelection }: PromptSelectProps) => {
  const [prompts, setPrompts] = useState<prompt[] | null>(null);

  useEffect(() => {
    api.get("/prompts").then((response) => {
      setPrompts(response.data);
    });

  }, []);

  function handlePromptSelection(id: string) {
    const selectedPrompt = prompts?.find(prompt => prompt.id === id);
    if (!selectedPrompt) return;

    onPromptSelection(selectedPrompt.template);
  }
  
  return (
    <>
      <Label>Prompt</Label>
      <Select onValueChange={handlePromptSelection}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um prompt" />
        </SelectTrigger>
        <SelectContent>
          {prompts?.map(prompt => (
            <SelectItem key={prompt.id} value={prompt.id}>{prompt.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export { PromptSelect };
