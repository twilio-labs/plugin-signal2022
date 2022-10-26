import React from 'react';
import { Session } from '../../../types/session';
import { ScrollableItemList } from '../../scrollable/ScrollableItemList';
import { SessionEntry } from './SessionEntry';

export type ScheduleContent = {
  sessions: Session[];
  activeSessionIdx: number;
  registeredSessions?: Set<string>;
};
export function ScheduleContent({
  sessions,
  activeSessionIdx,
}: ScheduleContent) {
  const { id, direct_link } = sessions[activeSessionIdx];
  const selectedId = id + direct_link;

  return (
    <ScrollableItemList activeIdx={activeSessionIdx}>
      {sessions.map((s) => {
        // Sessions contain duplicate ids, don't rely just on id for a unique key
        const key = s.id + s.direct_link;

        return (
          <SessionEntry session={s} key={key} active={key === selectedId} />
        );
      })}
    </ScrollableItemList>
  );
}
