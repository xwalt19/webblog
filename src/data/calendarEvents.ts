export interface CalendarEvent {
  date: Date;
  title: string;
}

export const dummyCalendarEvents: CalendarEvent[] = [
  { date: new Date(2025, 0, 1), title: "events.new year" },
  { date: new Date(2025, 0, 15), title: "events.html workshop" },
  { date: new Date(2025, 1, 3), title: "events.javascript class starts" },
  { date: new Date(2025, 1, 14), title: "events.react webinar" },
  { date: new Date(2025, 2, 10), title: "events.codemeetup" },
  { date: new Date(2025, 2, 22), title: "events.python training" },
  { date: new Date(2025, 3, 1), title: "events.summer camp registration" },
  { date: new Date(2025, 3, 18), title: "events.debugging session" },
  { date: new Date(2025, 4, 5), title: "events.national education day" },
  { date: new Date(2025, 4, 20), title: "events.final project presentation" },
  { date: new Date(2025, 5, 1), title: "events.national holiday" },
  { date: new Date(2025, 5, 15), title: "events.uiux workshop" },
  { date: new Date(2025, 6, 12), title: "events.kids coding class" },
  { date: new Date(2025, 6, 19), title: "events.kids coding class" },
  { date: new Date(2025, 6, 26), title: "events.kids coding class" },
  { date: new Date(2025, 7, 5), title: "events.ai intro workshop" },
  { date: new Date(2025, 7, 10), title: "events.codemeetup" },
  { date: new Date(2025, 8, 1), title: "events.new class starts" },
  { date: new Date(2025, 8, 17), title: "events.independence day" },
  { date: new Date(2025, 9, 10), title: "events.cybersecurity seminar" },
  { date: new Date(2025, 10, 1), title: "events.holiday camp registration" },
  { date: new Date(2025, 11, 25), title: "events.christmas holiday" },
];