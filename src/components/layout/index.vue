<script setup lang="ts">
import { ref, watch } from "vue";
import Header from "./Header/index.vue";
import { ArrowCircleLeft32Regular } from "@vicons/fluent";
import Application from "./Application/index.vue";
import { useInfoStore } from "@/store/info";
import { storeToRefs } from "pinia";
import { bsInfo } from "@/utils/browser";
watch(bsInfo.size, (_) => {
  console.log("bsInfo.size", _.isMobile);
  infoStore.isMobile = _.isMobile;
});

defineOptions({
  name: "LayoutDefault",
});

const infoStore = useInfoStore();
const { isSidebarCollapsed, shouldHideSidebar } = storeToRefs(infoStore);
</script>
<template>
  <div class="w-screen h-screen flex flex-col">
    <Header />
    <div class="flex-1 h-0 flex flex-row">
      <div
        v-if="!infoStore.isMobile"
        class="bg-gray-50 relative"
        :class="[shouldHideSidebar ? 'w-[40px]' : 'w-[60%] max-w-[180px]']"
      >
        <n-scrollbar>
          <Application
            class="border-r-2 border-solid border-slate-100 p-6 pb-0 origin-left"
            :class="[
              shouldHideSidebar
                ? 'opacity-0 scale-90 -translate-x-4'
                : 'opacity-100 scale-100 translate-x-0',
              'transition-[transform,scale] duration-500 ease-in-out',
            ]"
          />
        </n-scrollbar>
        <div
          @click="infoStore.toggleSidebar"
          v-if="!infoStore.isMobile"
          class="absolute flex items-center justify-center cursor-pointer top-1/2 right-[-16px] -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out z-10 border border-slate-100/60 group hover:scale-105"
        >
          <n-icon
            size="18"
            :class="[
              'transition-all duration-300 ease-in-out text-slate-400 group-hover:text-slate-600',
              shouldHideSidebar ? 'rotate-180' : '',
            ]"
            :component="ArrowCircleLeft32Regular"
          />
        </div>
      </div>
      <div class="flex-1">
        <router-view />
      </div>
    </div>
  </div>
</template>
