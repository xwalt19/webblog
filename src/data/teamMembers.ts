export interface TeamMember {
  name: string;
  role: string;
  avatarUrl: string;
  description: string;
}

export const dummyTeamMembers: TeamMember[] = [
  {
    name: "Marisa Paryasto",
    role: "PhD Electrical Engineering Institute Technology Bandung, Researcher at ITB, Part-time Lecturer at Telkom University",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Marisa",
    description: "Experienced in teaching and education. An expert in computer engineering/science, programming and cryptography. A big admirer of kids.",
  },
  {
    name: "Budi Rahardjo",
    role: "Mentor",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Budi",
    description: "PhD, Faculty of Electrical Engineering Institute Technology Bandung",
  },
  {
    name: "Prayudi Utomo",
    role: "CodeinTech Founder",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Prayudi",
    description: "Programmer",
  },
  {
    name: "Faris Hafizhan Hakim",
    role: "Captain/Teaching Assistant/Junior Instructor",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Faris",
    description: "For Kids Classes",
  },
  {
    name: "Bullitt Zulfiqar",
    role: "Captain/Teaching Assistant/Junior Instructor",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Bullitt",
    description: "For Kids Classes",
  },
];