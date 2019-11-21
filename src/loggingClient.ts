let connected = false;
const socket = new WebSocket("ws://localhost:8888");
socket.onopen = () => (connected = true);

const defaultLog = console.log;
const defaultWarn = console.warn;
const defaultError = console.error;

let initialised = false;

/**
 * Overrides console.log, warn & error to also send to logging server.
 * Allows retrieving logs when running Cypress tests.
 * Logging server must be running for this to work. See `cypress/loggingServer.js`.
 */
export const initialise = () => {
  if (initialised) return;
  initialised = true;

  console.log("Piping browser logs to logging server at ws://localhost:8888");

  console.log = pipeToLoggingServer(defaultLog, "INFO");
  console.warn = pipeToLoggingServer(defaultWarn, "WARN");
  console.error = pipeToLoggingServer(defaultError, "ERROR");
};

const pipeToLoggingServer = (logger: (...args: any[]) => void, logLevel: string) => (...args: any[]) => {
  logger(...args);

  sendToLoggingServer(Date.now(), logLevel, args, 0);
};

const sendToLoggingServer = (timestamp: number, logLevel: string, message: any[], retryCount: number) => {
  if (!connected && retryCount < 10) {
    // websocket not connected - retry a bit later
    setTimeout(() => sendToLoggingServer(timestamp, logLevel, message, retryCount++), 200);
    return;
  }
  try {
    socket.send(JSON.stringify({ timestamp, logLevel, message }, replaceErrors));
  } catch (e) {
    defaultError("Error sending to logging server:", e);
  }
};

// override error stringification (otherwise they display as "{}")
const replaceErrors = (key: string, value: any) => {
  if (value instanceof Error) {
    const error: { [key: string]: any } = {};

    Object.getOwnPropertyNames(value).forEach(key => {
      // @ts-ignore
      error[key] = value[key];
    });

    return error;
  }

  return value;
};
