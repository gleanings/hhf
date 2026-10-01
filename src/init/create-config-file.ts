import { pathBasename } from '@vvi/node';
import { createJsConfigFile } from './create-js-config';
import { createJsonConfigFile } from './create-json-config';
import { createTsConfigFile } from './create-ts-config';

const initData = {
  cwd: pathBasename(process.cwd()),
};
/**
 * 根据后缀调用相关的创建配置文件
 * @param extension
 */
export function createConfigFile(extension: string = 'json') {
  const { cwd } = initData;
  switch (extension) {
    case 'ts':
      return createTsConfigFile(cwd);
    case 'js':
      return createJsConfigFile(cwd);
    default:
      return createJsonConfigFile(cwd);
  }
}
