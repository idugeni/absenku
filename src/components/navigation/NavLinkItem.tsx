import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface NavLinkItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
  mobile?: boolean;
  onClick?: () => void;
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({
  to,
  icon: Icon,
  label,
  isCollapsed,
  isActive,
  mobile = false,
  onClick,
}) => {
  const linkClasses = cn(
    "flex items-center gap-3 rounded-lg px-4 py-2 text-muted-foreground transition-all hover:text-foreground",
    isActive && "bg-muted text-foreground font-semibold",
    mobile ? "text-base font-medium py-2.5" : "text-sm",
    isCollapsed && !mobile ? "justify-center" : ""
  );

  const content = (
    <>
      <Icon className={cn("h-4 w-4", mobile && "h-5 w-5")} />
      {(!isCollapsed || mobile) && <span className={cn(mobile && "ml-1")}>{label}</span>}
      {isCollapsed && !mobile && <span className="sr-only">{label}</span>}
    </>
  );

  if (mobile) {
    return (
      <RouterNavLink to={to} className={linkClasses} onClick={onClick}>
        {content}
      </RouterNavLink>
    );
  }

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <RouterNavLink to={to} className={linkClasses} onClick={onClick}>
          {content}
        </RouterNavLink>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right" sideOffset={5}>
          {label}
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export { NavLinkItem };