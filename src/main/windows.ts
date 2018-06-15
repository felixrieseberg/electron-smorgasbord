import { WindowNames } from '../interfaces';
import { BrowserWindow } from 'electron';

// Keep a global reference of the window objects, if we don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
export const browserWindows: Record<WindowNames, Electron.BrowserWindow | null> = {
  main: null
};

/**
 * Gets default options for the main window
 *
 * @returns {Electron.BrowserWindowConstructorOptions}
 */
export function getMainWindowOptions(): Electron.BrowserWindowConstructorOptions {
  return {
    width: 800,
    height: 800,
    minWidth: 500
  };
}

/**
 * Gets or creates the main window, returning it in both cases.
 *
 * @returns {Electron.BrowserWindow}
 */
export function getOrCreateMainWindow(): Electron.BrowserWindow {
  if (browserWindows.main) return browserWindows.main;

  browserWindows.main = new BrowserWindow(getMainWindowOptions());
  browserWindows.main.loadFile('./static/index.html');

  browserWindows.main.on('closed', () => {
    browserWindows.main = null;
  });

  return browserWindows.main;
}
