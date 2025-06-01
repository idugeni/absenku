import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn, getPageTitle, navigationItems } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AppLogo } from '@/components/branding/AppLogo';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { NavLinkItem } from '@/components/navigation/NavLinkItem';
import { useAuth } from '@/contexts/useAuth';
import { AuthContextType } from '@/contexts/AuthContextDefinition';

const MainLayout: React.FC = () => {
  const { loading } = useAuth() as AuthContextType;
  const [isCollapsed, setIsCollapsed] = React.useState(
    false
  );
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  const pageTitle = React.useMemo(() => {
    return getPageTitle(location.pathname, navigationItems);
  }, [location.pathname]);

  return (
    <TooltipProvider>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
      <div className="flex min-h-screen w-full bg-muted/40">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
            isCollapsed ? "w-16" : "w-64",
            "hidden sm:flex"
          )}
        >
          <div className="flex h-16 items-center px-4 border-b shrink-0">
            <AppLogo isCollapsed={isCollapsed} />
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto rounded-full"
              onClick={() => {
                setIsCollapsed(!isCollapsed);
              }}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
              <VisuallyHidden>Toggle Sidebar</VisuallyHidden>
            </Button>
          </div>
          <nav className="flex-1 overflow-auto p-2">
            {navigationItems.map((item) => (
              <NavLinkItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
                isActive={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to + '/'))}
              />
            ))}
          </nav>
        </aside>

        <div className={cn(
          "flex flex-col",
          isCollapsed ? "sm:pl-16" : "sm:pl-64",
          "w-full"
        )}>
          <Header
            pageTitle={pageTitle}
            isMobileNavOpen={isMobileNavOpen}
            setIsMobileNavOpen={setIsMobileNavOpen}
            closeMobileNav={closeMobileNav}
          />
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MainLayout;