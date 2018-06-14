import { observable, action } from 'mobx';

/**
 * The application's state. Exported as a singleton below.
 *
 * @export
 * @class AppState
 */
export class AppState {
  @observable public isServerRunning: boolean = false;
  @observable public fileReleasesContent: string | null = null;
  @observable public fileReleasesPath: string | null = null;
  @observable public serverLog: string = '';

  private isListeningToServer = false;

  constructor() {
    this.toggleServer = this.toggleServer.bind(this);
    this.log = this.log.bind(this);
  }

  @action public log(message: string) {
    this.serverLog += `${message}\n`;
  }

  @action public toggleServer() {
    this.isServerRunning = !this.isServerRunning;

    const { toaster } = window.ElectronUpdateTest.app;

    if (!this.isListeningToServer) {
      this.attachToServer();
    }

    if (this.isServerRunning) {
      window.ElectronUpdateTest.app.server.releasesFilePath = this.fileReleasesPath;
      window.ElectronUpdateTest.app.server.start();
      toaster.show({
        message: 'Update server started',
        icon: 'play',
        timeout: 2000
      });
    } else {
      toaster.show({
        message: 'Update server stopped',
        icon: 'stop',
        timeout: 2000
      });
    }
  }

  private attachToServer() {
    this.isListeningToServer = true;
    window.ElectronUpdateTest.app.server.on('message', this.log);
  }
}

export const appState = new AppState();
