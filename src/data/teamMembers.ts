export interface TeamMember {
  name: string;
  roleKey: string; // Changed to roleKey
  avatarUrl: string;
  descriptionKey: string; // Changed to descriptionKey
}

export const dummyTeamMembers: TeamMember[] = [
  {
    name: "Marisa Paryasto",
    roleKey: "team member role marisa",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Marisa",
    descriptionKey: "team member desc marisa",
  },
  {
    name: "Budi Rahardjo",
    roleKey: "team member role budi",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Budi",
    descriptionKey: "team member desc budi",
  },
  {
    name: "Prayudi Utomo",
    roleKey: "team member role prayudi",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Prayudi",
    descriptionKey: "team member desc prayudi",
  },
  {
    name: "Faris Hafizhan Hakim",
    roleKey: "team member role faris",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Faris",
    descriptionKey: "team member desc faris",
  },
  {
    name: "Bullitt Zulfiqar",
    roleKey: "team member role bullitt",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Bullitt",
    descriptionKey: "team member desc bullitt",
  },
];