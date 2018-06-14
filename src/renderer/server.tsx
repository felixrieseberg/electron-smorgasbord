import * as Koa from 'koa';
import * as path from 'path';
import * as send from 'koa-send';
import { EventEmitter } from 'events';

export class Server extends EventEmitter {
  public app = new Koa();
  public isServing = false;
  public isStarted = false;
  public port = 3000;
  public releasesFilePath: string | null;

  constructor() {
    super();

    this.handleRequest = this.handleRequest.bind(this);
    this.app.use(this.handleRequest);
  }

  public start() {
    if (!this.isStarted) {
      this.app.listen(this.port);
    }

    this.emit('message', `Now listening on http://localhost:3000`);
    this.isServing = true;
  }

  public stop() {
    this.emit('message', `Still listening, but no longer serving.`);
  }

  public async handleRequest(ctx: Koa.Context) {
    this.emit('message', `Request: ${ctx.req.url}`);

    if (!this.releasesFilePath) return;

    const root = path.dirname(this.releasesFilePath);
    await send(ctx, ctx.path, { root });
  }
}
