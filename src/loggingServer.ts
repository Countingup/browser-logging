// Listens for and logs browser console logs sent from Cypress test runs.
// This ensures browser console logs end up in the Jenkins pipeline.log output (also works when running locally).
// To enable, start with `node <this file>`, then set `REACT_APP_LOGGING_SERVER=http://localhost:8888` when building/running the app.

import { Server } from "ws";

const ws = new Server({ host: "localhost", port: 8888 });
console.log(`Listening for browser logs on ws://localhost:8888`);

ws.on("connection", ws => {
  ws.on("message", (wsMessage: string) => {
    try {
      const { timestamp, logLevel, message } = JSON.parse(wsMessage);
      logger(logLevel)(logLevel, new Date(timestamp), "browser 🌐", ...message);
    } catch (e) {
      console.error(`Invalid message '${wsMessage}':`, e);
    }
  });
});

const logger = (logLevel: string) => {
  switch (logLevel) {
    case "INFO":
      return console.log;
    case "WARN":
      return console.warn;
    case "ERROR":
      return console.error;
    default:
      return console.log;
  }
};
