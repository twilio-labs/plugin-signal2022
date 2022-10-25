import { commaListsAnd } from 'common-tags';
import { Box, Spacer, Text } from 'ink';
import React from 'react';
import { Session } from '../../../types/session';
import { Bold } from '../../common/Bold';

export type SessionDetailsProps = {
  session: Session;
};

export function SessionDetails({ session }: SessionDetailsProps) {
  if (!session) return null;

  const { description, name, speakers } = session;
  const showDescription = Boolean(description);

  return (
    <Box
      padding={1}
      flexDirection="column"
      borderStyle="single"
      flexShrink={1}
      flexGrow={1}
    >
      <Box>
        <Box marginRight={2}>
          <Bold wrap="truncate-end">{name} </Bold>
        </Box>
        <Spacer />
      </Box>
      <Spacer />
      {Array.isArray(speakers) && speakers.length > 0 && (
        <Text wrap="truncate-end">{commaListsAnd`Speakers: ${speakers}`}</Text>
      )}
      <Spacer />
      <Box>
        {showDescription && (
          <Text wrap="truncate-end">
            {description.replace(/<\/?[^>]+>/g, '')}
          </Text>
        )}
      </Box>
    </Box>
  );
}
