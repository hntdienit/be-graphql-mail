import { FastifyInstance, FastifyServerOptions } from "fastify";
import App from "./app";

function init() {
  const options: FastifyServerOptions = {
    logger: true,
  };

  const app: FastifyInstance = App(options);
  return app;
}

if (require.main === module) {
  init().listen({ port: 5000 }, (err) => {
    if (err) console.error(err);
    console.log("server listening on 5000");
  });
}

export default init;
