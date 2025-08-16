import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import gzipPlugin from 'rollup-plugin-gzip';

export default {
  input: 'src/simple-air-comfort-card.js',
  output: {
    file: 'dist/simple-air-comfort-card.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),

    // Copy static assets needed at runtime
    copy({
      targets: [
        { src: 'src/assets/sac_background_overlay.svg', dest: 'dist' },
      ],
      hook: 'buildStart', // ensure it exists before gzip runs
      copyOnce: false,
      verbose: true,
    }),

    // Minify
    terser(),

    // Produce .gz alongside outputs (and for the copied SVG)
    gzipPlugin({
      filter: /\.(js|svg)$/i,
      additionalFiles: ['dist/sac_background_overlay.svg'],
      minSize: 0, // always gzip
      fileName: (name) => `${name}.gz`,
    }),
  ],
};
