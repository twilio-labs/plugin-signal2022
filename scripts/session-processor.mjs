// Process the session json
import csv from 'csvtojson';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sessionsPath = path.join(__dirname, `sessions.csv`);

import fs from 'fs';
import { Session } from 'inspector';

async function generateSessionJSON() {
  try {
    return await csv({
      ignoreEmpty: true,
      trim: true,
    }).fromFile(sessionsPath);
  } catch (err) {
    console.error(`Err with ${sessionsPath}: ${err}`);
  }
}

async function getSessionsJson() {
  const sessionsData = await generateSessionJSON();

  const sessionFilter = (session) => {
    const { date, name, start_time, type, visibility } = session;
    // Remove sessions that aren't visible to all
    if (visibility !== 'Everyone') {
      return false;
    }

    // Eliminate test sessions
    if (name.indexOf('TEST') > -1 || date === '2022-10-14') {
      return false;
    }

    // Unhelpful session Types
    if (!type || type === 'Spotlight (for website)' || type === 'Analyst') {
      return false;
    }

    // No on demand booth sessions
    if (
      type.indexOf('Booth') > -1 &&
      (name.indexOf('Ventures') > -1 ||
        name.indexOf('Product') > -1 ||
        name.indexOf('Industry') > -1)
    ) {
      return false;
    }

    // A session we want to keep
    return true;
  };
  const sessionTypeSet = new Set();
  const sessionTypeSetAfter = new Set();

  if (!sessionsData.length || sessionsData.length < 0) {
    return null;
  }

  function generateSessionTabTypes(session) {
    const sessionType = session.type;
    if (sessionType === 'SIGNAL TV') {
      return sessionType;
    } else if (sessionType === 'Superclass') {
      return sessionType;
    } else if (sessionType && sessionType.indexOf('Booth') > -1) {
      return sessionType.replace("  Booth", "");
    } else {
      return session.date;
    }
  }

  const cleanSessionName = (session) => {
    return session.name.replace(' Q&A Booth', '');
  };

  const cleanSessions = sessionsData
    .map((session, index) => {
      sessionTypeSet.add(session['Session Type']);
      return {
        id: session['Session ID'] ? session['Session ID'] : index,
        name: session['Session Name'],
        description: session.Description,
        start_time: session['Start Time'],
        end_time: session['Start & End Time']
          ? session['Start & End Time'].split(' - ')[1]
          : '',
        date: session.Date,
        visibility: session['Visible To'],
        speakers: session.Speakers
          ? session.Speakers.split('\n').filter((speaker) => speaker)
          : '',
        direct_link: session['Direct Link'],
        type: session['Session Type'],
      };
    })
    .filter(sessionFilter)
    .map((session) => {
      session.type = generateSessionTabTypes(session);
      session.start_time = session.type === "Superclass" ? null : session.start_time
      session.name =
        session.name.indexOf('Booth') > -1
          ? cleanSessionName(session)
          : session.name;
      sessionTypeSetAfter.add(session.type);
      return session;
    });

  console.log(sessionTypeSetAfter);

  fs.writeFile(
    path.join(__dirname, `/clean/sessions.json`),
    JSON.stringify(cleanSessions),
    'utf8',
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
}

getSessionsJson();
