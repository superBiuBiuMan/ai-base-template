<script setup lang="ts">
import { computed, watch, ref, onMounted } from "vue";
import DOMPurify from "dompurify";
import { createMD } from "@/utils/base";
const props = defineProps<{
  text: string;
  loading: boolean;
}>();
const emit = defineEmits<{
  (e: "domUpdate", data: any): void;
}>();
const md = createMD();
const markdownRef = ref<HTMLElement>();

const htmlShow = computed(() => {
  //防止xss
  return md.render(DOMPurify.sanitize(props.text));
});
onMounted(() => {
  if (props.loading) {
    console.log("markdownRef.value", markdownRef.value);
    const observer = new MutationObserver((mutations) => {
      emit("domUpdate", mutations);
    });
    //监听所有属性
    observer.observe(markdownRef.value!, {
      childList: true,
      subtree: true,
    });
  }
});
</script>

<template>
  <div>
    <div ref="markdownRef" class="markdown-body" v-html="htmlShow"></div>
    <span v-if="loading" class="typing-cursor">|</span>
  </div>
</template>

<style lang="scss">
.markdown-body {
  background: unset;
  font-size: 14px;
}
.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 16px;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
