import { writeJsonFileSync } from '@vvi/node';
import { configFileStartName } from '../aided/config-file-start-name';

/**
 * 新增配置文件
 * @param cwd
 */
export function createJsonConfigFile(cwd: string) {
  writeJsonFileSync(configFileStartName + 'json', {
    base: '..',
    watch: ['${cwd}'],
    skip: ['dist', '.eg'],
    cwd: '.',
    code: 'node  ./index.js',
    args: ['-v'],
    beforeRestart: Object.fromEntries([[cwd, 'npm run build']]),
  });
}
