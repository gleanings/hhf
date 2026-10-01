import { question } from '@vvi/command';
import { _p, fileExist } from '@vvi/node';

import { configFileStartName } from '../aided/config-file-start-name';
import { createConfigFile } from './create-config-file';

/** 没有指定配置文件类型  */
export async function noExtension() {
  const isExist = ['json', 'js', 'ts'].find((currentEle: string) => {
    const fileName = `${configFileStartName}${currentEle}`,
      fileInfo = fileExist(fileName);
    return fileInfo && fileInfo?.isFile();
  });

  if (isExist) {
    const tip = ['覆盖', '退出'];
    const result = await question({
      text: '配置文件已存在 ，是否覆盖',
      tip,
      private: true,
    });
    /** 判断是否选择覆盖 */
    if (result == tip[0]) {
      return createConfigFile(isExist);
    }
    _p('好的，即将退出');
    return setTimeout(() => process.exit(), 800);
  }

  const tip = ['json', 'js', 'ts', '退出'];

  const result = await question({
    text: '请选择您想初始化的配置文件类型',
    tip,
    resultText: '这一行不该有呀',
    private: true,
  });
  if (result != tip[3]) {
    createConfigFile(result as string);
    return;
  }
  _p('好的，即将退出');
  setTimeout(() => process.exit(), 800);
  return;
}
