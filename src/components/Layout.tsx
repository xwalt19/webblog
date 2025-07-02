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
      <header className="sticky top-0 z-50 bg-blue-100 backdrop-blur-sm border-b border-border"> {/* Changed background to bg-blue-100 */}
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary"> {/* Changed text color to primary */}
            ProCodeCG
          </Link>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-blue-100 text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground")}> {/* Adjusted background to bg-blue-100 */}
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-blue-100 text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground")}> {/* Adjusted background to bg-blue-100 */}
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/blog" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-blue-100 text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground")}> {/* Adjusted background to bg-blue-100 */}
                    Blog
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/archives" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-blue-100 text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground")}> {/* Adjusted background to bg-blue-100 */}
                    Archives
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-blue-100 text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground">Activity</NavigationMenuTrigger> {/* Adjusted background to bg-blue-100 */}
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
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-blue-100 text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground">Info</NavigationMenuTrigger> {/* Adjusted background to bg-blue-100 */}
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
      <footer className="bg-secondary text-secondary-foreground p-8 mt-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/blog" className="hover:underline">Blog</Link></li>
              <li><Link to="/archives" className="hover:underline">Archives</Link></li>
              <li><Link to="/contact-us" className="hover:underline">Contact Us</Link></li>
              <li><Link to="/partners" className="hover:underline">Partners</Link></li>
              <li><Link to="/info" className="hover:underline">Info</Link></li>
            </ul>
          </div>

          {/* Contact Info / Placeholder */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hubungi Kami</h3>
            <p>Email: info@procodecg.com</p>
            <p>Telepon: +62 123 4567</p>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="LinkedIn" className="hover:text-primary-foreground"><Linkedin size={24} /></a>
              <a href="#" aria-label="Instagram" className="hover:text-primary-foreground"><Instagram size={24} /></a>
              <a href="#" aria-label="Twitter" className="hover:text-primary-foreground"><Twitter size={24} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-primary-foreground"><Facebook size={24} /></a>
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-border" />
        <p className="text-center text-sm">&copy; {new Date().getFullYear()} ProCodeCG. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;