import { Server } from "http";
import app from "./app";
import Config from "./app/Config";

const port = Config.port;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log("Sever is running on port ", port);
  });
}

main();
