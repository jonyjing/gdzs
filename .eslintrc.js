module.exports = {
  env: {
    browser: true,
    es6: false,
    jquery: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2015
  },
  globals: {
    echarts: true,
    Highcharts: true,
    Swiper: true,
    echarts2: true,
    axios: true
  },
  rules: {
    indent: ['error', 'tab'],
    'linebreak-style': ['error', 'windows'],
    quotes: ['error', 'single'],
    semi: ['error', 'never']
  }
}
