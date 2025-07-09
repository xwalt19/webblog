"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProCodeCGCalendar: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Dummy events for demonstration
  const events = [
    { date: new Date(2025, 6, 12), title: "Kids Regular Coding Class" }, // July 12, 2025
    { date: new Date(2025, 6, 19), title: "Kids Regular Coding Class" }, // July 19, 2025
    { date: new Date(2025, 6, 26), title: "Kids Regular Coding Class" }, // July 26, 2025
    { date: new Date(2025, 7, 5), title: "Workshop Gratis: Pengantar AI" }, // August 5, 2025
    { date: new Date(2025, 7, 10), title: "ProCodeCG codeMeetUp()" }, // August 10, 2025
  ];

  const getDayEvents = (day: Date) => {
    return events.filter(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <Card className="flex-1 p-4 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">Kalender ProCodeCG</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow"
            modifiers={{
              hasEvent: events.map(event => event.date)
            }}
            modifiersStyles={{
              hasEvent: {
                fontWeight: 'bold',
                color: 'hsl(var(--primary))',
                backgroundColor: 'hsl(var(--accent))',
                borderRadius: '0.375rem', // rounded-md
              }
            }}
          />
        </CardContent>
      </Card>

      <Card className="flex-1 p-4 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">Detail Acara</CardTitle>
        </CardHeader>
        <CardContent>
          {date ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">
                Acara pada {date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}:
              </h3>
              {getDayEvents(date).length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  {getDayEvents(date).map((event, index) => (
                    <li key={index}>{event.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Tidak ada acara terjadwal pada tanggal ini.</p>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Pilih tanggal untuk melihat detail acara.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProCodeCGCalendar;