# Electron Smörgåsbord

Smörgåsbord is an app containing an update server compatible with
[Squirrel](https://github.com/Squirrel/), the automatic updater used by Electron.
It allows you to test the update flow of your Electron app in detail.

> :warning: This app is still under development. Proceed with care.

## Screenshot
![](https://user-images.githubusercontent.com/1426799/41464006-dc8d1e84-7098-11e8-85fe-fce6eb978cee.gif)

## Assumptions & Prerequisites
 * Your application's `autoUpdater` needs to use an URL that is overridable with an environment variable.
 * Your `autoUpdater` does not expect fancy paths and instead requests simple files only.

## License
MIT, please see LICENSE.md for details.
