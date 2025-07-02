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
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-gray-700"> {/* Changed text color and hover */}
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle mobile menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-4 pt-10 bg-gray-900 text-white"> {/* Changed background and text color */}
        <Link to="/" className="text-2xl font-bold text-white mb-6 block" onClick={closeSheet}> {/* Changed text color */}
          ProCodeCG
        </Link>
        <nav className="flex flex-col space-y-4">
          <Link to="/" className="text-lg font-medium text-white hover:text-gray-300 transition-colors" onClick={closeSheet}> {/* Changed text and hover colors */}
            Home
          </Link>
          <Link to="/about" className="text-lg font-medium text-white hover:text-gray-300 transition-colors" onClick={closeSheet}>
            About
          </Link>
          <Link to="/blog" className="text-lg font-medium text-white hover:text-gray-300 transition-colors" onClick={closeSheet}>
            Blog
          </Link>
          <Link to="/archives" className="text-lg font-medium text-white hover:text-gray-300 transition-colors" onClick={closeSheet}>
            Archives
          </Link>
          
          {/* Activity with Accordion for sub-items */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="py-0 text-lg font-medium text-white hover:no-underline hover:text-gray-300 transition-colors"> {/* Changed text and hover colors */}
                Activity
              </AccordionTrigger>
              <AccordionContent className="pl-4 pt-2 pb-0 space-y-2">
                <Link to="/info/regular-events-classes" className="block text-base text-gray-300 hover:text-white transition-colors" onClick={closeSheet}> {/* Adjusted text and hover colors */}
                  REGULAR EVENTS & CLASSES
                </Link>
                <Link to="/info/camps" className="block text-base text-gray-300 hover:text-white transition-colors" onClick={closeSheet}>
                  CAMPS
                </Link>
                <Link to="/info/training" className="block text-base text-gray-300 hover:text-white transition-colors" onClick={closeSheet}>
                  TRAINING
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Info with Accordion for sub-items */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-2" className="border-b-0">
              <AccordionTrigger className="py-0 text-lg font-medium text-white hover:no-underline hover:text-gray-300 transition-colors"> {/* Changed text and hover colors */}
                Info
              </AccordionTrigger>
              <AccordionContent className="pl-4 pt-2 pb-0 space-y-2">
                <Link to="/contact-us" className="block text-base text-gray-300 hover:text-white transition-colors" onClick={closeSheet}>
                  CONTACT US
                </Link>
                <Link to="/partners" className="block text-base text-gray-300 hover:text-white transition-colors" onClick={closeSheet}>
                  PARTNERS
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;