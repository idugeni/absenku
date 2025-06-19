// src/components/layout/Header.tsx

import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

// --> Peningkatan Fungsional & Komponen Baru
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Komponen Inti yang sudah ada
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuGroup, DropdownMenuShortcut } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Ikon
import { Menu, Search, Bell, Settings, LifeBuoy, LogOut, User, LayoutDashboard } from 'lucide-react';

// Logika & Data
import { useAuth } from '@/hooks/useAuth';
import { NavLinkItem } from '@/components/navigation/NavLinkItem';
import { AppLogo } from '@/components/branding/AppLogo';
import { navigationItems } from '@/lib/utils'; // Asumsi ini berisi { to, label, icon }

// Helper untuk mendapatkan inisial nama
const getInitials = (name: string) => {
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.slice(0, 2).toUpperCase();
};


// --> SUB-KOMPONEN: UserNav (Menu Pengguna)
const UserNav = () => {
  const { appUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!appUser) return null;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={appUser.photoURL} alt={appUser.displayName} />
                <AvatarFallback>{getInitials(appUser.displayName)}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Profil & Pengaturan</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{appUser.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{appUser.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Pengaturan</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/support')}>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Dukungan</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Keluar</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


// --> SUB-KOMPONEN: GlobalSearch (Command Menu)
const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  
  const runCommand = (command: () => void) => {
    setIsOpen(false);
    command();
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsOpen(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
            <p>Pencarian</p>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
            </kbd>
        </TooltipContent>
      </Tooltip>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Ketik perintah atau cari..." />
        <CommandList>
          <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
          <CommandGroup heading="Saran">
            {navigationItems.map((item) => (
               <CommandItem key={item.to} onSelect={() => runCommand(() => navigate(item.to))}>
                 <item.icon className="mr-2 h-4 w-4" />
                 <span>{item.label}</span>
               </CommandItem>
            ))}
            <CommandItem onSelect={() => runCommand(() => navigate('/settings'))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};


// --> SUB-KOMPONEN: MobileNav (Sheet)
const MobileNav = () => {
    const { logout } = useAuth();
    const location = useLocation();
    
    // State untuk sheet kini dikelola secara internal
    const [isOpen, setIsOpen] = useState(false);
    
    const closeNav = () => setIsOpen(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Buka Menu Navigasi</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs p-0">
            <nav className="flex flex-col h-full">
              <div className="p-4 border-b">
                 <AppLogo />
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid gap-2 text-lg font-medium">
                  {navigationItems.map((item) => (
                    <NavLinkItem
                      key={item.to}
                      to={item.to}
                      icon={item.icon}
                      label={item.label}
                      isCollapsed={false}
                      isActive={location.pathname === item.to}
                      onClick={closeNav}
                    />
                  ))}
                </div>
              </div>
               <div className="mt-auto p-4 border-t">
                  <Button variant="ghost" className="w-full justify-start text-base" onClick={() => { closeNav(); logout(); }}>
                      <LogOut className="h-5 w-5 mr-3" />
                      Keluar
                  </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
    )
}

// --> SUB-KOMPONEN: DynamicBreadcrumb
const DynamicBreadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    // Capitalize helper
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');

    return (
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/"><LayoutDashboard className="h-4 w-4" /></Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            return (
              <React.Fragment key={to}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="font-medium text-foreground">{capitalize(value)}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                        <Link to={to}>{capitalize(value)}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    )
}


// ===== KOMPONEN HEADER UTAMA =====
const Header: React.FC = () => {
  return (
    <TooltipProvider delayDuration={0}>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        
        {/* Navigasi Mobile (kini menjadi komponen sendiri) */}
        <MobileNav />

        {/* Breadcrumbs Dinamis untuk Desktop */}
        <DynamicBreadcrumb />

        <div className="ml-auto flex items-center gap-2">
          {/* Pencarian Global */}
          <GlobalSearch />
          
          {/* Notifikasi */}
          <Tooltip>
            <TooltipTrigger asChild>
                <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                          <Bell className="h-5 w-5" />
                          <span className="sr-only">Notifikasi</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-80">
                        <div className="p-4">
                            <h4 className="font-medium">Notifikasi</h4>
                            <p className="text-sm text-muted-foreground">Anda tidak memiliki notifikasi baru.</p>
                            {/* Di sini Anda bisa me-render daftar notifikasi */}
                        </div>
                    </PopoverContent>
                </Popover>
            </TooltipTrigger>
            <TooltipContent>Notifikasi</TooltipContent>
          </Tooltip>

          {/* Menu Pengguna */}
          <UserNav />
        </div>
      </header>
    </TooltipProvider>
  );
};

export default Header;