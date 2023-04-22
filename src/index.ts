import http from "http";
import { App } from "./app";
import { getDebug } from "./helpers/debug.helper";
import { getEnvironment } from "./helpers/dotenv.helper";

const env = getEnvironment();

const debug = getDebug();

const app = new App();
const server = http.createServer(app.app);

server.listen(env.SERVER_PORT, "0.0.0.0", () => {
  debug(`App listening on port ${env.SERVER_PORT}!`);
});
