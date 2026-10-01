import {
  isArray,
  isEmptyObject,
  isNull,
  isPlainObject,
  isString,
  isUndefined,
} from '@vvi/is';
import { _p } from '@vvi/node';
import { bluePen } from '@vvi/pen';
import { enArr } from '@vvi/utils';
import { dog } from './aided/dog';
import { hotData } from './data-store';
import { DefineOptions } from './data-store/type';
import { readConfig } from './read-config';

/** 获取自定义配置，这里对用户的自定义配置文件的内容进行处理 */
export async function initOptions() {
  /** 读取配置文件 */
  const op = await readConfig();

  dog('解析后的配置文件的数据', op);
  /**  原始设定默认值的默认参数对象  */
  const defaultOption: DefineOptions = {
    base: '',
    cwd: process.cwd(),
    watch: ['.'],
    skip: [],
    remove: true,
    code: '',
    args: [],
    beforeRestart: {},
  };
  /** 获取配置文件 */
  if (isNull(op) || isEmptyObject(op)) {
    setOptionsData(defaultOption);

    return _p(bluePen('未找到您的配置文件，启动默认配置'));
  }

  // 处理 watch 监听者
  defaultOption.watch = [...op.watch];

  // 处理 skip 跳过者
  if (isArray(op.skip)) {
    defaultOption.skip = op.skip.concat(hotData.configFileName);
  }

  // 处理执行 code 与执行参数 args
  if (isString(op.code)) {
    /**  临时变量，处理执行的代码  */
    const _temp = op.code
      ? op.code
          .trim()
          .replace(/\s{2,}/gm, ' ')
          .split(' ')
      : [];
    let __temp: string[];
    [defaultOption.code, ...__temp] = _temp;
    defaultOption.args = op.args ? __temp.concat(op.args) : __temp;
  }
  // 处理执行的基础目录
  if (isString(op.base)) {
    defaultOption.base = op.base;
  }

  if (isPlainObject(op.beforeRestart) && !isEmptyObject(op.beforeRestart)) {
    for (const key in op.beforeRestart)
      defaultOption.beforeRestart[key] = op.beforeRestart[key];
  }

  setOptionsData(defaultOption);
  // 整理数据
  hotData.manage();
  return true;
}

/**
 *  设置配置参数的数据
 * @param defaultOption
 */
function setOptionsData(defaultOption: DefineOptions) {
  if (isUndefined(hotData.options)) {
    hotData.options = {} as DefineOptions;
  }
  const { options, initArg } = hotData;

  dog('混合值开始', options, initArg, defaultOption);
  options.args = enArr.union(initArg.args, defaultOption.args);
  options.base = initArg.base || defaultOption.base;
  options.beforeRestart = {
    ...defaultOption.beforeRestart,
    ...initArg.beforeRestart,
  };
  options.code = initArg.code || defaultOption.code;
  options.cwd = initArg.cwd || defaultOption.cwd;
  options.skip = enArr.union(initArg.skip, defaultOption.skip);
  options.watch = enArr.union(hotData.initArg.watch, defaultOption.watch);
  dog('混合值结束');
}
