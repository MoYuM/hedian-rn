module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@babel/plugin-syntax-import-meta',
        {
          // 将 import.meta 转换为 process.env
          module: 'process'
        }
      ]
    ],
  };
};
