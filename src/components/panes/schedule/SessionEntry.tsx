import { Box, Text } from 'ink';
import React from 'react';
import { Session } from '../../../types/session';
import { ListSelector } from '../../common/ListSelector';
import { SessionTime } from './SessionTime';

export type SessionEntryProps = {
  session: Session;
  active: boolean;
};

export function SessionEntry({ session, active }: SessionEntryProps) {
  return (
    <Box width="100%">
      <Box flexGrow={1} flexShrink={1}>
        <Box flexShrink={0}>
          <Text>
            <ListSelector active={active} />
            <SessionTime session={session} />
          </Text>
        </Box>
        <Box flexGrow={1}>
          <Text wrap="truncate-end" dimColor={session.hasEnded}>
            {session.name}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
