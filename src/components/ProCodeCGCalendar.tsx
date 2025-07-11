"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProCodeCGCalendar: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Dummy events for demonstration
  // Menggunakan tahun yang konsisten (misalnya, 2025) untuk semua acara agar lebih mudah dilihat
  const events = [
    { date: new Date(2025, 0, 1), title: "Tahun Baru" }, // Jan 1, 2025
    { date: new Date(2025, 0, 15), title: "Workshop HTML Dasar" }, // Jan 15, 2025
    { date: new Date(2025, 1, 3), title: "Kelas JavaScript Dimulai" }, // Feb 3, 2025
    { date: new Date(2025, 1, 14), title: "Webinar React.js" }, // Feb 14, 2025
    { date: new Date(2025, 2, 10), title: "ProCodeCG codeMeetUp()" }, // Mar 10, 2025
    { date: new Date(2025, 2, 22), title: "Pelatihan Python Data Science" }, // Mar 22, 2025
    { date: new Date(2025, 3, 1), title: "Pendaftaran Camp Musim Panas Dibuka" }, // Apr 1, 2025
    { date: new Date(2025, 3, 18), title: "Sesi Debugging Lanjutan" }, // Apr 18, 2025
    { date: new Date(2025, 4, 5), title: "Hari Pendidikan Nasional" }, // May 5, 2025
    { date: new Date(2025, 4, 20), title: "Presentasi Proyek Akhir" }, // May 20, 2025
    { date: new Date(2025, 5, 1), title: "Libur Nasional" }, // June 1, 2025
    { date: new Date(2025, 5, 15), title: "Workshop UI/UX" }, // June 15, 2025
    { date: new Date(2025, 6, 12), title: "Kids Regular Coding Class" }, // July 12, 2025
    { date: new Date(2025, 6, 19), title: "Kids Regular Coding Class" }, // July 19, 2025
    { date: new Date(2025, 6, 26), title: "Kids Regular Coding Class" }, // July 26, 2025
    { date: new Date(2025, 7, 5), title: "Workshop Gratis: Pengantar AI" }, // August 5, 2025
    { date: new Date(2025, 7, 10), title: "ProCodeCG codeMeetUp()" }, // August 10, 2025
    { date: new Date(2025, 8, 1), title: "Kelas Baru Dimulai" }, // Sep 1, 2025
    { date: new Date(2025, 8, 17), title: "Hari Proklamasi Kemerdekaan R.I." }, // Sep 17, 2025 (from image)
    { date: new Date(2025, 9, 10), title: "Seminar Keamanan Siber" }, // Oct 10, 2025
    { date: new Date(2025, 10, 1), title: "Pendaftaran Camp Liburan" }, // Nov 1, 2025
    { date: new Date(2025, 11, 25), title: "Libur Natal" }, // Dec 25, 2025
  ];

  const getDayEvents = (day: Date) => {
    return events.filter(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  return (
    <div className="flex justify-center"> {/* Center the single card */}
      <Card className="w-full max-w-4xl p-4 shadow-lg"> {/* Make it wider and centered */}
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">Kalender Acara ProCodeCG</CardTitle>
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
        {/* Bagian detail acara untuk tanggal yang dipilih */}
        {date && (
          <div className="mt-6 p-4 border-t border-border"> {/* Tambahkan bagian untuk acara hari yang dipilih */}
            <h3 className="text-lg font-semibold text-primary mb-2">
              Acara pada {date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}:
            </h3>
            {getDayEvents(date).length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {getDayEvents(date).map((event, index) => (
                  <li key={index}>{event.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Tidak ada acara terjadwal pada tanggal ini.</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProCodeCGCalendar;