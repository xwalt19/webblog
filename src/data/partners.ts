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
    logoUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?text=DyCode",
    descriptionKey: "dycode partner description",
    type: "corporate",
  },
  {
    id: "p2",
    nameKey: "codeintech partner name",
    logoUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=CodeinTech",
    descriptionKey: "codeintech partner description",
    type: "community",
  },
  {
    id: "p3",
    nameKey: "telkom university partner name",
    logoUrl: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Telkom+University",
    descriptionKey: "telkom university partner description",
    type: "educational",
  },
  {
    id: "p4",
    nameKey: "itb partner name",
    logoUrl: "https://via.placeholder.com/150/FFFF00/000000?text=ITB",
    descriptionKey: "itb partner description",
    type: "educational",
  },
  {
    id: "p5",
    nameKey: "startup bandung partner name",
    logoUrl: "https://via.placeholder.com/150/FF00FF/FFFFFF?text=Startup+Bandung",
    descriptionKey: "startup bandung partner description",
    type: "community",
  },
];