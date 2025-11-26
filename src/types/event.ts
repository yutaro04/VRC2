export interface Event {
  id: number;
  title: string;
  description?: string;
  device_id: number;
  device_name?: string;
  max_participants_num?: number;
  main_image_url: string;
  deadline?: string; // ISO 8601 date-time string
  event_dates: EventDate[];
  created_at: string;
  updated_at: string;
}

export interface EventDate {
  id: number;
  event_id?: number;
  start_date: string; // ISO 8601 date-time string
  end_date: string; // ISO 8601 date-time string
}

export interface EventParticipant {
  id: number;
  event_id: number;
  user_id: number;
  role: 'organizer' | 'participant';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  applied_at?: string;
}

export interface EventListResponse {
  events: Event[];
  total: number;
}
