import MarkdownIt from "markdown-it";
import mdhljs from "markdown-it-highlightjs";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
// import markdownItCopy from "markdown-it-code-copy";
import { h } from "vue";
import "github-markdown-css";
import { createDiscreteApi } from "naive-ui";
const { message } = createDiscreteApi(["message"]);

export function getEnv(key: string) {
  if (!key) return "";
  return import.meta.env[key];
}

//截取字符串前n个,其余使用...表示
export function getStringLength(str: string, n: number = 20) {
  if (str.length <= n) return str;
  return str.slice(0, n) + "...";
}

export function createMD(config = {}) {
  const md = new MarkdownIt({
    breaks: true,
    highlight(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            '<pre class="hljs"><code>' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true })
              .value +
            "</code></pre>"
          );
        } catch (__) {}
      }

      return (
        '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
      );
    },
    ...config,
  });

  md.use(mdhljs);
  // md.use(markdownItCopy, {
  //   onSuccess: () => {
  //     message.success("复制成功");
  //   },
  //   onError: (error) => {
  //     message.error(`复制失败: ${error}`);
  //   },
  //   buttonStyle:
  //     "position: absolute; top: 0px; right: 6px; cursor: pointer; outline: none;",
  //   element: "<span class='text-xs'>Copy</span>",
  // });
  return md;
}
