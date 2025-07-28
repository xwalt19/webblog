export interface YouTubeVideo {
  id: string;
  titleKey: string;
  descriptionKey: string;
  thumbnail: string;
  videoUrl: string; 
  date: string;
}

export const dummyYouTubeVideos: YouTubeVideo[] = [
  {
    id: "yt1",
    titleKey: "youtube videos.yt1 title",
    descriptionKey: "youtube videos.yt1 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?html,coding",
    videoUrl: "https://www.youtube.com/watch?v=M_HTyO_y_0M", 
    date: "2024-01-01",
  },
  {
    id: "yt2",
    titleKey: "youtube videos.yt2 title",
    descriptionKey: "youtube videos.yt2 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?css,design",
    videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", 
    date: "2024-01-15",
  },
  {
    id: "yt3",
    titleKey: "youtube videos.yt3 title",
    descriptionKey: "youtube videos.yt3 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?javascript,web",
    videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5sks", 
    date: "2024-02-01",
  },
  {
    id: "yt4",
    titleKey: "youtube videos.yt4 title",
    descriptionKey: "youtube videos.yt4 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?react,frontend",
    videoUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM", 
    date: "2024-02-10",
  },
  {
    id: "yt5",
    titleKey: "youtube videos.yt5 title",
    descriptionKey: "youtube videos.yt5 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?python,programming",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw", 
    date: "2024-02-20",
  },
  {
    id: "yt6",
    titleKey: "youtube videos.yt6 title",
    descriptionKey: "youtube videos.yt6 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?tailwind,responsive",
    videoUrl: "https://www.youtube.com/watch?v=z_g_y_2_2_2", 
    date: "2024-03-05",
  },
  {
    id: "yt7",
    titleKey: "youtube videos.yt7 title",
    descriptionKey: "youtube videos.yt7 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?algorithm,datastructure",
    videoUrl: "https://www.youtube.com/watch?v=BBpAmxU_NQ8", 
    date: "2024-03-15",
  },
  {
    id: "yt8",
    titleKey: "youtube videos.yt8 title",
    descriptionKey: "youtube videos.yt8 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?debugging,javascript",
    videoUrl: "https://www.youtube.com/watch?v=gS_Y4_2_2_2", 
    date: "2024-03-25",
  },
  {
    id: "yt9",
    titleKey: "youtube videos.yt9 title",
    descriptionKey: "youtube videos.yt9 desc",
    thumbnail: "https://source.unsplash.com/random/400x250/?css,animation",
    videoUrl: "https://www.youtube.com/watch?v=z_g_y_2_2_2", 
    date: "2024-04-05",
  },
];