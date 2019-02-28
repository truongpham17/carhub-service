const devConfig = {
  MONGO_URL: 'mongodb://localhost:27017/sule-pos-dev',
  JWT_SECRET: 'Vm2x?S4{k#;zbx<C',
};

const testConfig = {
  MONGO_URL: 'mongodb://localhost:27017/sule-pos-test',
  JWT_SECRET: 'Vm2x?S4{k#;zbx<C',
};

const prodConfig = {
  MONGO_URL: '',
  JWT_SECRET: 'Vm2x?S4{k#;zbx<C',
};

const defaultConfig = {
  PORT: process.env.PORT || 5710,
};

function envConfig(env) {
  switch (env) {
    case 'dev':
      return devConfig;
    case 'test':
      return testConfig;
    default:
      return prodConfig;
  }
}

export default {
  ...defaultConfig,
  ...envConfig(process.env.NODE_ENV),
};
