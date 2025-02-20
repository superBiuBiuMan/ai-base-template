<template>
  <div v-if="!isMobile" class="w-full">
    <div>秋天不落叶</div>
    <div class="flex flex-col">
      <!-- todo 会话列表的padding不是固定的 -->
      <div
        v-for="item in applicationList"
        :key="item.id"
        @click="handleSwitchApp(item)"
        class="border-box flex items-center py-[8px] px-[8px] rounded-md mb-2 cursor-pointer hover:bg-slate-200"
        :class="[
          'item',
          item.id === currentApplicationInfo.id
            ? 'shadow-application text-blue-700 bg-white font-bold'
            : 'text-slate-700',
        ]"
      >
        <div class="flex pr-2">
          <img
            :src="commomAvatar"
            alt=""
            class="w-[24px] h-[24px] object-contain"
          />
        </div>
        <div class="text-xs line-clamp-1 ml-1">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useApplicationStore } from "@/store/application";
import type { Application } from "@/store/application";
import commomAvatar from "@/assets/avatar/common.png";
import { useInfoStore } from "@/store/info";
const infoStore = useInfoStore();
const applicationStore = useApplicationStore();
const { currentApplicationInfo, isMobile } = storeToRefs(infoStore);
const { applicationList } = storeToRefs(applicationStore);
defineOptions({
  name: "LayoutApplication",
});
const handleSwitchApp = (item: Application) => {
  console.log("切换", item);
  infoStore.switchApplication(item);
};
</script>

<style scoped lang="scss">
.item {
  --shadow: 50px 50px 100px 10px rgb(0 0 0 / 10%);
  --at-apply: "shadow-[--shadow]";
}
</style>
