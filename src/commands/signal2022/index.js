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
  typeOut,
  addNewLine,
} = require('../../utils/logger');
const { computeDiagnostics } = require('../../utils/diagnostics');
const readline = require('readline');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const { sleep } = require('../../utils/sleep');
const { chalky } = require('../../utils/chalky');
const { getRandomInt } = require('../../utils/maths');

const { TwilioClientCommand } = baseCommands;

let shouldCleanScreen = false;

const baseFlags = { ...TwilioClientCommand.flags };
baseFlags.profile.description =
  "Shorthand identifier for your twilio-cli profile; run '$ twilio profiles:list' for more info.";

class Signal2022Command extends TwilioClientCommand {
  static strict = false;

  static aliases = ['signal'];

  static examples = ['$ twilio signal', '$ twilio signal end credits --tail'];

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

  async checkForEndingCredits() {
    const { argv, flags, logger } = this;

    const end = argv[0] === 'end';
    // Avoid edge case where user can fall into the normal flow by entering signal credits --tail
    const credits = argv.includes('credits');

    if (end || credits) {
      if (end && credits && flags.tail) {
        const creditsStream = readline.createInterface({
          input: fs.createReadStream(
            path.resolve(
              __dirname,
              '..',
              '..',
              '..',
              'assets',
              'end-credits.txt'
            )
          ),
        });

        let buffer = [];

        const chalkyArtRegex = /^{([a-zA-Z]+)\s/;

        for await (const line of creditsStream) {
          if (line.startsWith('command')) {
            await typeOut(line, 'command ');
          } else if (line.startsWith('art')) {
            buffer.push(line.replace('art ', ''));
          } else if (line.startsWith('/art')) {
            buffer.forEach((bufferedLine) => {
              const customArtColors = chalkyArtRegex.test(bufferedLine);
              console.log(
                customArtColors
                  ? chalky`${bufferedLine}` // this "works", but it gets really dicey and can crash the app depending on which characters are in the line 🙃
                  : // @ts-ignore
                    chalk.magentaBright(bufferedLine)
              );
            });
            buffer = [];
            await sleep(1500);
          } else if (line.startsWith('dramaticPause')) {
            const [_, duration] = line.split(' ');
            await sleep(parseInt(duration) || 1000);
          } else if (line.startsWith('yeetMeOuttaHere')) {
            for (const command of ['^c', '^c']) {
              // @ts-ignore
              process.stdout.write(chalk.magentaBright(command));
              await sleep(1000);
            }
            addNewLine();
          } else if (line.startsWith('clear')) {
            console.clear();
          } else if (line.startsWith('vCenterText')) {
            const { rows } = process.stdout;
            const vPadding = Math.floor(rows / 2 - 1);
            [...Array(vPadding)].forEach(addNewLine);
            await typeOut(line, 'vCenterText ');
          } else if (line.startsWith('totalCenter')) {
            const newLine = line.replace('totalCenter ', '');
            const { rows, columns } = process.stdout;
            const vPadding = Math.floor(rows / 2 - 1);
            [...Array(vPadding)].forEach(addNewLine);
            // Seems sketchy, but works, at least for the logo
            const hPadding = Math.floor((columns + newLine.length) / 2);
            // @ts-ignore
            console.log(chalk.yellowBright(newLine.padStart(hPadding)));
          } else if (line.startsWith('hideCursor')) {
            process.stdout.write('\x1B[?25l');
          } else if (line.startsWith('showCursor')) {
            process.stdout.write('\x1B[?25h');
          } else {
            await sleep(getRandomInt(350, 150));
            console.log(chalky`${line}`);
          }
        }

        return true;
      }

      logger.error(
        'You must enter "twilio signal end credits --tail" exactly for this easter egg. Please try again!'
      );
      return true;
    }

    return false;
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

    const creditsAttempted = await this.checkForEndingCredits();
    if (creditsAttempted) {
      return;
    }

    await this.checkFlags();
    await this.checkForMintty();
    this.checkForGit();
    shouldCleanScreen = !debug;
    // TODO: Create some local state to capture the person's name?
    await render(
      {
        name: 'Ricky',
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
