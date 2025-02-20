import { defineStore } from "pinia";
import type { Application } from "../application";
import { ulid } from "ulid";
import dayjs from "dayjs";
import type { SSE } from "sse.js";
import welcom from "@/config/welcom";

export interface knowledgeInfo {
  title: string;
  content: string;
  quoteList?: {
    sourceName: string;
  }[];
}

export interface ChatMessage {
  id: string; // 消息id
  text: string; // 消息内容
  role: "user" | "assistant"; // 消息角色
  dateTime: string | number; // 消息时间
  error: boolean; //是否错误
  knowledgeInfo?: knowledgeInfo; //知识库搜索结果
  loading: boolean; //是否加载中
  loadingDesc?: string; // 正在加载的描述
}

export interface ChatSession {
  id: string; // 聊天的时候发过去,历史记录使用
  desc: string; // 会话描述
  createTime: string | number; // 会话创建时间
  messages: ChatMessage[]; // 会话消息
  activeMessage?: ChatMessage | null; // 当前正在活动的消息
  lastMessage?: ChatMessage | null; // 最后一条消息
}
export interface SessionInfo {
  data: ChatSession[];
  currentSessionId?: string; // 当前会话
}
export interface InfoState {
  currentApplicationInfo: Application; // 当前应用信息
  sessionList: Record<string, SessionInfo>; // 会话列表
  currentStream: SSE | null; // 当前流
  isSidebarCollapsed: boolean; // 侧边栏折叠状态
  isMobile: boolean; // 是否是移动端
}

// 在 store 定义之前添加这个工具函数
function resetLoadingState(state: InfoState): InfoState {
  // 重置单个消息的 loading 状态
  const resetMessage = (message: ChatMessage, session: ChatSession) => {
    if (message.loading) {
      const updatedMessage = {
        ...message,
        loading: false,
        loadingDesc: undefined,
      };

      // 同步更新 lastMessage 和 activeMessage
      if (session.lastMessage?.id === message.id) {
        session.lastMessage = updatedMessage;
      }
      if (session.activeMessage?.id === message.id) {
        session.activeMessage = updatedMessage;
      }

      return updatedMessage;
    }
    return message;
  };

  // 重置单个会话的状态
  const resetSession = (
    session: ChatSession,
    sessionInfo: { data: ChatSession[]; currentSession?: ChatSession }
  ) => {
    // 重置所有消息
    session.messages = session.messages.map((msg) =>
      resetMessage(msg, session)
    );

    // 同步更新 currentSession
    if (sessionInfo.currentSession?.id === session.id) {
      sessionInfo.currentSession = session;
    }

    return session;
  };

  // 处理所有会话
  Object.values(state.sessionList).forEach((sessionInfo) => {
    sessionInfo.data = sessionInfo.data.map((session) =>
      resetSession(session, sessionInfo)
    );
  });

  return state;
}

