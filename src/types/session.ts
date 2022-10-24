export interface RawSession {
  id: number | string;
  name: string;
  description?: string;
  end_time?: string;
  visibility: Visibility;
  speakers: string[] | string;
  direct_link: string;
  type?: Type;
  date?: string;
  start_time?: string;
}

export enum Type {
  Analyst = 'Analyst',
  Breakout = 'Breakout',
  Generic = 'Generic',
  IndustryQABooth = 'Industry Q&A  Booth',
  Keynote = 'Keynote',
  ProductQABooth = 'Product Q&A  Booth',
  SignalTv = 'SIGNAL TV',
  Spotlight = 'Spotlight',
  SpotlightForWebsite = 'Spotlight (for website)',
  Superclass = 'Superclass',
  TheSummits = 'The Summits',
  VenturesQABooth = 'Ventures Q&A  Booth',
}

export enum Visibility {
  Everyone = 'Everyone',
}

export type SessionsData = RawSession[];

export interface Session extends RawSession {
  endTime?: Date;
  hasEnded: boolean;
  speakers: string | string[];
  startTime?: Date;
}
