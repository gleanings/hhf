import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { _p, fileExist } from '@vvi/node';
import { bluePen, yellowPen } from '@vvi/pen';
import { dog } from './aided/dog';
import { hotData } from './data-store';
const { stdin, stdout } = process;

/** 杀死那个进程 */
export async function killChild() {
  return new Promise<boolean>(resolve => {
    dog('清理子进程数据');
    // 清理父传子消息
    stdin.removeListener('data', parentToChild);
    // 清理子传父
    hotData?.childProcess?.stdout?.removeListener('data', childToParent);
    // 倘若有子程序 id
    if (hotData.childProcess && hotData.childProcess.pid) {
      const id: number = hotData.childProcess.pid;
      dog('将杀死的子进程的 id', id);
      /// 软关闭
      hotData.childProcess.kill('SIGTERM');
      // process.kill(id, 'SIGTERM');
      _p(`杀死进程 ${new Date().toTimeString()} `);
      setTimeout(() => {
        _p(`二次杀死子进程 ${new Date().toTimeString()} `);
        setTimeout(() => {
          /// 最后通牒
          // process.kill(id, 'SIGKILL');
          hotData.childProcess.kill('SIGKILL');
          resolve(true);
        }, 1200);
      }, 4000);
      hotData.childProcess.on('exit', (code, signal) => {
        dog('退出', code, signal);
        _p(`子进程退出 ${new Date().toTimeString()} `);
      });
    } else {
      resolve(false);
    }
  });
}

/** 创建子程序 */
export async function createChild() {
  let cwd = hotData.options.cwd;
  dog('构建新的子进程', cwd);
  dog('构建前参数为', hotData.options);
  const cwdExit = fileExist(cwd);
  if (!cwdExit || !cwdExit.isDirectory()) {
    dog.error('没有找到指定的文件目录');
    return _p(bluePen(`配置中 cwd（目录） :  ${yellowPen(cwd)} 不存在`));
  }

  cwd = resolve(process.cwd(), cwd);

  dog('构建玩成的目录为', cwd);
  try {
    hotData.childProcess = spawn(
      (hotData.options.code as string) || hotData.ls,
      [...hotData.options.args],
      {
        shell: true,
        cwd,
        stdio: ['pipe', 'pipe', 'pipe'],
        // stdio: [stdin, stdout, stderr],
      },
    );
    hotData.childProcess.stdout.on('data', childToParent);
    stdin.on('data', parentToChild);
  } catch (error) {
    _p(error);
    _p('\n 创建子线程失败');
  }
}
/**
 * 子进程向父进程写入
 * @param data
 */
function childToParent(data: Buffer) {
  stdout.write(data.toString());
}

/**
 * 父进程向子进程写入
 * @param data
 */
function parentToChild(data: Buffer) {
  hotData.childProcess.stdin.write(data.toString());
}
