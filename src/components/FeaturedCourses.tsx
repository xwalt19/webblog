import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation

interface Course {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
}

const dummyCourses: Course[] = [
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
];

const FeaturedCourses: React.FC = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <section className="py-12 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t('featured courses title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dummyCourses.slice(0, 3).map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden">
              <img src={course.image} alt={t(course.titleKey)} className="w-full h-48 object-cover" />
              <CardHeader className="flex-grow">
                <CardTitle className="text-xl">{t(course.titleKey)}</CardTitle>
                <CardDescription>{t(course.descriptionKey)}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Link to={`/courses/${course.id}`}>
                  <Button variant="outline" className="w-full">{t('view details')}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/courses">
            <Button size="lg" variant="default">{t('view all courses')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;