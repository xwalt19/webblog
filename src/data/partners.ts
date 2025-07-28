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
    nameKey: "partners data.dycode name",
    logoUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?text=DyCode",
    descriptionKey: "partners data.dycode desc",
    type: "corporate",
  },
  {
    id: "p2",
    nameKey: "partners data.codeintech name",
    logoUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=CodeinTech",
    descriptionKey: "partners data.codeintech desc",
    type: "community",
  },
  {
    id: "p3",
    nameKey: "partners data.telkomuniversity name",
    logoUrl: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Telkom+University",
    descriptionKey: "partners data.telkomuniversity desc",
    type: "educational",
  },
  {
    id: "p4",
    nameKey: "partners data.itb name",
    logoUrl: "https://via.placeholder.com/150/FFFF00/000000?text=ITB",
    descriptionKey: "partners data.itb desc",
    type: "educational",
  },
  {
    id: "p5",
    nameKey: "partners data.startupbandung name",
    logoUrl: "https://via.placeholder.com/150/FF00FF/FFFFFF?text=Startup+Bandung",
    descriptionKey: "partners data.startupbandung desc",
    type: "community",
  },
];