import * as path from 'path';
import * as childProcess from 'child_process';

import * as fs from 'fs-extra';
import { Neovim } from 'neovim';

import { getModuleLogger } from '../util/logger';

export async function buildAdoc(
  outDir: string,
  bufferRows: string[],
  nvim: Neovim,
): Promise<string> {
  const logger = getModuleLogger();

  await nvim.setVar('b:padoc_command_exsits', true);

  const imagesDir = path.join(outDir, 'preview', 'images');
  if (!fs.pathExistsSync(imagesDir)) fs.mkdirpSync(imagesDir);

  const defaultCmd = 'asciidoctor -r asciidoctor-diagram';
  let buildCmd = await nvim.getVar('g:padoc_build_command');
  if (!buildCmd) buildCmd = defaultCmd;

  const bufferContent = bufferRows.join('\n');

  const executeCmd = `echo '${bufferContent}' | ${buildCmd} -a imagesoutdir=${imagesDir} -o - -`;

  logger.debug(`buildCmd: ${buildCmd}`);
  const execAdoc = (): Promise<string> => {
    return new Promise(resolve => {
      childProcess.exec(executeCmd, (error, stdout, stderr) => {
        resolve(stdout);
      });
    });
  };
  const content = await execAdoc();

  await nvim.setVar('b:padoc_command_exsits', false);

  return content;
}
