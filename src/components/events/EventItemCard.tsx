// src/components/events/EventItemCard.tsx

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, MapPin, Users, QrCode, Edit, Trash2, Eye } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // Pastikan Anda memiliki fungsi cn dari shadcn
import { Event } from '@/types';

// Mengelola varian style komponen secara deklaratif
const cardVariants = cva(
  "p-5 rounded-lg border transition-all duration-300 ease-in-out",
  {
    variants: {
      viewMode: {
        dashboard: "border-gray-200 hover:border-primary/70 hover:shadow-xl bg-card transform hover:-translate-y-1",
        dialog: "border-border hover:border-primary/50 hover:shadow-md rounded-xl bg-card"
      }
    },
    defaultVariants: {
      viewMode: "dashboard",
    },
  }
);

interface EventItemCardProps extends VariantProps<typeof cardVariants> {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
  onShowQR: () => void;
  onShowDetail: () => void;
  // Terima fungsi helper sebagai props dari parent
  formatDateTime: (date: any) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  className?: string;
}

// Memo-kan komponen untuk mencegah re-render yang tidak perlu
export const EventItemCard = React.memo(({
  event,
  viewMode,
  onEdit,
  onDelete,
  onShowQR,
  onShowDetail,
  formatDateTime,
  getStatusBadge,
  className,
}: EventItemCardProps) => {

  const iconColor = viewMode === 'dashboard' ? 'text-indigo-500' : 'text-primary';
  
  return (
    <div className={cn(cardVariants({ viewMode }), className)}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className={cn("font-semibold truncate text-foreground mb-1", viewMode === 'dashboard' ? 'text-xl' : 'text-lg')}>
            {event.name}
          </h3>
          <p className="text-sm leading-relaxed mb-2 text-muted-foreground line-clamp-2">{event.description}</p>
          
          {viewMode === 'dashboard' && (
            <div className="flex items-center space-x-2 text-sm text-foreground mb-2.5">
              <MapPin className={cn("h-5 w-5 flex-shrink-0", iconColor)} />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          <Badge variant={viewMode === 'dashboard' ? 'default' : 'secondary'} className={viewMode === 'dashboard' ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : undefined}>
            {event.category}
          </Badge>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end space-y-2">
          {getStatusBadge(event.status)}
          {viewMode === 'dialog' && (
            <div className="flex space-x-1.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={onEdit} aria-label="Edit Kegiatan">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Edit</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="destructive" size="icon" onClick={onDelete} aria-label="Hapus Kegiatan">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Hapus</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>

      {viewMode === 'dashboard' ? (
        <div className="text-sm mb-4 border-t pt-3 mt-3">
          <div className="flex items-center space-x-2">
            <Calendar className={cn("h-5 w-5 flex-shrink-0", iconColor)} />
            <span className="text-foreground">{formatDateTime(event.startDate)}</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground mb-4 pt-3 mt-3 border-t">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <div><p className="text-xs">Mulai</p><p className="text-foreground font-medium">{formatDateTime(event.startDate)}</p></div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <div><p className="text-xs">Selesai</p><p className="text-foreground font-medium">{formatDateTime(event.endDate)}</p></div>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <div><p className="text-xs">Lokasi</p><p className="text-foreground font-medium truncate">{event.location}</p></div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center space-x-2 text-sm">
          <Users className={cn("h-5 w-5 flex-shrink-0", iconColor)} />
          <span className="text-foreground font-medium">
            {event.assignedPegawai?.length || 0} partisipan
          </span>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant={viewMode === 'dashboard' ? 'default' : 'outline'} className={viewMode === 'dashboard' ? "bg-indigo-600 hover:bg-indigo-700 text-white" : undefined} onClick={onShowQR}>
            <QrCode className="h-4 w-4 mr-1.5" /> QR Code
          </Button>
          <Button size="sm" variant="outline" onClick={onShowDetail}>
            <Eye className="h-4 w-4 mr-1.5" /> Detail
          </Button>
        </div>
      </div>
    </div>
  );
});