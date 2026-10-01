import { pathJoin, writeJsonFileSync, getPackageJsonSync } from '@vvi/node';
import { isNull } from '@vvi/is';
import { dirname } from 'node:path';

const packageJsonResponse = getPackageJsonSync();

if (isNull(packageJsonResponse)) {
  throw new RangeError('未能识别配置文件 package.json');
}

let packageJson = packageJsonResponse.content;

const name = packageJson.name;
const email = 'Mr.MudBean@outlook.com';
const url = 'https://mudbean.cn';
const tag = 'gleanings';

[
  'scripts',
  'devDependencies',
  'lint-staged',
  'private',
  'dependencies',
  'overrides',
  'jja',
].forEach(key => delete packageJson[key]);

packageJson = {
  ...packageJson,
  author: {
    name: '泥豆君',
    email,
    url,
  },
  description: '一个简单的热启动',
  license: 'MIT',
  files: ['bin.js', 'LICENSE', 'README.md'],
  keywords: [name],
  homepage: `https://npms.${tag}.cn/${name}`,
  bugs: {
    url: `https://github.com/${tag}/${name}/issues`,
    email,
  },
  repository: {
    type: 'git',
    url: `git+https://github.com/${tag}/${name}.git`,
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
  bin: {
    hhf: 'bin.js',
  },
  engines: {
    // 新增：声明 Node.js 兼容版本
    node: '>=18.0.0',
  },
};

// 写入 dist/package.json
{
  writeJsonFileSync(
    pathJoin(dirname(packageJsonResponse.path), './dist/package.json'),
    packageJson,
  );
}
