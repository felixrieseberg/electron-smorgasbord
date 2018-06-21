import * as React from 'react';
import { observer } from 'mobx-react';
import { spawn } from 'child_process';
import * as path from 'path';
import { Dialog, Button, Intent, InputGroup, ControlGroup, FormGroup, FileInput } from '@blueprintjs/core';

import { AppState } from '../state';
import { StringMap } from '../../interfaces';
import { originalEnv } from '../constants';

export interface LaunchDialogProps {
  appState: AppState;
}

export interface LaunchDialogState {
  additionalVariables: StringMap<any>;
  appPath: string | null;
  newKey: string | null;
  newValue: string | null;
}

/**
 * Everything above the editors, so buttons and the address bar.
 *
 * @class LaunchDialog
 * @extends {React.Component<LaunchDialogProps, LaunchDialogState>}
 */
@observer
export class LaunchDialog extends React.Component<LaunchDialogProps, LaunchDialogState> {
  constructor(props: LaunchDialogProps) {
    super(props);

    this.state = {
      additionalVariables: {},
      appPath: null,
      newKey: null,
      newValue: null,
    };

    this.toggleDialog = this.toggleDialog.bind(this);
    this.handleLaunch = this.handleLaunch.bind(this);
    this.handleAppChange = this.handleAppChange.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleAddVariable = this.handleAddVariable.bind(this);
  }

  public toggleDialog() {
    this.props.appState.toggleLaunchDialog();
  }

  public handleLaunch() {
    const { additionalVariables } = this.state;
    const { toaster } = window.ElectronUpdateTest.app;
    let { appPath } = this.state;

    if (!appPath) return;

    // Extend the app path to the binary executable if the app bundle is selected
    if (process.platform === 'darwin' && path.extname(appPath) === '.app')
      appPath = path.join(appPath, 'Contents', 'MacOS', path.basename(appPath, '.app'));

    process.env = { ...originalEnv, ...additionalVariables };

    const child = spawn(appPath, undefined, {
      env: { ...process.env, ...additionalVariables }
    });

    child.stdout.on('data', this.props.appState.logApp);
    child.stderr.on('data', this.props.appState.logApp);

    child.on('close', (code) => {
      this.props.appState.logApp(`Process exited with code ${code}`);
    });

    this.toggleDialog();
    toaster.show({
      message: 'App started!',
      icon: 'application'
    });
  }

  public handleAppChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const filePath = file.path;

    this.setState({ appPath: filePath });
  }

  public handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newKey: event.target.value });
  }

  public handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newValue: event.target.value });
  }

  public handleAddVariable() {
    const { newKey, newValue, additionalVariables } = this.state;
    const hasValueAndKey = !!(newKey && newValue);

    if (hasValueAndKey) {
      const newEnv = {};
      newEnv[newKey!] = newValue;

      this.setState({
        additionalVariables: { ...additionalVariables, ...newEnv }
      });
    }
  }

  public renderExistingEnvironmentVariables(): JSX.Element {
    const { additionalVariables } = this.state;

    const divider = Object.keys(additionalVariables).length > 0
      ? <hr />
      : null;
    const elements = Object.keys(additionalVariables).map((key) => {
      const handleRemove = () => {
        const newAdditionalVariables = { ...additionalVariables };
        delete newAdditionalVariables[key];

        this.setState({
          additionalVariables: newAdditionalVariables
        });
      };

      return (
        <React.Fragment key={key}>
          <ControlGroup fill={true} vertical={false}>
            <InputGroup
              placeholder='Key'
              value={key}
              onChange={this.handleKeyChange}
            />
            <InputGroup
              placeholder='Value'
              value={additionalVariables[key]}
              onChange={this.handleValueChange}
            />
            <Button icon='remove' onClick={handleRemove}>Remove</Button>
          </ControlGroup>
        </React.Fragment>
      );
    });

    return (
      <React.Fragment>
        {divider}
        {...elements}
      </React.Fragment>
    );
  }

  public renderEnvironmentVariables(): JSX.Element {
    const { newKey, newValue } = this.state;
    const hasValueAndKey = !!(newKey && newValue);

    return (
      <React.Fragment>
        <ControlGroup fill={true} vertical={false}>
          <InputGroup
            placeholder='Key'
            value={newKey || ''}
            onChange={this.handleKeyChange}
          />
          <InputGroup
            placeholder='Value'
            value={newValue || ''}
            onChange={this.handleValueChange}
          />
          <Button
            icon='add'
            disabled={!hasValueAndKey}
            onClick={this.handleAddVariable}
          >Add
          </Button>
        </ControlGroup>
      </React.Fragment>
    );
  }

  public render() {
    const { appPath } = this.state;
    const { isLaunchDialogVisible } = this.props.appState;

    return (
      <Dialog
        icon='application'
        isOpen={isLaunchDialogVisible}
        onClose={this.toggleDialog}
        title='Launch Application'
      >
          <div className='pt-dialog-body'>
            <h3>App</h3>
              <FormGroup
                helperText={`Select the app to run. `}
                labelFor='app-input'
              >
                <FileInput
                  id='app-input'
                  large={true}
                  fill={true}
                  text={appPath || 'None'}
                  onInputChange={this.handleAppChange}
                />
              </FormGroup>
            <hr />
            <h3>Additional Environment Variables</h3>
            {this.renderEnvironmentVariables()}
            {this.renderExistingEnvironmentVariables()}
          </div>
          <div className='pt-dialog-footer'>
            <div className='pt-dialog-footer-actions'>
              <Button text='Close' onClick={this.toggleDialog} />
              <Button
                  intent={Intent.PRIMARY}
                  onClick={this.handleLaunch}
                  text='Launch'
              />
            </div>
          </div>
      </Dialog>
    );
  }
}