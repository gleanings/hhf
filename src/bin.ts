#! /usr/bin/env node
import { _p } from '@vvi/node';
import { command } from './aided/command';
import { dog } from './aided/dog';
import { HotDevelop } from './hot-class';
import { initConfig } from './init/index';

const { stdin } = process;

try {
  // 获取用户输入参数

  // 获取 JSON 格式的参数
  const argMap = command.args.$map;

  if (argMap.init) {
    // 只打包 es module ，所以在顶端运用了 await
    await initConfig(argMap.init);
  } else {
    dog('非初始化配置文件');
    new HotDevelop(argMap);
    // 保持主线程活跃
    stdin.on('data', () => null);
  }
} catch (error) {
  dog.error('出现全局未捕获错误，现抛出', error);
  _p('出现异常，请重试');
  _p(error);
}
