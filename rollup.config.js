import babel from 'rollup-plugin-babel';

var pkg = require('./package.json');

//Silence circular dependency of safetyedish calling itself in ./src/callbacks/onLayout/initResetButton.js
const onwarn = warning => {
    // Silence circular dependency warning for moment
    if (warning.code === 'CIRCULAR_DEPENDENCY')
        return;
  
    console.warn(`(!) ${warning.message}`);
}

module.exports = {
    input: pkg.module,
    onwarn,
    output: {
        name: pkg.main.replace(/^((\.\/)?(build\/)?)|(\.js)$/g, ''),
        file: pkg.main,
        format: 'umd',
        globals: {
            d3: 'd3',
            webcharts: 'webCharts'
        },
    },
    external: (function() {
        var dependencies = pkg.dependencies;

        return Object.keys(dependencies);
    }()),
    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: [
                [ 'env', {modules: false} ]
            ],
            plugins: [
                'external-helpers'
            ],
            babelrc: false
        })
    ]
};

