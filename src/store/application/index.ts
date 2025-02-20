import { defineStore } from "pinia";
export interface Application {
  id: string; // 应用id
  name: string; // 应用名称
  icon?: string; // 应用图标
  apiKey: string; // 应用apiKey
}

export interface ApplicationState {
  applicationList: Application[];
}

export const useApplicationStore = defineStore("application", {
  state: (): ApplicationState => {
    return {
      applicationList: [
        {
          id: "ai",
          name: "AI",
          apiKey: "fastgpt-k8P6xrzF8Snd2z12gnyWzprtqZFfm9SIW6l59aur",
        },
        {
          id: "ai12",
          name: "AI2",
          apiKey: "fastgpt-k8P6xrzF8Snd2z12gnyWzprtqZFfm9SIW6l59aur",
        },
        {
          id: "ai2",
          name: "AI3",
          apiKey: "fastgpt-k8P6xrzF8Snd2z12gnyWzprtqZFfm9SIW6l59aur",
        },
        {
          id: "ai3",
          name: "AI4",
          apiKey: "fastgpt-k8P6xrzF8Snd2z12gnyWzprtqZFfm9SIW6l59aur",
        },
        {
          id: "ai4",
          name: "AI5",
          apiKey: "fastgpt-k8P6xrzF8Snd2z12gnyWzprtqZFfm9SIW6l59aur",
        },
        {
          id: "ai5",
          name: "AI6",
          apiKey: "fastgpt-k8P6xrzF8Snd2z12gnyWzprtqZFfm9SIW6l59aur",
        },
        {
          id: "ai6",
          name: "AI7",
          apiKey: "fastgpt-k8P6xrzF8Snd2z12gnyWzprtqZFfm9SIW6l59aur",
        },
      ],
    };
  },
});
