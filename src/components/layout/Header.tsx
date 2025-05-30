import React from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, ChevronLeft, LogOut, Search, Bell } from 'lucide-react';
import { NavLinkItem } from '@/components/navigation/NavLinkItem';
import { AppLogo } from '@/components/branding/AppLogo';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useLocation } from 'react-router-dom';
import { navigationItems } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  pageTitle: string;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
  closeMobileNav: () => void;
}

const Header: React.FC<HeaderProps> = ({
  pageTitle,
  isMobileNavOpen,
  setIsMobileNavOpen,
  closeMobileNav,
}) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:static sm:px-6">
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <VisuallyHidden>Toggle Navigation Menu</VisuallyHidden>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-[280px] py-6">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <TooltipProvider>
            <nav className="grid gap-2 text-lg font-medium px-4">
              <AppLogo className="mb-6" />
              {navigationItems.map((item) => (
                <NavLinkItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isCollapsed={false}
                  isActive={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to + '/'))}
                  mobile={true}
                  onClick={closeMobileNav}
                />
              ))}
              <Button variant="ghost" className="w-full justify-start text-lg font-medium text-muted-foreground hover:text-foreground" onClick={() => { logout(); closeMobileNav(); }}>
                <LogOut className="h-5 w-5 mr-3" />
                Keluar
              </Button>
            </nav>
          </TooltipProvider>
        </SheetContent>
      </Sheet>
      <h1 className="font-semibold text-lg md:text-xl">{pageTitle}</h1>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;