/**
 * 该文件为开发文件，仅在开发环境使用。用于开发的热更新
 */
import { watch, statSync } from 'node:fs';
import { ArgsMap } from '@vvi/command';
import { _p, pathJoin } from '@vvi/node';
import {
  brightYellowPen,
  cyanPen,
  greenPen,
  redPen,
  yellowPen,
} from '@vvi/pen';
import { throttle } from '@vvi/utils';
import { dog } from './aided/dog';
import { CommandParam } from './aided/type';
import { beforeRestart } from './beforeRestart';
import checkSkip from './checkSkip';
import { createChild, killChild } from './chidManage';
import { hotData } from './data-store';
import { initOptions } from './init-options';
import { getTime } from './util';

/**  一个简单的热启动 */
export class HotDevelop {
  /**
   *   初始化项目
   * @param args
   */
  constructor(args: ArgsMap<CommandParam>) {
    this.run();
    /**   监听配置文件的变化 */
    watch(
      '.',
      { persistent: false, recursive: true, encoding: 'utf8' },
      this.configChange,
    );
    // 初始化参数（起动命令后手动添加的参数）
    hotData.initArg = args;
  }

  /**
   * 开始执行热重启
   * @param [restart=false] {@link Boolean} 类型，用于是否初始化配置项及更新监听
   */
  async run(restart = true) {
    dog('执行热重启', restart);
    // 锁定更新
    hotData.restart = true;
    // 初始化配置
    if (restart) {
      await initOptions();
    }
    // 食子虎
    await killChild();
    // 开始允许代码
    await beforeRestart();
    // 创建子线程
    createChild();
    // 解锁
    hotData.restart = false;
    // 开启监听
    if (restart) {
      this.hot();
    }
  }

  /** 开热监听文件变化并执行热更新 */
  hot(): boolean {
    const watchFileList: string[] = hotData.options.watch;
    // 根据新的监听者么清理旧已移除的监听者
    Object.keys(hotData.listeners).map((currentLi: string) => {
      // 参看该元素是否已存在于原上一次设定
      const elementIndex = watchFileList.indexOf(currentLi);
      // 执行清理
      if (elementIndex == -1) {
        hotData.listeners[currentLi].close();
        delete hotData.listeners[currentLi];
      } else {
        // 移除已经存在的监听
        watchFileList.splice(elementIndex, 1);
      }
    });
    // 每一个需要（在上一步仍存在的元素）监听的文件
    for (const key in watchFileList) {
      const _ele = watchFileList[key];
      const _temp: string = pathJoin(hotData.options.base, _ele);
      if (Object.prototype.hasOwnProperty.call(watchFileList, key)) {
        if (statSync(_temp, { throwIfNoEntry: false })) {
          hotData.listeners[_temp] = watch(
            _temp,
            { persistent: false, recursive: true },
            (type: string, filename: string | null) => {
              /** 检验是否跳过 */
              if (checkSkip(filename ?? '')) return;
              /// 上一次未结束
              if (hotData.restart)
                // 由于在 windows 上更改一个文件会触发多次同文件的 change，这里做一个筛选
                return hotData.changeFileInfo.filename != filename;
              // 正常进入
              this.reLodeCode(type, filename ?? '', _ele);
            },
          );
        } else {
          _p(
            brightYellowPen(
              `    ${_temp} 文件不存在，请查看配置文件中 watch 属性  ${_temp} 是否正确 `,
            ),
          );
        }
      }
    }
    return true;
  }
  /** 监听回到 */
  /** 热更新回调 */
  reLodeCode = throttle(
    (type: string, filename: string, watchTarget: string) => {
      //  设置更改文件信息，用于执行 `beforeRestart`
      hotData.changeFileInfo = { type, watchTarget, filename };
      const [time, day] = getTime();
      _p(
        '第'
          .concat(cyanPen((++hotData.count).toString()))
          .concat(greenPen('次加载'))
          .concat(redPen(time))
          .concat('-')
          .concat(yellowPen(day)),
      );
      this.run(false);
    },
    2000,
  );

  /** 配置文件发生变化 */
  configChange = throttle((type: string, fileName: string | null) => {
    if (!/hhf\.config\.(ts|js|json)/.test(fileName ?? '')) return;
    const [time] = getTime();
    _p(cyanPen(time).concat(greenPen('   配置文件更新')));
    this.run();
  }, 800);
}
