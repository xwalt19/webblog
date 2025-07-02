import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle mobile menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-4 pt-10">
        <Link to="/" className="text-2xl font-bold text-primary mb-6 block" onClick={closeSheet}>
          ProCodeCG
        </Link>
        <nav className="flex flex-col space-y-4">
          <Link to="/" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeSheet}>
            Home
          </Link>
          <Link to="/about" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeSheet}>
            About
          </Link>
          <Link to="/blog" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeSheet}>
            Blog
          </Link>
          <Link to="/archives" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeSheet}>
            Archives
          </Link>
          
          {/* Activity with Accordion for sub-items */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="py-0 text-lg font-medium hover:no-underline hover:text-primary transition-colors">
                Activity
              </AccordionTrigger>
              <AccordionContent className="pl-4 pt-2 pb-0 space-y-2">
                <Link to="/info/regular-events-classes" className="block text-base text-muted-foreground hover:text-primary transition-colors" onClick={closeSheet}>
                  REGULAR EVENTS & CLASSES
                </Link>
                <Link to="/info/camps" className="block text-base text-muted-foreground hover:text-primary transition-colors" onClick={closeSheet}>
                  CAMPS
                </Link>
                <Link to="/info/training" className="block text-base text-muted-foreground hover:text-primary transition-colors" onClick={closeSheet}>
                  TRAINING
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link to="/contact-us" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeSheet}>
            Contact Us
          </Link>
          <Link to="/partners" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeSheet}>
            Partners
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;