import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/simple-air-comfort-card.js',
  output: {
    file: 'dist/simple-air-comfort-card.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    terser()
  ]
};
