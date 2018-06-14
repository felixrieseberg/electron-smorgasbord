import * as React from 'react';
import { render } from 'react-dom';
import { Toaster } from '@blueprintjs/core';

import { App } from './components/app';
import { appState } from './state';
import { Server } from './server';

/**
 * The top-level class controlling the whole app. This is *not* a React component,
 * but it does eventually render all components.
 *
 * @class App
 */
export class AppManager {
  public toaster = Toaster.create();
  public server = new Server();

  constructor() {
    this.setup();
  }

  /**
   * Initial setup call, loading Monaco and kicking off the React
   * render process.
   */
  public async setup(): Promise<void> {
    const app = (
      <div>
        <App appState={appState} />
      </div>
    );

    render(app, document.getElementById('container'));
  }
}

// tslint:disable-next-line:no-string-literal
window.ElectronUpdateTest = {
  app: new AppManager()
};
