import { Box, useInput } from 'ink';
import React, { useMemo, useState } from 'react';
import { useScrollableList } from '../../../hooks/useScrollableList';
import { Session } from '../../../types/session';
import { openBrowserUrl } from '../../../utils/openLink';
import { groupSessionsByTypeOrDate } from '../../../utils/scheduleUtils';
import { ScheduleContent } from './ScheduleContent';
import { ScheduleTab } from './ScheduleTab';
import { SessionDetails } from './SessionDetails';

export type ScheduleProps = {
  sessions: Session[];
};

export function Schedule({ sessions }: ScheduleProps) {
  const groupedSessions = useMemo(() => {
    const grouped = groupSessionsByTypeOrDate(sessions);
    return grouped;
  }, [sessions]);

  const days = Object.keys(groupedSessions).sort();

  const [selectedDay, setSelectedDay] = useState(0);

  const [selectedSession, setSelectedSession] = useScrollableList(
    0,
    groupedSessions[days[selectedDay]]
  );

  useInput((_input, key) => {
    if (key.leftArrow) {
      setSelectedSession(0);
      setSelectedDay((currentDay) => Math.max(0, currentDay - 1));
      return;
    }

    if (key.rightArrow) {
      setSelectedSession(0);
      setSelectedDay((currentDay) => Math.min(currentDay + 1, days.length - 1));
      return;
    }

    if (key.return) {
      const session = groupedSessions[days[selectedDay]][selectedSession];
      openBrowserUrl(session.direct_link);
    }
  });

  const selectedSessionInstance =
    groupedSessions[days[selectedDay]][selectedSession];

  console.log(groupedSessions[days[selectedDay]][selectedSession]);
  return (
    <>
      <Box flexDirection="column" flexGrow={1} justifyContent="flex-start">
        <Box
          flexDirection="row"
          justifyContent="space-around"
          paddingLeft={4}
          paddingRight={4}
        >
          {days.map((day) => (
            <ScheduleTab
              key={day}
              day={day}
              active={days[selectedDay] === day}
            />
          ))}
        </Box>
        <Box flexGrow={1} flexShrink={1}>
          <ScheduleContent
            sessions={groupedSessions[days[selectedDay]]}
            activeSessionIdx={selectedSession}
          />
        </Box>
        <Box height={10}>
          <SessionDetails session={selectedSessionInstance} />
        </Box>
      </Box>
    </>
  );
}
