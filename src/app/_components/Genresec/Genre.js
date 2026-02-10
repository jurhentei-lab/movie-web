"use client";

import GenreList from "./GenreList";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Genre() {
  return (
    <div className="relative">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="w-[90px] h-[38px] flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 relative z-50 dark:border-slate-800 dark:hover:bg-slate-900 dark:text-slate-100">
              Genre
            </NavigationMenuTrigger>

            <NavigationMenuContent className="!fixed !left-1/2 !top-[72px] !w-[1000px] !max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl z-50 dark:border-slate-800 dark:bg-slate-950">
              <NavigationMenuLink>
                <GenreList />
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
 
