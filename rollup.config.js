import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/simple-air-comfort-card.js',
  output: {
    file: 'dist/simple-air-comfort-card.js',
    format: 'esm'
  },
  plugins: [
    resolve(),
    commonjs(),
    terser()
  ]
};
