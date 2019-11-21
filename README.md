# browser-logging

Sends browser logs from client to node server.

This is useful for retrieving Cypress UI test browser logs.

Any message sent to `console.log`, `console.warn` and `console.error` will also be sent to and logged by the logging server.

## Server

To start the server which will listen for logs:

```
yarn start

...

$ node dist/loggingServer.js
Listening for browser logs on ws://localhost:8888
```

## Client

The client must be initialised in the browser environment. It overrides `console.log`, `console.warn` and
`console.error` sending all messages to the logging server. They are still logged to the browser.

```typescript
import { initialiseLoggingClient } from "@Countingup/browser-logging";

initialiseLoggingClient();
```

Calling `initialiseLoggingClient` after it's already initialised has no effect.

## Publishing

Install `np` - https://github.com/sindresorhus/np:

```
yarn global add np
```

Run `np` and follow instructions.

## License

[MIT](https://opensource.org/licenses/MIT) License.
