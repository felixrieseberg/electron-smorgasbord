import { observable, action } from 'mobx';

/**
 * The application's state. Exported as a singleton below.
 *
 * @export
 * @class AppState
 */
export class AppState {
  @observable public isServerRunning: boolean = false;
  @observable public isLaunchDialogVisible: boolean = false;
  @observable public fileReleasesContent: string | null = null;
  @observable public fileReleasesPath: string | null = null;
  @observable public serverLog: string = '';
  @observable public appLog: string = '';

  private isListeningToServer = false;

  constructor() {
    this.toggleServer = this.toggleServer.bind(this);
    this.logServer = this.logServer.bind(this);
    this.logApp = this.logApp.bind(this);
  }

  @action public logServer(message: Buffer | string) {
    if (!message.toString().trim()) return;
    this.serverLog += `${message.toString().trim()}\n`;
  }

  @action public logApp(message: Buffer | string) {
    if (!message.toString().trim()) return;
    this.appLog += `${message.toString().trim()}\n`;
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

  @action public toggleLaunchDialog() {
    this.isLaunchDialogVisible = !this.isLaunchDialogVisible;
  }

  private attachToServer() {
    this.isListeningToServer = true;
    window.ElectronUpdateTest.app.server.on('message', this.logServer);
  }
}

export const appState = new AppState();
