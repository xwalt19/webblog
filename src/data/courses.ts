export interface Course {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
}

export const dummyCourses: Course[] = [
  {
    id: "c1",
    titleKey: "html css course title",
    descriptionKey: "html css course description",
    image: "/images/html-css-course.jpg",
  },
  {
    id: "c2",
    titleKey: "javascript course title",
    descriptionKey: "javascript course description",
    image: "/images/javascript-course.jpg",
  },
  {
    id: "c3",
    titleKey: "react course title",
    descriptionKey: "react course description",
    image: "/images/react-course.jpg",
  },
  {
    id: "c4",
    titleKey: "python course title",
    descriptionKey: "python course description",
    image: "/images/python-course.jpg",
  },
  {
    id: "c5",
    titleKey: "web design ui ux course title",
    descriptionKey: "web design ui ux course description",
    image: "https://source.unsplash.com/random/400x250/?web-design,ui-ux",
  },
  {
    id: "c6",
    titleKey: "data science machine learning course title",
    descriptionKey: "data science machine learning course description",
    image: "https://source.unsplash.com/random/400x250/?data-science,machine-learning",
  },
];