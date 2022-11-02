import { Box, Newline, Text } from 'ink';
import React, { useCallback, useMemo, useState } from 'react';
import { useUser } from '../../context/user';
import { useBreakpointForElement } from '../../hooks/useResize';
import {
  SHOW_FULL_WELCOME_DESCRIPTION,
  SHOW_MEDIUM_WELCOME_DESCRIPTION,
  SHOW_SHORT_WELCOME_DESCRIPTION,
} from '../../utils/breakpoints';
import { TypeText } from '../animated/TypeText';
import { Bold } from '../common/Bold';
import { Key } from '../common/Key';
import { ListItem } from '../common/ListItem';
import { UnorderedList } from '../common/UnorderedList';
import { ScrollText } from '../scrollable/ScrollText';
import { Pane } from './Pane';

function FullDescription() {
  return (
    <ScrollText>
      <Newline count={1} />
      <Text>
        We are excited that you have decided to join us on this journey.
      </Text>
      <Newline count={2} />
      <Text>
        Developer Mode is another way to access information about SIGNAL from
        the comfort of your CLI. As you navigate Developer Mode, know that we
        are united by one objective:
      </Text>
      <Newline count={2} />
      <TypeText
        text="// To Build! "
        showCursor="blinking"
        TextComponent={Bold}
      />
      <Newline count={2} />
      <Text>We equipped Developer Mode with a variety of functionality:</Text>
      <Newline />
      <Newline />
      <UnorderedList>
        <ListItem>
          The full SIGNAL schedule, including SIGNAL TV and Superclass
          programming.
        </ListItem>
        <ListItem>
          Demo applications and code samples that you can install within
          minutes.
        </ListItem>
        <ListItem>
          A list of helpful resources for your SIGNAL 2022 experience.
        </ListItem>
      </UnorderedList>
      <Newline count={2} />
      <Text>
        You can navigate Developer Mode with your keyboard. On the left you can
        find a collection of special keys to switch modes. Additionally arrow
        keys, <Key>Tab</Key>, <Key>Enter</Key> and <Key>Spacebar</Key> will be
        your best friends. And you can always exit by pressing <Key>Ctrl</Key>{' '}
        and <Key>C</Key> at the same time.
      </Text>
      <Newline count={2} />
      <Text>
        If you want to peek under the hood, have issues or want to contribute,
        head over to https://github.com/twilio-labs/plugin-signal2022
      </Text>
    </ScrollText>
  );
}

function MediumDescription() {
  return (
    <ScrollText>
      <Newline count={1} />
      <Text>
        Once again, we are gathering virtually for Twilio's SIGNAL Conference.
        But we are still united by a shared objective:
      </Text>
      <Newline count={2} />
      <TypeText
        text="// To Build! "
        showCursor="blinking"
        TextComponent={Bold}
      />
      <Newline count={2} />
      <Text>We equipped Developer Mode with a variety of functionality:</Text>
      <Newline />
      <UnorderedList>
        <ListItem>The full SIGNAL schedule, incl. SIGNAL TV</ListItem>
        <ListItem>Demo apps with automatic download functionality.</ListItem>
        <ListItem>
          A list of helpful resources for your SIGNAL 2022 experience.
        </ListItem>
      </UnorderedList>
      <Newline count={1} />
      <Text>
        You can navigate Developer Mode with your keyboard. On the left you can
        ind a collection of special keys to switch modes. Additionally arrow
        keys, <Key>Tab</Key>, <Key>Enter</Key> and <Key>Spacebar</Key> will be
        your best friends. And you can always exit by pressing <Key>Ctrl</Key>{' '}
        and <Key>C</Key> at the same time.
      </Text>
      <Newline count={2} />
      <Text>
        If you want to peek under the hood, have issues or want to contribute,
        head over to https://github.com/twilio-labs/plugin-signal2022
      </Text>
    </ScrollText>
  );
}

function ShortDescription() {
  return (
    <ScrollText>
      <Newline count={1} />
      <Text>
        SIGNAL Developer Mode is an augmentation to your SIGNAL experience,
        packed with functionality for you to build while you are attending
        SIGNAL. It includes a full schedule, useful resources, and several demos
        of Twilio code.
      </Text>
      <Newline count={2} />
      <Text>
        <Bold>
          Developer Mode will adapt to your terminal window size and works best
          in bigger windows.
        </Bold>
      </Text>
      <Text>
        <Newline />
        You can navigate Mode with your keyboard. On the left you can find
        special keys to switch modes. Arrow keys, <Key>Tab</Key>,{' '}
        <Key>Enter</Key> and <Key>Spacebar</Key> can be used to navigate
        different parts of Developer Mode. You can always exit by pressing{' '}
        <Key>Ctrl</Key> and <Key>C</Key> at the same time.
      </Text>
      <Newline count={2} />
      <Text>Learn more at https://twil.io/signal-developer-mode.</Text>
    </ScrollText>
  );
}

function FallbackMessage() {
  return (
    <ScrollText>
      <Text>
        To learn more about Developer Mode, please increase your terminal size,
        hide the sidebar using <Key>b</Key> or visit
        https://twil.io/signal-developer-mode
      </Text>
    </ScrollText>
  );
}

export function WelcomePane() {
  const { name } = useUser();
  const [showMessage, setShowMessage] = useState(false);
  const makeFullMessageVisible = useCallback(() => setShowMessage(true), [
    name,
  ]);

  const {
    shouldRender: [shouldRenderShort, shouldRenderMedium, shouldRenderFull],
    ref,
  } = useBreakpointForElement(
    [
      SHOW_SHORT_WELCOME_DESCRIPTION,
      SHOW_MEDIUM_WELCOME_DESCRIPTION,
      SHOW_FULL_WELCOME_DESCRIPTION,
    ],
    [showMessage]
  );

  return (
    <Pane headline="Ahoy">
      <Box
        flexDirection="column"
        paddingLeft={2}
        paddingRight={2}
        ref={ref}
        flexGrow={1}
        flexShrink={1}
      >
        <Bold>
          <TypeText
            text={`Welcome, Operator. You entered the world of SIGNAL's Developer Mode.`}
            onDone={makeFullMessageVisible}
            showCursor
          />
        </Bold>
        <Newline count={1} />
        {showMessage &&
          !shouldRenderShort &&
          !shouldRenderMedium &&
          !shouldRenderFull && <FallbackMessage />}
        {showMessage &&
          shouldRenderShort &&
          !shouldRenderMedium &&
          !shouldRenderFull && <ShortDescription />}
        {showMessage && shouldRenderMedium && !shouldRenderFull && (
          <MediumDescription />
        )}
        {showMessage && shouldRenderFull && <FullDescription />}
      </Box>
    </Pane>
  );
}
