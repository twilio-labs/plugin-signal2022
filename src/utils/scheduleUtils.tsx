import { addHours } from 'date-fns';
import { RawSession, Session, SessionsData } from '../types/session';
import { sortByDate } from './dateHelpers';

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

/** Make these date + n_time strings actually useful, assume we're given UTC for once? */
function stringsToDateTime(date?: string, time?: string) {
  return date && time ? new Date(`${date}T${time}Z`) : undefined;
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

    if (!groupedSets[session.date]) {
      groupedSets[session.date] = new Set();
    }

    groupedSets[session.date].add(session);
  }

  const grouped: GroupedSessions = {};
  for (const date of Object.keys(groupedSets)) {
    grouped[date] = [...groupedSets[date]].sort(sortByDate);
  }

  return grouped;
}

export function normalizeSchedule(data?: SessionsData): Session[] {
  if (typeof data == 'undefined') {
    return undefined;
  }

  return data.map<Session>(mapSession);
}

// Save this since it'll be helpful later if it's anything like 2021 was
// const apiDateTimeFormat = 'yyyy-MM-dd:HH:mm:ss xxxxx';

// function normalizeSession(rawSession: RawSession): Session {
//   if (rawSession.date && rawSession.startTime && rawSession.endTime) {
//     // The swoogo/signalTV api both return dates in PDT/PST only.
//     // Consider this when parsing, so that they'll format correctly across timezones
//     const swoogoOffset = isDST() ? '-07:00' : '-08:00';
//     const startDate = parse(
//       `${rawSession.date}:${rawSession.startTime} ${swoogoOffset}`,
//       apiDateTimeFormat,
//       new Date()
//     );
//     const endDate = parse(
//       `${rawSession.date}:${rawSession.endTime} ${swoogoOffset}`,
//       apiDateTimeFormat,
//       new Date()
//     );

//     return {
//       ...rawSession,
//       startDate,
//       endDate,
//     };
//   }
//   return null;
// }

// function normalizeSessions(rawSessions: RawSession[]): Session[] {
//   return rawSessions
//     .map((rawSession) => normalizeSession(rawSession))
//     .filter((session) => session != null);
// }
