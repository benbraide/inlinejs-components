const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
   entry: {
       "inlinejs-components.min": "./src/inlinejs-components.ts",
   },
   output: {
       filename: "[name].js",
       path: path.resolve(__dirname, 'dist')
   },
   resolve: {
       extensions: [".webpack.js", ".web.js", ".ts", ".js"]
   },
   module: {
       rules: [{ test: /\.ts$/, loader: "ts-loader" }]
   },
   mode: 'production',
   optimization: {
       minimizer: [
           new TerserPlugin({
               terserOptions: {
                   keep_classnames: true,
               },
           }),
       ],
   },
}
