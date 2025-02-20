import dayjs from "dayjs";

/**
 * 格式化聊天时间
 * @param timestamp 时间戳
 * @returns 格式化后的时间
 * 使用dayjs,传入时间戳或者日期
    根据传入的日期,和今天日期比较,

    如果是今天,就显示小时:分钟
    如果是昨天,就显示昨天
    如果是昨天的昨天或者更早,就直接显示月份-日期,
    如果是去年,就显示年月日

 */
export const formatChatTime = (timestamp: number | string | Date) => {
  const today = dayjs();
  const target = dayjs(timestamp);

  // 是否同一年
  if (today.year() !== target.year()) {
    return target.format("YYYY-MM-DD");
  }

  // 是否今天
  if (today.format("YYYY-MM-DD") === target.format("YYYY-MM-DD")) {
    return target.format("HH:mm");
  }

  // 是否昨天
  if (
    today.subtract(1, "day").format("YYYY-MM-DD") ===
    target.format("YYYY-MM-DD")
  ) {
    return "昨天";
  }

  // 其他日期显示月-日
  return target.format("MM-DD");
};

export const formatTimeByMessage = (timestamp: number | string | Date) => {
  return dayjs(timestamp).format("HH:mm");
};
