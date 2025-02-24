<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import commonAvatar from "@/assets/avatar/common.png";
import { createAiStream } from "@/api/index";
import { ulid } from "ulid";
import { formatTimeByMessage } from "@/utils/date";
import type { ChatMessage } from "@/store/info";
import { storeToRefs } from "pinia";
import { useInfoStore } from "@/store/info";
import dayjs from "dayjs";
import { useThrottleFn } from "@vueuse/core";
import BubbleShow from "../bubble/index.vue";
import { Copy16Regular } from "@vicons/fluent";
import { createDiscreteApi } from "naive-ui";
const { message } = createDiscreteApi(["message"]);
const infoStore = useInfoStore();

const chatScrollContainer = ref<HTMLElement | null>(null);
const chatContent = ref<HTMLElement | null>(null);
const { currentSessionId, currentSessionActiveMessage } =
  storeToRefs(infoStore);
const props = defineProps<{
  messageList: ChatMessage[];
}>();

const inputMessage = ref<string>("");
const loading = ref<boolean>(false);
const disabledBtn = computed(() => {
  return loading.value || !inputMessage.value.trim();
});
const errorCloseStream = () => {
  loading.value = false;
  if (infoStore.currentStream) {
    infoStore.currentStream.close();
  }
};

const scrollToBottomFn = useThrottleFn(() => {
  if (chatScrollContainer.value) {
    chatScrollContainer.value.scrollTo({
      top: chatContent.value?.clientHeight,
      behavior: "smooth",
    });
  }
}, 200);
//添加用户消息
const addUserMessage = (text: string) => {
  if (infoStore.currentSessionMessageList.length <= 1) {
    infoStore.updateChatSession(currentSessionId.value as string, {
      desc: text,
    });
  }
  infoStore.addChatMessage(currentSessionId.value as string, {
    id: ulid(),
    text,
    role: "user",
    dateTime: dayjs().valueOf(),
    error: false,
    loading: false,
  });
  setTimeout(() => {
    scrollToBottomFn();
  }, 300);
};
//添加机器人消息
const addAssistantMessage = (text: string) => {
  infoStore.addChatMessage(currentSessionId.value as string, {
    id: ulid(),
    text,
    role: "assistant",
    dateTime: dayjs().valueOf(),
    error: false,
    loading: true,
  });
};
//更新消息
const updateMessage = (message: Partial<ChatMessage>) => {
  console.log("updateMessage", message);
  infoStore.updateChatMessage(
    currentSessionActiveMessage.value?.id as string,
    message
  );
};

const sendMessage = () => {
  if (loading.value) return;
  if (!inputMessage.value.trim()) return;
  errorCloseStream();
  addUserMessage(inputMessage.value);
  const controlledSource = createAiStream({
    content: inputMessage.value,
    chatId: currentSessionId.value as string,
  });
  loading.value = true;
  inputMessage.value = "";
  infoStore.currentStream = controlledSource;
  controlledSource.addEventListener("open", () => {
    addAssistantMessage("");
  });

  controlledSource.addEventListener("flowNodeStatus", ({ data: dataText }) => {
    try {
      const data = JSON.parse(dataText);
      console.log("更新等待信息状态栏", data);
      updateMessage({
        loading: true,
        loadingDesc: data?.name,
      });
    } catch (error) {
      console.log("捕获的错误", error);
      errorCloseStream();
    }
  });

  controlledSource.addEventListener("answer", ({ data: dataText }) => {
    try {
      if (dataText === "[DONE]") {
        return;
      }
      const data = JSON.parse(dataText);
      console.log("机器人回答结果", data);
      const contentList = data?.choices?.map((item) => item?.delta?.content);
      if (!contentList || !contentList?.join()) {
        return;
      }
      for (let content of contentList) {
        console.log("content0,content", content);
        updateMessage({
          text: content,
        });
      }
    } catch (error) {
      console.log("捕获的错误", error);
      errorCloseStream();
    }
  });
  controlledSource.addEventListener("flowResponses", ({ data: dataText }) => {
    try {
      const data = JSON.parse(dataText);
      console.log("知识库结果", data);
      console.log("flowResponses", "同时代表链接结束");
      updateMessage({
        knowledgeInfo:
          data?.find(
            (item) =>
              item?.moduleName === "知识库搜索" ||
              item?.model === "bceembedding"
          ) ?? null,
        loading: false,
      });
      errorCloseStream();
    } catch (error) {
      console.log("捕获的错误", error);
      errorCloseStream();
    }
  });
  controlledSource.onerror = (error) => {
    console.log("捕获的错误", error);
    errorCloseStream();
  };
  controlledSource.onabort = (ee) => {
    loading.value = false;
    infoStore.currentStream = null;
    infoStore.updateChatMessage(
      currentSessionActiveMessage.value?.id as string,
      {
        loading: false,
        loadingDesc: "",
      }
    );
  };
  controlledSource.stream();
  console.log("到了这里吗");
};

