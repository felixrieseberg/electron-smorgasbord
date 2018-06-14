import * as React from 'react';
import * as fs from 'fs-extra';
import { observer } from 'mobx-react';
import { FileInput, FormGroup } from '@blueprintjs/core';

import { AppState } from '../state';
import { releasesFile } from '../constants';

export interface FilesProps {
  appState: AppState;
}

/**
 * Everything above the editors, so buttons and the address bar.
 *
 * @class Files
 * @extends {React.Component<FilesProps, {}>}
 */
@observer
export class Files extends React.Component<FilesProps, {}> {
  constructor(props: FilesProps) {
    super(props);

    this.handleReleasesChange = this.handleReleasesChange.bind(this);
  }

  public async handleReleasesChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const filePath = file.path;
    const fileContent = await fs.readFile(filePath, 'utf-8');

    this.props.appState.fileReleasesPath = filePath;
    this.props.appState.fileReleasesContent = fileContent;
  }

  public renderPreview(content: string | null) {
    if (!content) return null;

    return (
      <React.Fragment>
        <pre>{content}</pre>
      </React.Fragment>
    );
  }

  public render() {
    const { fileReleasesPath, fileReleasesContent, isServerRunning } = this.props.appState;

    return (
      <div>
        <h3>Configuration</h3>
        <FormGroup
          helperText={`Select the ${releasesFile} file to use. `}
          label={`${releasesFile} file`}
          labelFor='releases-input'
          disabled={isServerRunning}
        >
          <FileInput
            id='releases-input'
            large={true}
            fill={true}
            disabled={isServerRunning}
            text={fileReleasesPath || 'None'}
            onInputChange={this.handleReleasesChange}
          />
          {this.renderPreview(fileReleasesContent)}
        </FormGroup>
      </div>
    );
  }
}