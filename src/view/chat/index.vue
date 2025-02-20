<script setup lang="ts">
import ChatList from "./message/index.vue";
import ChatContent from "./chat-content/index.vue";
import { useInfoStore } from "@/store/info";
import { storeToRefs } from "pinia";
const infoStore = useInfoStore();
const { currentSessionList, currentSessionMessageList, isMobile } =
  storeToRefs(infoStore);
</script>

<template>
  <div :class="['box-border w-full h-full', isMobile ? 'p-0' : 'p-4']">
    <div class="w-full h-full flex rounded-xl shadow-common">
      <!-- 会话列表 -->
      <div
        v-if="!isMobile"
        class="w-[20%] min-w-[200px] max-w-[320px] border-r border-gray-200"
      >
        <ChatList :chat-list="currentSessionList" />
      </div>
      <!-- 聊天内容 -->
      <div class="flex-1">
        <ChatContent :message-list="currentSessionMessageList" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
