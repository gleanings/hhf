// import vm from 'node:vm';
import { unlinkSync, writeFileSync } from 'node:fs';
import { pathJoin } from '@vvi/node';
import { getRandomString } from '@vvi/utils';

import { dog } from '../aided/dog';
import { ConfigOfFile } from './type';

/**
 * 通过 js 文件获配置
 * @param str
 */
export async function getTextOfJsFile(str: string) {
  dog('待解析的文本', str);
  /**  文件路径  */
  const filePath = pathJoin(
    process.cwd(),
    '../',
    `config.${getRandomString(5)}.mjs`,
  );
  dog('文件路径为', filePath);
  writeFileSync(filePath, str);

  try {
    const module = await import(filePath);
    dog('解析出来的数据', filePath, module);
    unlinkSync(filePath);
    return module.default as ConfigOfFile;
  } catch (error) {
    dog('动态获取 js 文件出错', error);
    unlinkSync(filePath);
    return null;
  }

  // try {
  //   /**  ES 模块的导出需要包裹在函数中，并通过返回值传递  */
  //   const wrappedCode = `
  //   (function () {
  //        ${str} // 执行原始代码
  //        return module.exports?.default || module.exports; // 兼容 ES 模块和 CommonJS 模块
  //   })();
  //   `;
  //   /**  创建隔离上下文  */
  //   const context = vm.createContext({}); // 隔离上下文（无全局变量）

  //   const script = new vm.Script(wrappedCode);
  //   /** 转化后的数据  */
  //   const result = script.runInContext(context, { timeout: 1000 }); // 执行并设置超时（防止死循环）

  //   return result;
  // } catch (error) {
  //   dog.error('解析 js 配置文件出错', error);
  //   return {};
  // }
}
