import * as http from 'http';

import socketio from 'socket.io';

import { getModuleLogger } from './util/logger';
import { initPlugin } from './nvim';
import { openBrowser } from './util/open-browser';
import { routes } from './route';
import { buildAdoc } from './util/adoc';

const logger = getModuleLogger();

const main = async (): Promise<void> => {
  const server = http.createServer((req, res) => {
    logger.debug(`req.url: ${req.url}`);
    routes(req, res);
  });

  const plugin = await initPlugin();

  const host = await (async (): Promise<string> => {
    const defaultHost = '127.0.0.1';
    const ip = (await plugin.nvim.getVar('pswag_lunch_ip')) as string;
    return ip ? ip : defaultHost;
  })();
  await plugin.nvim.setVar('b:padoc_lunch_ip', host);

  const port = await (async (): Promise<number> => {
    const defaultPort = 9136;
    const port = (await plugin.nvim.getVar('pswag_lunch_port')) as number;
    return port ? port : defaultPort;
  })();
  await plugin.nvim.setVar('b:padoc_lunch_port', port);

  const pluginPath = (await plugin.nvim.getVar('padoc_root_dir')) as string;
  const connections: { [key: number]: string[] } = {};

  const io = socketio(server);
  io.on('connection', async socket => {
    logger.debug('user connected');
    const bufnr = (await plugin.nvim.call('bufnr', '%')) as number;
    connections[bufnr]
      ? connections[bufnr].push(socket.id)
      : (connections[bufnr] = [socket.id]);

    logger.debug(`connected: ${JSON.stringify(connections)}`);
    if (!connections[bufnr]) connections[bufnr] = [];

    logger.debug(`connections: ${JSON.stringify(connections)}`);
    await plugin.nvim.setVar('b:padoc_command_exsits', false);
    await plugin.nvim.call('padoc#rpc#refresh_content');

    socket.on('disconnect', () => {
      logger.debug('user disconnected');
    });
  });

  server.listen(
    port,
    host,
    async (): Promise<void> => {
      plugin.init({
        openBrowser: async url => {
          openBrowser(url);
        },
        refreshContent: async bufnr => {
          logger.debug(`start refreshContent`);
          const bufferRows = await plugin.nvim.buffer.getLines();

          const padocCommandExsits = await plugin.nvim.getVar(
            'b:padoc_command_exsits',
          );
          logger.debug(`padocCommandExsits: ${padocCommandExsits}`);
          if (padocCommandExsits) {
            logger.debug(`command exsits skip exec command process`);
            return;
          }

          logger.debug(`exec command process`);
          const content = await buildAdoc(pluginPath, bufferRows, plugin.nvim);

          logger.debug(`emit refresh_content`);
          connections[bufnr].forEach(id => {
            io.to(id).emit('refresh_content', content.toString());
          });
        },
      });

      plugin.nvim.call('padoc#rpc#open_browser');
    },
  );
};

main()
  .then(() => console.log('Success'))
  .catch(err => console.log(`Error!: ${err}`));
