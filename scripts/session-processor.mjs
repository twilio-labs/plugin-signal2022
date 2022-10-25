// Process the session json
import csv from 'csvtojson';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sessionsPath = path.join(__dirname, `sessions.csv`);

import fs from 'fs';

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

async function getCirculationJson() {
  const sessionsData = await generateSessionJSON();

  if (!sessionsData.length || sessionsData.length < 0) {
    return null;
  }

  const cleanSessions = sessionsData
    .filter((session) => session['Visible To'] === 'Everyone')
    .map((match, index) => {
      /* 
      {
        'Record Type': 'APAC',
        Date: '2022-11-03',
        'Start Time': '22:15:00',
        'Start & End Time': '22:15:00 - 22:50:00',
        'Session Name': 'Fireside Chat with Twilio Champions',
        'Session Type': 'SIGNAL TV',
        'Region (Actual)': 'APAC',
        'URL of Virtual Host': 'https://www.signal2022.com/twilio/v/s-1115381',
        'Publish Session Data?': 'No',
        Speakers: 'Daizen Ikehara - Twilio\nAnkita Tripath - Twilio\n',
        'Visible To': 'Everyone',
        Description: '<p>SIGNAL is not over yet! Join our Twitch Streaming with Twilio champion(s) from the region to discuss anything about SIGNAL! You will also have opportunities to learn what Twilio Champions program is, and what we’re anticipating in 2023!</p>',
        'Direct Link': 'https://www.signal2022.com/twilio/session/1110622/fireside-chat-with-twilio-champions',
        'Date & Time': '2022-11-03, 22:15:00 - 22:50:00'
      }
    */
      return {
        id: match['Session ID'] ? match['Session ID'] : index,
        name: match['Session Name'],
        description: match.Description,
        start_time: match['Start Time'],
        end_time: match['Start & End Time']
          ? match['Start & End Time'].split(' - ')[1]
          : '',
        date: match.Date,
        visibility: match['Visible To'],
        speakers: match.Speakers
          ? match.Speakers.split('\n').filter((speaker) => speaker)
          : '',
        direct_link: match['Direct Link'],
        type: match['Session Type'],
      };
    });
  console.log(cleanSessions.length, cleanSessions[88]);
  // console.log('initial length is', circulationData.length)
  // console.log(circulationData[0])
  // console.log(cleanCirculation[0])
  // console.log('final length of array is', cleanCirculation.length)

  fs.writeFile(
    path.join(__dirname, `/clean/sessions.json`),
    JSON.stringify(cleanSessions),
    'utf8',
    (err) => {
      if (err) {
        throw err;
      }
      // console.log('Successfully joined data')
    }
  );
}

getCirculationJson();
