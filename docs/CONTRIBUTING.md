# Contributing to this plugin development

## Setup up for development

To set up the project for the first time, clone the repo and install dependencies:

```bash
git@github.com:twilio-labs/plugin-signal2022.git
cd plugin-signal2022
npm install
```

To build the plugin distribution, run:

```bash
npm run build
```

To run plugin commands with your local build for testing, use:

```bash
./bin/run <command>
```

You can automatically re-build the plugin upon source code changes by running the `watch` script in the background while you develop:

```bash
npm run dev
```

## Debug logging

Since the UI takes the entire screen it hides errors and `console.*` statements. If you need to see them run:

```
DEBUG_SIGNAL=* npm run demo
```

During the execution any logs are written to `$TMPDIR/twilio-signal-dev-mode.log`. **The file is overriden at every execution**.
Change the log level using the `-l debug` flag.

For a better readibility of the logs, use [pino-pretty](https://npm.im/pino-pretty):

```bash
tail -f $TMPDIR/twilio-signal-dev-mode.log | npx pino-pretty
```

You'll have to re-run the command between executions.

## Releasing for maintainers
```
git commit
npm version patch|minor|major
npm publish
git push origin main --tags
```
