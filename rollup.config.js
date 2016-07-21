import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies || {});

export default {
  entry: 'build/kobservable.js',
  exports: 'named',
  plugins: [babel(babelrc())],
  external: external,
  targets: [
    {
      dest: pkg['main'],
      format: 'umd',
      moduleName: 'kobservable',
      sourceMap: true
    },
    {
      dest: pkg['jsnext:main'],
      format: 'es6',
      sourceMap: true
    }
  ]
};