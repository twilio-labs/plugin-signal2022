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
  const selectedId = (sessions[activeSessionIdx] || {}).id;

  return (
    <ScrollableItemList activeIdx={activeSessionIdx}>
      {sessions.map((s) => (
        <SessionEntry session={s} key={s.id} active={s.id === selectedId} />
      ))}
    </ScrollableItemList>
  );
}
