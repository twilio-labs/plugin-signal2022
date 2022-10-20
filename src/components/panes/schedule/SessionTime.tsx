import format from 'date-fns/format';
import { Text } from 'ink';
import React from 'react';
import { Session } from '../../../types/session';

export type SessionTimeProps = {
  session: Session;
};
export function SessionTime({ session }: SessionTimeProps) {
  const startTime = format(new Date(session.start_time), 'hh:mm');
  const endTime = format(new Date(session.end_time), 'hh:mm');

  if (!session.hasEnded) {
    return (
      <>
        {startTime} <Text dimColor>- {endTime} </Text>
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
