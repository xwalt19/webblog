import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
          <Link to="/info" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeSheet}>
            Info
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;