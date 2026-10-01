// 创建实体对象
import { Args } from '@vvi/command';
import { CommandParam } from './type';

const command = new Args<CommandParam>('hhf');

command
  .bind([
    'base (watch 的相对路径)',
    'watch (监听的文件/夹)',
    'cwd (执行代码的目录)',
    'code (要执行的代码)',
    'skip (要跳过的文件)',
    'args (执行参数)',
  ])
  .bind({
    'init <i> (初始化一个配置文件（该命令与其他命令冲突）)': [
      'json   (初始化一个 JSON 格式的配置文件)',
      'ts <-t> (初始化一个 ts 格式的配置文件)',
      'js <-j> (初始化一个 js 格式的配置文件)',
    ],
  })
  .run();
// 倘若未执行完毕则直接退出
command.isEnd(true);

export { command };
