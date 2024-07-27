import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-ts';
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';
import { terser } from 'rollup-plugin-terser';

function retainImports() {
  return {
    name: 'retain-import-expression',
    resolveDynamicImport() {
      return false;
    },
    renderDynamicImport() {
      return {
        left: 'import(',
        right: ')'
      };
    }
  };
}

export default [
  {
    input: 'src/utils/index.ts',
    output: [
      {
        dir: 'utils/es',
        format: 'es',
        entryFileNames: '[name].mjs'
      },
      {
        dir: 'utils/cjs',
        format: 'cjs',
        entryFileNames: '[name].cjs'
      }
    ],
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      typescript(),
      terser()
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        dir: '.',
        format: 'cjs'
      },
    ],
    plugins: [
      resolve(),
      typescript({ outDir: '.' }),
      commonjs({ ignoreDynamicRequires: true }),
      retainImports(),
      preserveShebangs()
    ]
  },
  {
    input: '@types/pollen.ts',
    output: {
      file: 'index.d.ts',
      format: 'es'
    },
    plugins: [resolve({ extensions: ['.ts'] }), typescript({ outDir: '.' })]
  }
];
