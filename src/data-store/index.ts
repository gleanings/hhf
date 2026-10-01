import { ChildProcessWithoutNullStreams } from 'child_process';
import { FSWatcher } from 'node:fs';
import { ArgsMap } from '@vvi/command';
import { isArray, isString, typeOf } from '@vvi/is';
import { isWindows } from '@vvi/node';
import { CommandParam } from '../aided/type';
import { DefineOptions } from './type';
/**
 * 初始化的参数们
 */
const initArg: DefineOptions = {
  args: [],
  skip: [],
  code: '',
  watch: [],
  cwd: '',
  base: '',
  remove: false,
  beforeRestart: {},
};
/**  数据  */
class HotData {
  /** 这会是否正在更新 */
  restart: boolean = false;

  /** 初始化的参数们
   *
   * 该值的初始化在 [主文件](./hot.ts)
   */
  get initArg(): DefineOptions {
    return initArg;
  }

  /**  设置初始化参数  */
  set initArg(v: ArgsMap<CommandParam>) {
    initArgData(v);
  }

  /** 展示目录  */
  get ls(): string {
    return isWindows ? 'dir' : 'ls';
  }

  /** 计数  */
  count: number = 0;

  /** 配置文件名称 */
  configFileName = '';
  /** 改变的信息
   *
   * 该属性主要存在于 [主文件](./hot.ts)
   *
   * 用于储存当前更新的文件，用于在 [更新前处理文件](beforeRestart.ts) 使用
   */
  changeFileInfo = {
    /** 被监听者 */
    watchTarget: '',
    /** 更改的具体文件 */
    filename: '',
    /** 更改的类型 */
    type: '',
  };
  /** 开启的子线程
   *
   *
   * 该属性主要操作存在于 [子线程管理文件](./childManage.ts) 中进行操作
   */
  childProcess!: ChildProcessWithoutNullStreams;
  childList!: ChildProcessWithoutNullStreams[];
  /** 配置信息
   *
   *  该属性会在 [初始化配置文件](./initOptions.ts)中进行赋值
   */
  options!: DefineOptions;
  /**   监听者们
   *
   *  由于之前疏忽于监听文件的监听未释放问题，可能会导致内存泄漏，
   * 现设置监听者，在监听者发生变更时触发进行清理与避免已监听文件的重复监听
   */
  listeners: { [key: string]: FSWatcher } = {};
  /**
   * 退出的时间
   *
   * 用于检测是否为连续点击 Ctrl + C
   *
   * 以在下次点击时退出程序
   *
   */
  existTime: number = Date.now();

  /** 整理数据  */
  manage() {
    Object.defineProperties(this, {
      options: {
        value: this.options,
        writable: true,
        enumerable: false,
        configurable: false,
      },
      childProcess: {
        value: this.childProcess,
        writable: true,
        enumerable: false,
        configurable: false,
      },
    });
  }
}

/**
 * 初始化初始化数据
 * @param v
 */
function initArgData(v: ArgsMap<CommandParam>) {
  if (typeOf(v) != 'object') return;

  if (isString(v.base)) {
    initArg.base = v.base;
  }
  if (isString(v.cwd)) {
    initArg.cwd = v.cwd;
  }
  if (isArray(v.watch)) {
    initArg.watch = v.watch;
  }
  if (isString(v.watch)) {
    initArg.watch = [v.watch];
  }
  if (isString(v.code)) {
    initArg.code = v.code;
  }
  if (isString(v.skip)) {
    v.skip = [v.skip];
  }
  if (isArray(v.skip)) {
    initArg.skip = [...v.skip];
  }

  if (isString(v.args)) {
    v.args = [v.args];
  }

  if (isArray(v.args)) {
    initArg.args = [...v.args];
  }
}

export const hotData = new HotData();
