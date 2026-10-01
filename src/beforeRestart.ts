import { _p, pathJoin, runOtherCode } from '@vvi/node';
import { dog } from './aided/dog';
import { hotData } from './data-store';

/** 执行代码之前其他的操作  */
export async function beforeRestart() {
  dog('每次执行前');
  /**  */
  const __beforeRestart = hotData.options.beforeRestart;
  if (!__beforeRestart) return;
  for (const key in __beforeRestart) {
    /** 测试是哪个文件 （被监听者） 发生了变化 */
    if (new RegExp(`${key}`).test(hotData.changeFileInfo.watchTarget)) {
      try {
        const reStartBefore = await runOtherCode({
          code: __beforeRestart[key],
          cwd: pathJoin(hotData.options.base, key),
        });
        if (!reStartBefore.success) {
          _p(reStartBefore.error);
        }
      } catch (error) {
        dog.error('执行前的逻辑出错', error);
      }
    }
  }
}
