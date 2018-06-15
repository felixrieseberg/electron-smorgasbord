/* tslint:disable */

module.exports = {
  hooks: {
    generateAssets: require('./tools/generateAssets')
  },
  packagerConfig: {
    name: 'Smorgasbord',
    executableName: 'Smorgasbord'
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      platforms: ["win32"],
      config: {
        name: "Smorgasbord",
        certificateFile: process.env.WINDOWS_CODESIGN_CERTIFICATE,
        certificatePassword: process.env.WINDOWS_CODESIGN_PASSWORD
      }
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"]
    }
  ]
};
