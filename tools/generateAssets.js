/* tslint:disable */

const { generateTypeScript } = require('./tsc');

module.exports = async () => {
  await generateTypeScript();
}
