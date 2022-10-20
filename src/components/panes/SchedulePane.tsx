import { Text } from 'ink';
import React from 'react';
import { useSessions } from '../../hooks/useApi';
import { SHOW_SCHEDULE_SECTION } from '../../utils/breakpoints';
import { LoadingIndicator } from '../common/LoadingIndicator';
import { Pane } from './Pane';
import { PaneContent } from './PaneContent';
import { Schedule } from './schedule/Schedule';

export const SchedulePane = () => {
  const { sessionsList, loading, error } = useSessions();

  return (
    <Pane headline="SIGNAL 2022">
      <PaneContent breakpoint={SHOW_SCHEDULE_SECTION}>
        {loading && <LoadingIndicator text="Loading Schedule..." />}
        {error && <Text>{error.toString()}</Text>}
        {sessionsList && <Schedule sessions={sessionsList} />}
      </PaneContent>
    </Pane>
  );
};
