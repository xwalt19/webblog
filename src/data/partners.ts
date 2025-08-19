export interface Partner {
  id: string;
  nameKey: string;
  logoUrl: string;
  descriptionKey: string;
  type: "corporate" | "community" | "educational";
}

export const dummyPartners: Partner[] = [
  {
    id: "p1",
    nameKey: "dycode partner name",
    logoUrl: "/assets/DyCode.png", // Mengoreksi jalur dan nama file
    descriptionKey: "dycode partner description",
    type: "corporate",
  },
  {
    id: "p2",
    nameKey: "codeintech partner name",
    logoUrl: "/assets/CodeinTech.jpg",
    descriptionKey: "codeintech partner description",
    type: "community",
  },
  {
    id: "p3",
    nameKey: "telkom university partner name",
    logoUrl: "/assets/Telkom University.png",
    descriptionKey: "telkom university partner description",
    type: "educational",
  },
  {
    id: "p4",
    nameKey: "itb partner name",
    logoUrl: "/assets/Institut Teknologi Bandung.webp",
    descriptionKey: "itb partner description",
    type: "educational",
  },
  {
    id: "p5",
    nameKey: "startup bandung partner name",
    logoUrl: "/assets/Startup Bandung.png",
    descriptionKey: "startup bandung partner description",
    type: "community",
  },
];