(window.webpackJsonp=window.webpackJsonp||[]).push([[54],{191:function(n,s,t){"use strict";t.r(s);var e=t(0),a=Object(e.a)({},(function(){var n=this,s=n.$createElement,t=n._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":n.$parent.slotKey}},[t("h1",{attrs:{id:"四-使用npm的钩子"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#四-使用npm的钩子"}},[n._v("#")]),n._v(" 四.使用npm的钩子")]),n._v(" "),t("p",[n._v("为了方便开发者自定义，npm script 的设计者为命令的执行增加了类似生命周期的机制，具体来说就是 "),t("code",[n._v("pre")]),n._v(" 和 "),t("code",[n._v("post")]),n._v(" 钩子脚本。这种特性在某些操作前需要做检查、某些操作后需要做清理的情况下非常有用。")]),n._v(" "),t("p",[n._v("举例来说，运行 npm run test 的时候，分 3 个阶段：")]),n._v(" "),t("ol",[t("li",[n._v("检查 scripts 对象中是否存在 pretest 命令，如果有，先执行该命令；")]),n._v(" "),t("li",[n._v("检查是否有 test 命令，有的话运行 test 命令，没有的话报错；")]),n._v(" "),t("li",[n._v("检查是否存在 posttest 命令，如果有，执行 posttest 命令；")])]),n._v(" "),t("p",[n._v("到目前为止我们所覆盖的前端工作流包含了代码检查和测试自动化运行环节，"),t("strong",[n._v("衡量测试效果的重要指标是测试覆盖率")]),n._v("，而收集覆盖率也非常的简单，"),t("strong",[n._v("下面逐步讲解如何把代码检查、测试运行、覆盖率收集这些步骤串起来")]),n._v("。")]),n._v(" "),t("h2",{attrs:{id:"改造-test-命令"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#改造-test-命令"}},[n._v("#")]),n._v(" 改造 test 命令")]),n._v(" "),t("p",[n._v("首先，我们基于钩子机制对现有的 scripts 做以下 3 点重构，把代码检查和测试运行串起来：")]),n._v(" "),t("ul",[t("li",[n._v("增加简单的 lint 命令，并行运行所有的 lint 子命令；")]),n._v(" "),t("li",[n._v("增加 pretest 钩子，在其中运行 lint 命令；")]),n._v(" "),t("li",[n._v("把 test 替换为更简单的 "),t("code",[n._v("mocha tests/")]),n._v("；")])]),n._v(" "),t("p",[n._v("代码 diff 如下：")]),n._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v('diff --git a/package.json b/package.json\nindex 8f67810..d297f2e 100644\n--- a/package.json\n+++ b/package.json\n@@ -4,13 +4,17 @@\n+    "lint": "npm-run-all --parallel lint:*",\n     "lint:js": "eslint *.js",\n     "lint:js:fix": "npm run lint:js -- --fix",\n     "lint:css": "stylelint *.less",\n     "lint:json": "jsonlint --quiet *.json",\n     "lint:markdown": "markdownlint --config .markdownlint.json *.md",\n-    "mocha": "mocha tests/",\n-    "test": "# 运行所有代码检查和单元测试 \\n    npm-run-all --parallel lint:* mocha"\n+    "pretest": "npm run lint",\n+    "test": "mocha tests/",\n')])]),n._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[n._v("1")]),t("br"),t("span",{staticClass:"line-number"},[n._v("2")]),t("br"),t("span",{staticClass:"line-number"},[n._v("3")]),t("br"),t("span",{staticClass:"line-number"},[n._v("4")]),t("br"),t("span",{staticClass:"line-number"},[n._v("5")]),t("br"),t("span",{staticClass:"line-number"},[n._v("6")]),t("br"),t("span",{staticClass:"line-number"},[n._v("7")]),t("br"),t("span",{staticClass:"line-number"},[n._v("8")]),t("br"),t("span",{staticClass:"line-number"},[n._v("9")]),t("br"),t("span",{staticClass:"line-number"},[n._v("10")]),t("br"),t("span",{staticClass:"line-number"},[n._v("11")]),t("br"),t("span",{staticClass:"line-number"},[n._v("12")]),t("br"),t("span",{staticClass:"line-number"},[n._v("13")]),t("br"),t("span",{staticClass:"line-number"},[n._v("14")]),t("br"),t("span",{staticClass:"line-number"},[n._v("15")]),t("br")])]),t("p",[n._v("当我们运行 npm test 的时候，会先自动执行 pretest 里面的 lint，实际输出如下：")]),n._v(" "),t("p",[t("img",{attrs:{src:"https://user-gold-cdn.xitu.io/2017/11/29/160052621691a0b7?w=846&h=848&f=png&s=103472",alt:""}})]),n._v(" "),t("h2",{attrs:{id:"增加覆盖率收集"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#增加覆盖率收集"}},[n._v("#")]),n._v(" 增加覆盖率收集")]),n._v(" "),t("p",[n._v("接下来，我们把运行测试和覆盖率收集串起来，具体做法是：增加覆盖率收集的命令，并且覆盖率收集完毕之后自动打开 html 版本的覆盖率报告。要实现目标，我们需要引入两个新工具：")]),n._v(" "),t("ol",[t("li",[n._v("覆盖率收集工具 "),t("a",{attrs:{href:"https://github.com/istanbuljs/nyc",target:"_blank",rel:"noopener noreferrer"}},[n._v("nyc"),t("OutboundLink")],1),n._v("，是覆盖率收集工具 "),t("a",{attrs:{href:"https://istanbul.js.org",target:"_blank",rel:"noopener noreferrer"}},[n._v("istanbul"),t("OutboundLink")],1),n._v(" 的命令行版本，istanbul 支持生成各种格式的覆盖率报告，我已经使用多年；")]),n._v(" "),t("li",[n._v("打开 html 文件的工具 "),t("a",{attrs:{href:"https://github.com/sindresorhus/opn-cli",target:"_blank",rel:"noopener noreferrer"}},[n._v("opn-cli"),t("OutboundLink")],1),n._v("，是能够打开任意程序的工具 "),t("a",{attrs:{href:"https://github.com/sindresorhus/opn",target:"_blank",rel:"noopener noreferrer"}},[n._v("opn"),t("OutboundLink")],1),n._v(" 的命令行版本，作者是\b前端社区非常高产的 "),t("a",{attrs:{href:"https://github.com/sindresorhus",target:"_blank",rel:"noopener noreferrer"}},[n._v("Sindre Sorhus"),t("OutboundLink")],1),n._v("，它在 npm 上发布了超过 1000 个包，并且质量都很不错。")])]),n._v(" "),t("p",[n._v("使用如下命令安装依赖：")]),n._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("npm i nyc opn-cli -D\n")])]),n._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[n._v("1")]),t("br")])]),t("p",[n._v("然后在 package.json 增加 nyc 的配置，告诉 nyc 该忽略哪些文件。最后是在 scripts 中新增 3 条命令：")]),n._v(" "),t("ol",[t("li",[n._v("precover，收集覆盖率之前把之前的覆盖率报告目录清理掉；")]),n._v(" "),t("li",[n._v("cover，直接调用 nyc，让其生成 html 格式的覆盖率报告；")]),n._v(" "),t("li",[n._v("postcover，清理掉临时文件，并且在浏览器中预览覆盖率报告；")])]),n._v(" "),t("p",[n._v("具体 diff 如下：")]),n._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v('diff --git a/package.json b/package.json\nindex 8f67810..d297f2e 100644\n--- a/package.json\n+++ b/package.json\n@@ -4,13 +4,17 @@\n   scripts: {\n+    "precover": "rm -rf coverage",\n+    "cover": "nyc --reporter=html npm test",\n+    "postcover": "rm -rf .nyc_output && opn coverage/index.html"\n   },\n@@ -22,7 +26,15 @@\n   "devDependencies": {\n     "npm-run-all": "^4.1.2",\n+    "nyc": "^11.3.0",\n+    "opn-cli": "^3.1.0",\n     "stylelint": "^8.2.0",\n     "stylelint-config-standard": "^17.0.0"\n+  },\n+  "nyc": {\n+    "exclude": [\n+      "**/*.spec.js",\n+      ".*.js"\n+    ]\n   }\n }\n')])]),n._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[n._v("1")]),t("br"),t("span",{staticClass:"line-number"},[n._v("2")]),t("br"),t("span",{staticClass:"line-number"},[n._v("3")]),t("br"),t("span",{staticClass:"line-number"},[n._v("4")]),t("br"),t("span",{staticClass:"line-number"},[n._v("5")]),t("br"),t("span",{staticClass:"line-number"},[n._v("6")]),t("br"),t("span",{staticClass:"line-number"},[n._v("7")]),t("br"),t("span",{staticClass:"line-number"},[n._v("8")]),t("br"),t("span",{staticClass:"line-number"},[n._v("9")]),t("br"),t("span",{staticClass:"line-number"},[n._v("10")]),t("br"),t("span",{staticClass:"line-number"},[n._v("11")]),t("br"),t("span",{staticClass:"line-number"},[n._v("12")]),t("br"),t("span",{staticClass:"line-number"},[n._v("13")]),t("br"),t("span",{staticClass:"line-number"},[n._v("14")]),t("br"),t("span",{staticClass:"line-number"},[n._v("15")]),t("br"),t("span",{staticClass:"line-number"},[n._v("16")]),t("br"),t("span",{staticClass:"line-number"},[n._v("17")]),t("br"),t("span",{staticClass:"line-number"},[n._v("18")]),t("br"),t("span",{staticClass:"line-number"},[n._v("19")]),t("br"),t("span",{staticClass:"line-number"},[n._v("20")]),t("br"),t("span",{staticClass:"line-number"},[n._v("21")]),t("br"),t("span",{staticClass:"line-number"},[n._v("22")]),t("br"),t("span",{staticClass:"line-number"},[n._v("23")]),t("br"),t("span",{staticClass:"line-number"},[n._v("24")]),t("br"),t("span",{staticClass:"line-number"},[n._v("25")]),t("br")])]),t("p",[n._v("改完之后，我们可以直接运行 npm run cover，运行的详细截图如下：")]),n._v(" "),t("p",[t("img",{attrs:{src:"https://user-gold-cdn.xitu.io/2017/11/29/16005264d5d3aef6?w=921&h=1112&f=png&s=147056",alt:""}})]),n._v(" "),t("blockquote",[t("p",[t("strong",[n._v("TIP#7")]),n._v("：到目前为止，我们的工作流中已经包含代码检查、测试运行、覆盖率收集、覆盖率查看等功能，你是不是可以用来改进下自己的工作流呢？")])]),n._v(" "),t("hr"),n._v(" "),t("blockquote",[t("p",[n._v("本节用到的代码见 "),t("a",{attrs:{href:"https://github.com/wangshijun/automated-workflow-with-npm-script/tree/04-pre-and-post-hooks",target:"_blank",rel:"noopener noreferrer"}},[n._v("GitHub"),t("OutboundLink")],1),n._v("，想边看边动手练习的同学可以拉下来自己改，注意切换到正确的分支 "),t("code",[n._v("04-pre-and-post-hooks")]),n._v("。")])]),n._v(" "),t("hr")])}),[],!1,null,null,null);s.default=a.exports}}]);