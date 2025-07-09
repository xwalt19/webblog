import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import MobileNav from "./MobileNav"; // Import MobileNav component
import { cn } from "@/lib/utils"; // Import cn utility

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header (Navbar) */}
      <header className="sticky top-0 z-50 bg-background shadow-sm border-b border-border"> {/* Changed background to bg-background and added shadow */}
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary"> {/* Kept text-primary for logo */}
            ProCodeCG
          </Link>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className={cn(navigationMenuTriggerStyle(), "bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground")}>
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className={cn(navigationMenuTriggerStyle(), "bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground")}>
                  About
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/blog" className={cn(navigationMenuTriggerStyle(), "bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground")}>
                  Blog
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/archives" className={cn(navigationMenuTriggerStyle(), "bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground")}>
                  Archives
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground">Activity</NavigationMenuTrigger> {/* Adjusted background to bg-background */}
                <NavigationMenuContent className="bg-background text-foreground border-border"> {/* Light background for content */}
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/info/regular-events-classes"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" // Adjusted hover/focus colors
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">REGULAR EVENTS & CLASSES</div> {/* Ensure text is foreground */}
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground"> {/* Muted foreground for description */}
                            Jadwal rutin kelas dan acara mingguan kami.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/info/camps"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">CAMPS</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Program intensif liburan sekolah dan akhir pekan.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/info/training"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">TRAINING</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Pelatihan khusus untuk individu dan korporasi.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* New Media Navigation Item */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground">Media</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background text-foreground border-border md:left-auto md:right-0"> {/* Added md:left-auto md:right-0 */}
                  <ul className="grid gap-3 p-4 md:w-[200px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/media/youtube"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">YouTube</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Video tutorial dan vlog kami.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/media/tiktok"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">TikTok</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Video singkat dan tips coding.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground">Info</NavigationMenuTrigger> {/* Adjusted background to bg-background */}
                <NavigationMenuContent className="bg-background text-foreground border-border"> {/* Light background for content */}
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/contact-us"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">CONTACT US</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Hubungi kami untuk pertanyaan atau kolaborasi.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/partners"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">PARTNERS</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Lihat mitra dan kolaborator kami.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu */}
          <MobileNav />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-footer py-4 text-center text-sm text-white border-t border-border">
        <div className="container mx-auto px-4">
          © 2025 Copyright by ProCodeCG. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;