import * as childProcess from 'child_process';

export class OpenBrowserError extends Error {
  public constructor() {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OpenBrowserError);
    }
    this.name = this.constructor.name;
  }
}

export class OpenBrowserUnsupportedPlatformError extends OpenBrowserError {
  public constructor(platform: string) {
    super();
    this.message = platform;
    this.name = this.constructor.name;
  }
}

export async function openBrowser(url: string): Promise<void> {
  const platform = process.platform;
  const args = [];
  args.push(url);

  let executeCmd = '';
  switch (platform) {
    case 'darwin':
      executeCmd = 'open';
      break;
    case 'linux':
      executeCmd = 'xdg-open';
      break;
    default:
      throw new OpenBrowserUnsupportedPlatformError(platform);
  }

  childProcess.spawn(executeCmd, args, {
    detached: true,
  });
}