export const useInfoStore = defineStore("info", {
  state: (): InfoState => {
    return {
      sessionList: {
        ai: {
          data: [],
        },
      },

      currentApplicationInfo: {
        id: "ai",
        name: "AI",
        apiKey:
          "fastgpt-k8P6xrzF8Snd2zEq48if859Z4LqhAVXnFgnyWzprtqZFfm9SIW6l59aur",
      },

      currentStream: null, // 当前流
      isSidebarCollapsed: false, // 侧边栏折叠状态初始值
      isMobile: false, // 是否是移动端
    };
  },
  actions: {
    //删除会话
    deleteSession(sessionId: string) {
      const { id: applicationId } = this.currentApplicationInfo;
      this.sessionList[applicationId].data = this.sessionList[
        applicationId
      ].data.filter((item) => item.id !== sessionId);
      if (this.sessionList[applicationId].data.length === 0) {
        this.addInitRobotChat();
      }
    },
    //添加初始化机器人聊天
    addInitRobotChat() {
      this.addChat();
      this.addChatMessage(this.currentSessionId, {
        id: ulid(),
        text: welcom.welcomeTitle,
        role: "assistant",
        dateTime: dayjs().valueOf(),
        error: false,
        loading: false,
      });
    },
    switchApplication(application: Application) {
      if (this.currentApplicationInfo.id === application.id) {
        return;
      }
      if (this.currentStream) {
        this.currentStream.close();
      }
      this.currentApplicationInfo = application;
      // 如果当前应用不存在，则添加
      if (!this.sessionList[application.id]) {
        this.sessionList[application.id] = {
          data: [],
        };
        this.addInitRobotChat();
      }
    },
    //添加会话
    addChat() {
      if (this.currentStream) {
        this.currentStream.close();
      }
      const id = ulid();
      const { id: applicationId } = this.currentApplicationInfo;
      const data: ChatSession = {
        id,
        desc: welcom.newChatDesc,
        createTime: dayjs().valueOf(),
        messages: [],
        activeMessage: null,
        lastMessage: null,
      };
      this.sessionList[applicationId].data.unshift(data);
      this.sessionList[applicationId].currentSessionId = data.id;
    },
    //更新会话信息
    updateChatSession(sessionId: string, data: Partial<ChatSession>) {
      const { id: applicationId } = this.currentApplicationInfo;
      const session = this.sessionList[applicationId].data.find(
        (item) => item.id === sessionId
      );
      if (session) {
        Object.assign(session, data);
      }
    },
    //添加消息
    addChatMessage(sessionId: string, message: ChatMessage) {
      const { id: applicationId } = this.currentApplicationInfo;
      const session = this.sessionList[applicationId].data.find(
        (item) => item.id === sessionId
      );
      this.sessionList[applicationId].currentSessionId = sessionId;
      if (session) {
        session.messages.push(message);
        session.lastMessage = message;
        session.activeMessage = message;
      }
    },
    //更新消息
    updateChatMessage(messageId: string, message: Partial<ChatMessage>) {
      const { id: applicationId } = this.currentApplicationInfo;
      const session = this.sessionList[applicationId].data.find(
        (item) => item.id === this.currentSessionInfo.currentSessionId
      );
      if (session) {
        const index = session.messages.findIndex(
          (item) => item.id === messageId
        );
        //合并text
        const text = session.messages[index].text + (message.text ?? "");
        const data = {
          ...session.messages[index],
          ...message,
          text,
        };
        session.messages[index] = data;
        session.activeMessage = data;
        session.lastMessage = data;
      }
    },
    //添加消息
    addMessage(message: ChatMessage) {
      const { id: applicationId } = this.currentApplicationInfo;
      const session = this.sessionList[applicationId].data.find(
        (item) => item.id === this.sessionList[applicationId].currentSessionId
      );
      session?.messages.push(message);
    },
    //切换会话
    switchSession(sessionId: string) {
      console.log("this.currentStream", this.currentStream);
      if (this.currentStream) {
        this.currentStream.close();
      }
      const { id: applicationId } = this.currentApplicationInfo;
      this.sessionList[applicationId].currentSessionId = sessionId;
    },
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
  },
  getters: {
    //是否应该隐藏侧边栏
    shouldHideSidebar(state): boolean {
      return state.isMobile || state.isSidebarCollapsed;
    },
    // 当前会话信息
    currentSessionInfo(state): SessionInfo {
      return state.sessionList[state.currentApplicationInfo?.id];
    },
    //当前会话列表
    currentSessionList(state): ChatSession[] {
      return state.sessionList[state.currentApplicationInfo?.id]?.data ?? [];
    },
    //当前会话id
    currentSessionId(state): string {
      return state.sessionList[state.currentApplicationInfo?.id]
        ?.currentSessionId as string;
    },
    //当前会话列表的Message
    currentSessionMessageList(state): ChatMessage[] {
      const session = this.currentSessionList.find(
        (item) => item.id === this.currentSessionId
      );
      return session?.messages ?? [];
    },
    //当前会话的活动消息
    currentSessionActiveMessage(state): ChatMessage | null {
      const session = this.currentSessionList.find(
        (item) => item.id === this.currentSessionId
      );
      return session?.activeMessage ?? null;
    },
  },
  persist: {
    key: "ztpc-ai-info-key",
    omit: ["currentStream"],
    storage: {
      getItem(key: string): string | null {
        const value = localStorage.getItem(key);
        if (value) {
          const state = JSON.parse(value);
          return JSON.stringify(resetLoadingState(state));
        }
        return null;
      },
      setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
      },
      removeItem(key: string): void {
        localStorage.removeItem(key);
      },
    } as Storage,
  },
});
