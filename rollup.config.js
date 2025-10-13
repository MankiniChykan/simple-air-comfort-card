import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';   // ← named export
import copy from 'rollup-plugin-copy';
import gzipPlugin from 'rollup-plugin-gzip';

export default {
  input: 'build/simple-air-comfort-card.js',
  output: {
    file: 'dist/simple-air-comfort-card.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve({ browser: true, extensions: ['.ts', '.js'] }),
    commonjs(),

    // Inject version + NODE_ENV
    replace({
      preventAssignment: true,
      values: {
        __VERSION__: JSON.stringify(process.env.npm_package_version),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      },
    }),

    // Copy static assets needed at runtime (do it early so gzip can see them)
    copy({
      targets: [{ src: 'src/assets/sac_background_overlay.svg', dest: 'dist' }],
      hook: 'buildStart',
      copyOnce: false,
      verbose: true,
    }),

    // Minify
    terser(),

    // Produce .gz alongside outputs (and for the copied SVG)
    gzipPlugin({
      filter: /\.(js|svg)$/i,
      additionalFiles: ['dist/sac_background_overlay.svg'],
      minSize: 0,
      fileName: (name) => `${name}.gz`,
    }),
  ],
};