// 添加复制功能函数
const copyMessage = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      message.success("复制成功");
    })
    .catch(() => {
      message.error(`复制失败`);
    });
};

const handleScroll = (mutations: MutationRecord[]) => {
  scrollToBottomFn();
};
watch(
  () => props.messageList,
  () => {
    setTimeout(() => {
      scrollToBottomFn();
    }, 300);
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- 聊天内容区域 -->
    <n-scrollbar ref="chatScrollContainer">
      <div class="flex-1 p-4 overflow-y-auto" ref="chatContent">
        <div class="flex flex-col gap-4">
          <div
            v-for="message in messageList"
            :key="message.id"
            :class="[
              message.role === 'user' ? 'items-end' : 'items-start',
              'flex flex-col',
            ]"
          >
            <!-- AI消息的头像和提示信息区域 -->
            <div
              v-if="message.role === 'assistant'"
              class="flex items-center gap-2 mb-1"
            >
              <img
                :src="commonAvatar"
                class="w-8 h-8 rounded-full object-contain"
                alt="avatar"
              />
              <!-- 提示信息或操作按钮区域 -->
              <div
                v-if="message.loadingDesc && message.loading"
                class="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-blue-100/70"
              >
                <span
                  class="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse"
                ></span>
                <span class="text-xs text-blue-600/70">{{
                  message.loadingDesc
                }}</span>
              </div>
              <!-- 操作栏 -->
              <div
                v-else
                class="flex items-center gap-1 rounded-sm border border-slate-300"
              >
                <span
                  class="flex items-center justify-center cursor-pointer hover:text-blue-500 border-r-1 border-slate-300"
                  @click="copyMessage(message.text)"
                >
                  <n-icon
                    size="18"
                    class="text-slate-400"
                    :component="Copy16Regular"
                  />
                </span>
                <!-- <span
                  class="flex items-center justify-center cursor-pointer hover:text-blue-500"
                  @click="copyMessage(message.text)"
                >
                  <n-icon
                    size="18"
                    class="text-slate-400"
                    :component="Copy16Regular"
                  />
                </span> -->
              </div>
            </div>

            <!-- 消息气泡 -->
            <div
              :class="[
                'max-w-[70%] rounded-lg p-3 break-words border',
                message.role === 'user'
                  ? 'bg-blue-200 text-white rounded-tr-none border-blue-300'
                  : 'bg-gray-100 text-gray-800 rounded-tl-none border-gray-200',
              ]"
            >
              <BubbleShow
                :text="message.text"
                :loading="message.loading"
                @dom-update="handleScroll"
              />
              <div :class="['text-xs mt-1', 'text-gray-500']">
                {{ formatTimeByMessage(message.dateTime) }}
              </div>

              <!-- 知识库引用区域 -->
              <div
                v-if="message?.knowledgeInfo?.quoteList?.length > 0"
                class="mt-3 pt-3 border-t border-gray-200"
              >
                <div class="text-xs text-gray-500 mb-2">知识库引用：</div>
                <div class="space-y-2">
                  <div
                    v-for="(item, index) in message?.knowledgeInfo?.quoteList"
                    :key="index"
                    class="text-xs p-2 rounded bg-gray-50 border border-gray-200"
                  >
                    <div class="text-gray-600">{{ item.sourceName }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-scrollbar>

    <!-- 输入区域 -->
    <div class="border-t border-gray-200 p-4">
      <div class="flex gap-2">
        <n-input
          v-model:value="inputMessage"
          type="text"
          round
          @keyup.enter="sendMessage"
          placeholder="输入消息..."
        />
        <n-button
          :disabled="disabledBtn"
          round
          type="info"
          @click="sendMessage"
        >
          发送
        </n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(0.8);
  }
}
</style>
