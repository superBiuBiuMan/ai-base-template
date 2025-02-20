<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面不存在</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "404",
});
// 组件逻辑
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

h1 {
  font-size: 48px;
  margin-bottom: 16px;
}

p {
  font-size: 18px;
  color: #666;
}
</style>
