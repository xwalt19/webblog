export interface CalendarEvent {
  date: Date;
  title: string;
}

export const dummyCalendarEvents: CalendarEvent[] = [
  { date: new Date(2025, 0, 1), title: "new year event" },
  { date: new Date(2025, 0, 15), title: "html workshop event" },
  { date: new Date(2025, 1, 3), title: "javascript class starts event" },
  { date: new Date(2025, 1, 14), title: "react webinar event" },
  { date: new Date(2025, 2, 10), title: "codemeetup event" },
  { date: new Date(2025, 2, 22), title: "python training event" },
  { date: new Date(2025, 3, 1), title: "summer camp registration event" },
  { date: new Date(2025, 3, 18), title: "debugging session event" },
  { date: new Date(2025, 4, 5), title: "national education day event" },
  { date: new Date(2025, 4, 20), title: "final project presentation event" },
  { date: new Date(2025, 5, 1), title: "national holiday event" },
  { date: new Date(2025, 5, 15), title: "ui ux workshop event" },
  { date: new Date(2025, 6, 12), title: "kids coding class event" },
  { date: new Date(2025, 6, 19), title: "kids coding class event" },
  { date: new Date(2025, 6, 26), title: "kids coding class event" },
  { date: new Date(2025, 7, 5), title: "ai intro workshop event" },
  { date: new Date(2025, 7, 10), title: "codemeetup event" },
  { date: new Date(2025, 8, 1), title: "new class starts event" },
  { date: new Date(2025, 8, 17), title: "independence day event" },
  { date: new Date(2025, 9, 10), title: "cybersecurity seminar event" },
  { date: new Date(2025, 10, 1), title: "holiday camp registration event" },
  { date: new Date(2025, 11, 25), title: "christmas holiday event" },
];