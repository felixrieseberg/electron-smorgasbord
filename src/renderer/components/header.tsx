import * as React from 'react';
import { observer } from 'mobx-react';
import { Navbar, NavbarGroup, Button, NavbarHeading, Alignment, ButtonGroup } from '@blueprintjs/core';

import { AppState } from '../state';

export interface HeaderProps {
  appState: AppState;
}

/**
 * Everything above the editors, so buttons and the address bar.
 *
 * @class Header
 * @extends {React.Component<HeaderProps, {}>}
 */
@observer
export class Header extends React.Component<HeaderProps, {}> {
  constructor(props: HeaderProps) {
    super(props);

    this.handleServerChange = this.handleServerChange.bind(this);
  }

  public handleServerChange() {
    this.props.appState.toggleServer();
  }

  public render() {
    const { isServerRunning, fileReleasesContent } = this.props.appState;
    const serverIcon = isServerRunning ? 'feed-subscribed' : 'feed';

    return (
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>Update Tester</NavbarHeading>
          <input readOnly={true} className='pt-input' value='http://localhost:3000' type='text' />
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <ButtonGroup large={false}>
            <Button
              active={isServerRunning}
              icon={serverIcon}
              disabled={!fileReleasesContent}
              onClick={this.handleServerChange}
            >
              Serve Updates
            </Button>
          </ButtonGroup>
        </NavbarGroup>
      </Navbar>
    );
  }
}