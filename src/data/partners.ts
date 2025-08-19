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
    logoUrl: "/assets/partners/dycode-logo.png",
    descriptionKey: "dycode partner description",
    type: "corporate",
  },
  {
    id: "p2",
    nameKey: "codeintech partner name",
    logoUrl: "/assets/partners/codeintech-logo.png",
    descriptionKey: "codeintech partner description",
    type: "community",
  },
  {
    id: "p3",
    nameKey: "telkom university partner name",
    logoUrl: "/assets/partners/telkom-university-logo.png",
    descriptionKey: "telkom university partner description",
    type: "educational",
  },
  {
    id: "p4",
    nameKey: "itb partner name",
    logoUrl: "/assets/partners/itb-logo.png",
    descriptionKey: "itb partner description",
    type: "educational",
  },
  {
    id: "p5",
    nameKey: "startup bandung partner name",
    logoUrl: "/assets/partners/startup-bandung-logo.png",
    descriptionKey: "startup bandung partner description",
    type: "community",
  },
];