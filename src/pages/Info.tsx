import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components

const InfoPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectChange = (value: string) => {
    if (value && value !== "placeholder") { // Hindari navigasi jika nilai kosong atau placeholder
      navigate(`/info/${value}`);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Informasi Program Kami</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
        Temukan berbagai program dan kegiatan yang kami tawarkan untuk mengembangkan potensi Anda di dunia teknologi.
      </p>

      <div className="flex justify-center">
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Pilih Kategori Informasi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regular-events-classes">REGULAR EVENTS & CLASSES</SelectItem>
            <SelectItem value="camps">CAMPS</SelectItem>
            <SelectItem value="training">TRAINING</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default InfoPage;