const devConfig = {
  MONGO_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  AUTH_TOKEN_LIFESPAN: 60,
};

const prodConfig = {
  MONGO_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  AUTH_TOKEN_LIFESPAN: 60,
};

function envConfig(env) {
  switch (env) {
    case 'dev':
      return devConfig;
    default:
      return prodConfig;
  }
}

export default {
  PORT: process.env.PORT,
  ...envConfig(process.env.NODE_ENV),
};
