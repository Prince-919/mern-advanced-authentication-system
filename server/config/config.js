import dotenv from "dotenv";
dotenv.config();

const _config = {
  port: process.env.PORT,
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
