import dotenv from "dotenv";
dotenv.config();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGODB_CONNECTION_STRING,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  mailtrapToken: process.env.MAILTRAP_TOKEN,
  mailtrapEndPoint: process.env.MAILTRAP_ENDPOINT,
  frontendUrl: process.env.FRONTEND_DOMAIN,
};

const config = {
  get(key) {
    const value = _config[key];
    if (!value) {
      console.log(
        `The ${key} variable not found. Make sure to pass environment variables.`
      );
      process.exit(1);
    }
    return value;
  },
};
export default config;
