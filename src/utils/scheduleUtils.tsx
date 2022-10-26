import { addHours } from 'date-fns';
import { RawSession, Session, SessionsData } from '../types/session';
import { isDST, sortByDate } from './dateHelpers';

function mapSession(rawSession: RawSession): Session {
  const startTime = stringsToDateTime(rawSession.date, rawSession.start_time);
  const endTime = stringsToDateTime(rawSession.date, rawSession.end_time);

  const hasEnded = getHasEnded(rawSession, startTime, endTime);

  const speakers =
    rawSession.speakers && typeof rawSession.speakers === 'string'
      ? [rawSession.speakers]
      : rawSession.speakers;

  return {
    ...rawSession,
    hasEnded,
    startTime,
    endTime,
    speakers,
  };
}

/** Make these date + n_time strings actually useful. */
function stringsToDateTime(date?: string, time?: string) {
  // Once again, we need to offset for P[SD]T 🙃. Why can nobody be bothered to just stick to UTC?
  const swoogoOffset = isDST() ? '-07:00' : '-08:00';

  return date && time ? new Date(`${date}T${time}${swoogoOffset}`) : undefined;
}

function getHasEnded(
  session: RawSession,
  startTime: Date = undefined,
  endTime: Date = undefined
) {
  const now = new Date();

  if (endTime) return now > endTime;

  if (startTime) return new Date() > addHours(endTime, 1);

  if (session.date) return now > new Date(session.date);

  return true;
}

type GroupedSessions = {
  [key: string]: Session[];
};

export function groupSessionsByTypeOrDate(
  sessions: Session[]
): GroupedSessions {
  const groupedSets: { [key: string]: Set<Session> } = {};
  for (const session of sessions) {
    //! Hack to display at least one usable date while testing schedule
    if (!session.date) {
      session.date = `All Days`;
    }

    if (!groupedSets[session.type]) {
      groupedSets[session.type] = new Set();
    }

    groupedSets[session.type].add(session);
  }

  const grouped: GroupedSessions = {};
  for (const type of Object.keys(groupedSets)) {
    grouped[type] = [...groupedSets[type]].sort(sortByDate);
  }

  return grouped;
}

export function normalizeSchedule(data?: SessionsData): Session[] {
  if (typeof data == 'undefined') {
    return undefined;
  }

  return data.map<Session>(mapSession);
}
