/* eslint @typescript-eslint/no-var-requires: "off" */
const { baseCommands } = require('@twilio/cli-core');
const { Flags } = require('@oclif/core');

const { render } = require('../../components/App');
const { stripIndent } = require('common-tags');
const {
  default: logger,
  loggerPath,
  cliLogLevelToPinoLogLevel,
  pinoFinalHandler,
} = require('../../utils/logger');
const { computeDiagnostics } = require('../../utils/diagnostics');

const { TwilioClientCommand } = baseCommands;

let shouldCleanScreen = false;

const baseFlags = { ...TwilioClientCommand.flags };
baseFlags.profile.description =
  "Shorthand identifier for your twilio-cli profile; run '$ twilio profiles:list' for more info.";

class Signal2022Command extends TwilioClientCommand {
  static strict = false;

  static flags = {
    ...baseFlags,
    diagnostics: Flags.boolean({
      char: 'd',
      default: false,
      description:
        'Using this flag will output diagnostics information that will be useful when debugging issues.',
    }),
    token: Flags.string({
      description: 'The token used to give you access to SIGNAL.',
    }),
    feedback: Flags.boolean({
      default: false,
      description: 'Learn how you can give feedback on SIGNAL Developer Mode.',
    }),
    tail: Flags.boolean({
      default: false,
    }),
  };

  diagnostics = null;
  token = null;

  async catch(error) {
    pinoFinalHandler(error, 'cliError', true);
    if (error) {
      let info;
      if (this.logger & this.logger.info) {
        info = this.logger.info;
      } else {
        info = console.log;
      }
      info(`Please check your log file for more details at: ${loggerPath}`);
    }

    return super.catch(error);
  }

  async checkFlags() {
    if (Signal2022Command.flags.feedback) {
      this.logger.info(
        'We would love to hear what you think about SIGNAL Developer Mode. Head over to https://twil.io/signal-dev-mode-feedback'
      );
      return;
    }

    if (Signal2022Command.flags.tail) {
      this.logger.info(
        `Welcome! Using --tail doesn't actually do something but we are glad you are listening :)`
      );
    }

    if (Signal2022Command.flags.diagnostics) {
      this.output(this.diagnostics);
      return;
    }
  }

  checkForMintty() {
    if (!process.stdout.isTTY) {
      if (this.diagnostics.terminal === 'mintty') {
        this.logger.info(stripIndent`
          It appears as if you are using Git Bash or a similar to run SIGNAL Developer Mode.
          Unfortunately Git Bash won't give you the best experience. Check out Windows Terminal as an alternative. If you still want to use it run next:
          winpty twilio.cmd signal2022
        `);
        process.exit(1);
      }

      this.logger.info(
        `We get it, you had to try it. We would have, too. However, you'll get the most out of SIGNAL Developer Mode by running it just using:\n$ twilio signal2022\nEnjoy SIGNAL!`
      );
      process.exit(0);
    }
  }

  checkForGit() {
    if (!this.diagnostics.hasGit) {
      this.logger.info(
        `We could not find git on your system. That means you won't be able to use the download & setup functionality of SIGNAL Developer Mode. You can still continue. If you wish to use that functionality, make sure you have git installed and it is part of your PATH. You might have to restart your terminal for this.`
      );
    }
  }

  async run() {
    await super.run();
    logger.level = cliLogLevelToPinoLogLevel(this.logger.config.level);
    let debug =
      this.logger.config.level === -1 || Boolean(process.env.DEBUG_SIGNAL);

    this.diagnostics = computeDiagnostics(this);
    this.logger.debug('Full log file at ' + loggerPath);
    logger.info({
      ...this.diagnostics,
      msg: 'Diagnostics',
      twilioCliLogLevel: this.logger.config.level,
    });

    await this.checkFlags();
    await this.checkForMintty();
    this.checkForGit();
    shouldCleanScreen = !debug;
    await render(
      {
        name: 'Operator',
        accountSid: this.twilioClient.accountSid,
        twilioUsername: this.twilioClient.username,
        twilioPassword: this.twilioClient.password,
      },
      debug
    );
  }
}

module.exports = Signal2022Command;

// catch all the ways node might exit
process.on('beforeExit', () => pinoFinalHandler(null, 'beforeExit'));
process.on('exit', () => {
  if (shouldCleanScreen) {
    const leaveAltScreenCommand = '\x1b[?1049l';
    process.stdout.write(leaveAltScreenCommand);
  }
  return pinoFinalHandler(null, 'exit');
});
process.on('uncaughtException', (err) =>
  pinoFinalHandler(err, 'uncaughtException')
);
process.on('SIGINT', () => pinoFinalHandler(null, 'SIGINT'));
process.on('SIGQUIT', () => pinoFinalHandler(null, 'SIGQUIT'));
process.on('SIGTERM', () => pinoFinalHandler(null, 'SIGTERM'));
