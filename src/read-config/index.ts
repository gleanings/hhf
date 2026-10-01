import { readFileSync } from 'node:fs';
import { fileExist, readFileToJsonSync } from '@vvi/node';
import { configFileStartName } from '../aided/config-file-start-name';
import { dog } from '../aided/dog';
import { hotData } from '../data-store';
import { getTextOfJsFile } from './get-text-of-fs-file';
import { readTsFile } from './read-ts-file';
import { ConfigOfFile } from './type';

/**      读取配置文件   */
export async function readConfig() {
  dog('读取配置文件');
  /** 查找文件的类型 */
  const config = ['ts', 'js', 'json'].find((currentEle: string) => {
    /** 设定临时值 */
    const _temporary = fileExist(`${configFileStartName}${currentEle}`);
    return _temporary && _temporary.isFile();
  });
  dog('读取配置文件的情况', config);
  // 如果没有配置文件文件
  if (!config) return null;
  hotData.configFileName = configFileStartName.concat(config);

  if (config === 'ts') {
    dog('ts 走这里');
    return await readTsFile();
  }
  if (config === 'js') {
    return await getTextOfJsFile(
      readFileSync(configFileStartName.concat(config)).toString(),
    );
  }
  return readFileToJsonSync<ConfigOfFile>(hotData.configFileName);
}
