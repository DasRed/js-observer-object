import resolve from 'rollup-plugin-node-resolve';
import progress from 'rollup-plugin-progress';
import babel from 'rollup-plugin-babel';
import {terser} from "rollup-plugin-terser";
import clear from "rollup-plugin-clear";

const progressOptions = {clearLine: false};

const babelOptionsES2015 = {
    runtimeHelpers:  false,
    externalHelpers: false,
    babelrc:         false,
    presets:         [
        [
            "@babel/env",
            {
                targets: {
                    ie:      '11',
                    edge:    '17',
                    firefox: '60',
                    chrome:  '71',
                    safari:  '11.1',
                },
            }
        ]
    ],
    plugins:         [
        ["@babel/plugin-proposal-class-properties", {loose: true}]
    ]
};

const babelOptionsES2018 = {
    runtimeHelpers:  false,
    externalHelpers: false,
    babelrc:         false,
    plugins:         [
        ["@babel/plugin-proposal-class-properties", {loose: true}]
    ]
};

const terserOptions = {sourcemap: true};

// https://rollupjs.org/guide/en#big-list-of-options
export default [
    // ES2015 Minified
    {
        input:   './src/index.js',
        output:  {
            file:      './dist/observer.min.js',
            format:    'umd',
            name:      'ObjectObserver',
            compact:   true,
            sourcemap: true,
        },
        plugins: [
            resolve(),
            clear({targets: ['./dist']}),
            progress(progressOptions),
            babel(babelOptionsES2015),
            terser(terserOptions),
        ]
    },
    // ES2015 None-Minified
    {
        input:   './src/index.js',
        output:  {
            file:      './dist/observer.js',
            format:    'umd',
            name:      'ObjectObserver',
            compact:   false,
            sourcemap: true,
        },
        plugins: [
            resolve(),
            progress(progressOptions),
            babel(babelOptionsES2015),
        ]
    },
    // ES Modules Minified
    {
        input:   './src/index.js',
        output:  {
            file:      './dist/observer.esm.min.js',
            format:    'esm',
            compact:   true,
            sourcemap: true,
        },
        plugins: [
            resolve(),
            progress(progressOptions),
            babel(babelOptionsES2018),
            terser(terserOptions),
        ]
    },
    // ES Modules None-Minified
    {
        input:   './src/index.js',
        output:  {
            file:      './dist/observer.esm.js',
            format:    'esm',
            compact:   false,
            sourcemap: true,
        },
        plugins: [
            resolve(),
            progress(progressOptions),
            babel(babelOptionsES2018),
        ]
    },
];
