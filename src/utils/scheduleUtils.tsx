import { RawSession, Session, SessionsData } from '../types/session';
import { sortByDate } from './dateHelpers';
import { getRandomInt } from './maths';

function mapSession(rawSession: RawSession): Session {
  const hasEnded =
    rawSession.end_time == null // assume no end time means it's always available?
      ? false
      : Date.now() > new Date(rawSession.end_time).getTime();

  // TODO: support tbd speakers data?
  // const speakers = rawSession.talent.map((name) => {
  //   const parts = name.trim().split(' ', 2);
  //   return {
  //     firstName: parts[0],
  //     lastName: parts[1],
  //   };
  // });

  return {
    ...rawSession,
    hasEnded,
    // speakers,
  };
}

type GroupedSessions = {
  [key: string]: Session[];
};

export function groupSessionsByTypeOrDate(
  sessions: Session[]
): GroupedSessions {
  const groupedSets: { [key: string]: Set<Session> } = {};
  for (const baseSession of sessions) {
    const session = mapSession(baseSession);
    //! Hack to display at least one usable date while testing schedule
    if (!session.date) {
      const day = getRandomInt(2, 3);
      session.date = `Nov ${day}`;
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
