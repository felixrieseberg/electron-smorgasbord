import { AppManager } from './renderer/app-manager';

export interface StringMap<T> {
  [x: string]: T;
}

export type WindowNames = 'main';

declare global {
  interface Window {
    ElectronUpdateTest: {
      app: AppManager;
    };
  }
}
