import React from 'react';
import { Scan } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  isCollapsed?: boolean;
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ isCollapsed, className }) => {
  return (
    <div className={cn("flex items-center gap-2 font-semibold", isCollapsed ? "justify-center" : "", className)}>
      <Scan className="h-6 w-6" />
      {!isCollapsed && <span className="text-lg">Absenku</span>}
    </div>
  );
};

export { AppLogo };