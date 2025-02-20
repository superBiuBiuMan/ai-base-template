<script setup lang="ts">
import { useInfoStore } from "@/store/info";
import type { ChatSession } from "@/store/info";
import { formatChatTime } from "@/utils/date";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import dayjs from "dayjs";
import { ulid } from "ulid";
import welcom from "@/config/welcom";
import { getStringLength } from "@/utils/base";
const props = defineProps<{
  chatList: ChatSession[];
}>();
const infoStore = useInfoStore();
const { currentSessionId } = storeToRefs(infoStore);
const handleAddChat = () => {
  infoStore.addInitRobotChat();
};
const handleSwitchSession = (sessionId: string) => {
  infoStore.switchSession(sessionId);
};
onMounted(() => {
  if (props.chatList?.length === 0) {
    infoStore.addInitRobotChat();
  }
});
</script>

<template>
  <div class="flex flex-col gap-2 w-full h-full">
    <!-- 新建聊天按钮 -->
    <div
      @click="handleAddChat"
      class="m-4 mb-0 flex items-center p-2 border border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 select-none"
    >
      <div
        class="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center"
      >
        <span class="text-gray-400 text-xl">+</span>
      </div>
      <span class="ml-3 text-gray-500">新建聊天</span>
    </div>
    <n-scrollbar>
      <!-- 会话项 -->
      <div class="flex-1 p-4 overflow-y-auto">
        <div
          v-for="chat in chatList"
          :key="chat.id"
          @click="handleSwitchSession(chat.id)"
          :class="[
            'border-box flex items-center py-2 px-4 mb-2 hover:bg-gray-100 rounded-lg cursor-pointer',
            { 'bg-gray-100': chat.id === currentSessionId },
          ]"
        >
          <!-- 头像 -->
          <div
            class="w-10 h-10 shrink-0 bg-blue-500 rounded-full flex items-center justify-center text-white"
          >
            {{ chat.desc.slice(0, 1) }}
          </div>
          <!-- 会话信息 -->
          <div class="ml-3 flex-1 w-0">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium line-clamp-1">{{
                chat.desc
              }}</span>
              <span class="text-xs text-gray-500">{{
                formatChatTime(chat.createTime)
              }}</span>
            </div>
            <div class="flex justify-between items-center mt-1 line-clamp-1">
              <span class="text-xs text-gray-500 truncate">{{
                chat.lastMessage?.text ?? ""
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<style scoped lang="scss"></style>
