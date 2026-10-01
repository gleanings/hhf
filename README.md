# hhf

[![version](<https://img.shields.io/npm/v/hhf.svg?logo=npm&logoColor=rgb(0,0,0)&label=版本号&labelColor=rgb(73,73,228)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/hhf) [![issues 提交](<https://img.shields.io/badge/issues-提交-rgb(255,0,63)?logo=github>)](https://github.com/gleanings/hhf/issues)

---

一个简单的热启动，缩写为 `hhf`

简单，是因为只干一件事，监听文件变化，重新启动执行的命令

## 使用

```sh
npx hhf
```

## 使用配置文件

可配置 `hhf.config.json` 、`hhf.config.ts`、`hhf.config.js` 文件，供热更新使用

若配置同时存在，配置以 `.json` 为最终配置，没有 `.json` 文件，则以 `.js` 文件为最终配置

### 创建配置文件

使用 `init` 命令创建配置文件

```sh
# 自主选择配置文件
npx hhf init
# 使用 json 配置格式文件
npx hhf init  json
# 使用 json 配置格式文件
npx hhf i  -n
# 使用 js 配置格式文件
npx hhf init  js
# 使用 js 配置格式文件
npx hhf i  -j
# 使用 ts 配置格式文件
npx hhf init  ts
# 使用 ts 配置格式文件
npx hhf i  -t
```

- _您可以使用 -h 查看具体的使用及他们的缩写方式_

### json 格式配置文件

```json
{
  "base": "..", // 监听文件及执行热启动前的打包相对路径
  // "cwd": "", // 执行代码的地址
  "watch": "hhf", // 热更新监听的文件
  "skip": ["exportMjs", "exportCjs", "exportTypes"], // 默认不监听 */lib、*/cjs 以及 */es 打包内容，可根据实际情况更替
  "code": "ls", // 使用的命令
  "args": ["-al"], // 传入的参数，可直接放入 code 属性执行命令后，注意顺序
  "beforeReStart": {
    // 执行命令前须执行的其他命令
    "hhf": "npm run build"
  }
}
```

### JS format configuration file

```ts
/**  请勿在函数体外添加非注释内容  */
// 配置项 https://github.com/earthnutDev/hhf/blob/main/README.md#配置说明
() => ({
  //  热启动相关配置
  // 监听文件的相对路径（这里不影响 \`cwd\` 路径， cwd 依旧相对于配置文件目录 ）
  base: '..',
  // 监听的文件/夹，但他们内部文件变化，可触发再次启动
  watch: ['hhf'],
  // 打包编译文件，不监听以下文件内文件变化
  skip: ['exportCjs', 'exportMjs', 'exportTypes'],
  // 启动 \`code\` 的相对目录，可以为空
  // "cwd": ".",
  // 执行的具体的命令
  code: 'node  ./index.js',
  // 启动时赋予 \`code\` 的参数
  args: ['-v'],
  // 监听变化后，相对目录在再次启动前执行的命令
  // 这个属性应与 \`watch\` 元素相同
  beforeRestart: {
    hhf: 'npm  run build',
  },
});
```

### TS format configuration file

```ts
/**  请勿在函数体外添加非注释内容  */
// 配置项  https://github.com/earthnutDev/hhf/blob/main/README.md#配置说明
() => ({
  //  热启动相关配置
  // 监听文件的相对路径（这里不影响 \`cwd\` 路径， cwd 依旧相对于配置文件目录 ）
  base: '..',
  // 监听的文件/夹，但他们内部文件变化，可触发再次启动
  watch: ['hhf'],
  // 打包编译文件，不监听以下文件内文件变化
  skip: ['exportCjs', 'exportMjs', 'exportTypes'],
  // 启动 \`code\` 的相对目录，可以为空
  // "cwd": ".",
  // 执行的具体的命令
  code: 'node  ./index.js',
  // 启动时赋予 \`code\` 的参数
  args: ['-v'],
  // 监听变化后，相对目录在再次启动前执行的命令
  // 这个属性应与 \`watch\` 元素相同
  beforeRestart: {
    hhf: 'npm  run build',
  },
});
```

倘若启动的时候，除了 `npx hhf`（非全局安装），`hhf`（全局安装）,启动后带有参数，将直接覆盖配置文件

## 配置说明

### `watch` ： 监听对象

`watch` 是要监听的文件或文件夹，默认为 `.` ,即当前运行热重启的跟路径可以自行更改

```ts
watch: 'cli';
```

若想监听多个文件夹，可以使用数组的方式进行修改默认值

```ts
watch: ['cli', 'tools'];
```

### `skip` : 忽略的文件

`skip` 配置忽略监听的文件。**若构建文件未加入其中，可能会造成无限循环的：清理 -> 构建 -> 清理 -> 构建**
