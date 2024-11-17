import { MailtrapClient } from "mailtrap";
import config from "../config/config.js";

export const mailtrapClient = new MailtrapClient({
  endpoint: config.get("mailtrapEndPoint"),
  token: config.get("mailtrapToken"),
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Prince Sharma",
};
