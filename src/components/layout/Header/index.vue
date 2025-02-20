<template>
  <header
    class="w-full h-16 bg-white dark:bg-gray-800 border-b border-solid border-slate-200"
  >
    <div class="h-full px-4 flex items-center">
      <!-- logo区域 -->
      <div class="flex items-center">
        <img
          src="@/assets/avatar/common.png"
          alt="logo"
          class="h-8 w-auto mr-2"
        />
        <span class="text-lg font-medium">基础模板</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineOptions({
  name: "LayoutHeader",
});
</script>

<style scoped></style>
