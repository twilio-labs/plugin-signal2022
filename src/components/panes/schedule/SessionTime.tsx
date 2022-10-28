import format from 'date-fns/format';
import { Text } from 'ink';
import React from 'react';
import { Session } from '../../../types/session';

export type SessionTimeProps = {
  session: Session;
};

export function SessionTime({ session }: SessionTimeProps) {
  const startTime = maybeFormatTime(session.startTime);
  const endTime = maybeFormatTime(session.endTime);

  if (!session.hasEnded && startTime) {
    return (
      <>
        {startTime} <Text dimColor>- {endTime ?? '-----'} </Text>
        {' │ '}
      </>
    );
  }

  const label = 'on demand';

  return (
    <>
      <Text dimColor>{'[ ' + label + ' ] '}</Text>
      {' │ '}
    </>
  );
}

function maybeFormatTime(time?: Date) {
  return time ? format(time, 'HH:mm') : undefined;
}
