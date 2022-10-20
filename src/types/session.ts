export interface RawSession {
  id: number;
  name: string;
  admin_short_name: string;
  badge_name: string;
  // Description string, probably has HTML in it
  description: string;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  use_event_timezone: boolean;
  timezone: string;
  capacity: number | null;
  notes: string[] | null;
  location: string | null;
  track: string | null;
  session_included: boolean;
  direct_link: string;
  virtual_link: string | null;
  created_at: string;
  updated_at: string;
}

export type SessionsData = RawSession[];

export interface Session extends RawSession {
  hasEnded: boolean;
}
