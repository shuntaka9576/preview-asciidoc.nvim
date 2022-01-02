import { attach, NeovimClient } from 'neovim';
import { Attach } from 'neovim/lib/attach/attach';

import { getModuleLogger } from '../util/logger';

const logger = getModuleLogger();

interface Action {
  openBrowser: (url: string, bufnr: number) => void;
  refreshContent: (bufnr: number) => void;
  refreshView: (bufnr: number, pos: number) => void;
}

export interface Plugin {
  init: (action: Action) => void;
  nvim: NeovimClient;
}

export async function createPlugin(options: Attach): Promise<Plugin> {
  const nvim: NeovimClient = attach(options);
  const channelId = await nvim.channelId;
  await nvim.setVar('padoc_node_channel_id', channelId);

  let action: Action;
  nvim.on('notification', async (method: string, args: any[]) => {
    const bufnr = await nvim.call('bufnr', '%');
    switch (method) {
      case 'open_browser':
        logger.debug(`call method: ${method}`);
        const host = await nvim.getVar('b:padoc_lunch_ip');
        const port = await nvim.getVar('b:padoc_lunch_port');

        action.openBrowser(`http://${host}:${port}/page/${bufnr}`, bufnr);
        break;
      case 'refresh_content':
        logger.debug(`call method: ${method}, bufnr: ${bufnr}`);
        action.refreshContent(bufnr);
        break;
      case 'refresh_view':
        const linecount = await nvim.call('line', '$');
        const currline = await nvim.call('line', '.');
        const pos = currline / linecount;

        logger.debug(`KELVE call method: ${method}, bufnr: ${args['bufnr']}`);
        logger.debug(`call method: ${method}, bufnr: ${bufnr}`);
        action.refreshView(bufnr, pos);
        break;
    }
  });

  return {
    init: (param: Action): void => {
      action = param;
    },
    nvim: nvim,
  };
}
