import { getModuleLogger } from './util/logger';
import { createPlugin, Plugin } from './attach';

const address = process.env.NVIM_LISTEN_ADDRESS || '/tmp/nvim';
const logger = getModuleLogger();

export async function initPlugin(): Promise<Plugin> {
  const plugin: Plugin = await createPlugin({
    socket: address,
  });

  const MSG_PREFIX = '[padoc.vim]';

  process.on('uncaughtException', function(err) {
    const msg = `${MSG_PREFIX} uncaught exception: ` + err.stack;
    if (plugin.nvim) {
      plugin.nvim.call('padoc#util#echo_messages', ['Error', msg.split('\n')]);
    }
    logger.error('uncaughtException', err.stack);
  });
  process.on('unhandledRejection', function(reason, p) {
    if (plugin.nvim) {
      plugin.nvim.call('padoc#util#echo_messages', [
        'Error',
        [`${MSG_PREFIX} UnhandledRejection`, `${reason}`],
      ]);
    }
    logger.error('unhandledRejection ', p, reason);
  });

  return plugin;
}
