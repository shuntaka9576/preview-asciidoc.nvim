import { attach, NeovimClient } from 'neovim';
import { Attach } from 'neovim/lib/attach/attach';

import { getModuleLogger } from '../util/logger';

const logger = getModuleLogger();

interface Action {
  openBrowser: (url: string, bufnr: number) => void;
  refreshContent: (bufnr: number) => void;
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
    if (method === 'open_browser') {
      logger.debug(`call method: ${method}`);
      const host = await nvim.getVar('b:padoc_lunch_ip');
      const port = await nvim.getVar('b:padoc_lunch_port');
      const bufnr = await nvim.call('bufnr', '%');

      action.openBrowser(`http://${host}:${port}/page/${bufnr}`, bufnr);
    } else if (method === 'refresh_content') {
      const bufnr = await nvim.call('bufnr', '%');
      logger.debug(`call method: ${method}, bufnr: ${bufnr}`);
      action.refreshContent(bufnr);
    }
  });

  return {
    init: (param: Action): void => {
      action = param;
    },
    nvim: nvim,
  };
}
