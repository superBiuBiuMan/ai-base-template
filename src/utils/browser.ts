/* 
@设备尺寸 

tuils/browser.js
*/
import { reactive } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);

// 小于 md (768px) 的屏幕判定为移动端
const isMobile = breakpoints.smaller("md");

// 响应式设备信息对象
const bsInfo = reactive({
  size: {
    isMobile,
    isPC: !isMobile,
  },
});

export { bsInfo };
