import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      {isMobile ? (
        // Mobile layout (top bar)
        <header className="bg-primary text-primary-foreground p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">
              Blog Kurusiu
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/archives" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Archives
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </header>
      ) : (
        // Desktop sidebar
        <aside className="w-64 bg-sidebar text-sidebar-foreground p-4 shadow-lg flex flex-col fixed h-full top-0 left-0 z-10">
          <Link to="/" className="text-2xl font-bold mb-8 text-sidebar-primary">
            Blog Kurusiu
          </Link>
          <NavigationMenu orientation="vertical" className="flex-grow">
            <NavigationMenuList className="flex flex-col items-start space-y-2">
              <NavigationMenuItem className="w-full">
                <Link to="/" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "w-full justify-start")}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="w-full">
                <Link to="/archives" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "w-full justify-start")}>
                    Archives
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </aside>
      )}

      <div className={cn("flex-grow flex flex-col", !isMobile && "ml-64")}>
        <main className="flex-grow p-4">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
        <footer className="bg-secondary text-secondary-foreground p-4 text-center mt-8">
          <Separator className="my-4" />
          <p>&copy; {new Date().getFullYear()} Blog Kurusiu. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;