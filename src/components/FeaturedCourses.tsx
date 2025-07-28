"use client";

import React, { useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import ikon navigasi
import { useTranslation } from "react-i18next";

interface Course {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
}

// TODO: Replace with data fetched from Supabase
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

const FeaturedCourses: React.FC = () => {
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-12 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t('featured courses title')}</h2>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {dummyCourses.map((course) => (
                <div key={course.id} className="flex-none w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 pl-4">
                  <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
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
                </div>
              ))}
            </div>
          </div>
          <Button
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-primary/80 hover:bg-primary text-primary-foreground rounded-full p-2 z-10"
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            size="icon"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-primary/80 hover:bg-primary text-primary-foreground rounded-full p-2 z-10"
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            size="icon"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
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