 const merge = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'production',
   performance: {
        hints: 'error',
        maxEntrypointSize: 500000,
        maxAssetSize: 500000,
        assetFilter: function(assetFilename) {
            return assetFilename.endsWith('.js');
        }
  },
  devServer: {
    contentBase: './dist',
  
  }
 });