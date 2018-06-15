import * as React from 'react';

import { AppState } from '../state';
import { Header } from './header';
import { Files } from './files';
import { Log } from './log';
import { LaunchDialog } from './launch-dialog';

export interface AppProps {
  appState: AppState;
}

/**
 * Everything above the editors, so buttons and the address bar.
 *
 * @class App
 * @extends {React.Component<AppProps, {}>}
 */
export class App extends React.Component<AppProps, {}> {
  public render() {
    return (
      <React.Fragment>
        <Header appState={this.props.appState} />
        <LaunchDialog appState={this.props.appState} />
        <section>
          <Files appState={this.props.appState} />
          <Log appState={this.props.appState} />
        </section>
      </React.Fragment>
    );
  }
}