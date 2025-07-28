export interface Course {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
}

export const dummyCourses: Course[] = [
  {
    id: "c1",
    titleKey: "featured courses.c1 title",
    descriptionKey: "featured courses.c1 desc",
    image: "/images/html-css-course.jpg",
  },
  {
    id: "c2",
    titleKey: "featured courses.c2 title",
    descriptionKey: "featured courses.c2 desc",
    image: "/images/javascript-course.jpg",
  },
  {
    id: "c3",
    titleKey: "featured courses.c3 title",
    descriptionKey: "featured courses.c3 desc",
    image: "/images/react-course.jpg",
  },
  {
    id: "c4",
    titleKey: "featured courses.c4 title",
    descriptionKey: "featured courses.c4 desc",
    image: "/images/python-course.jpg",
  },
  {
    id: "c5",
    titleKey: "featured courses.c5 title",
    descriptionKey: "featured courses.c5 desc",
    image: "https://source.unsplash.com/random/400x250/?web-design,ui-ux",
  },
  {
    id: "c6",
    titleKey: "featured courses.c6 title",
    descriptionKey: "featured courses.c6 desc",
    image: "https://source.unsplash.com/random/400x250/?data-science,machine-learning",
  },
];