export const getYouTubeEmbedUrl = (url: string): string | null => {
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/;
  const match = url.match(regExp);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  }
  return null;
};