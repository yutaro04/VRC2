import { Calendar, User, Monitor, Smartphone, Image as ImageIcon } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  organizer: string;
  image: string;
  device: 'PC' | 'All' | 'Android';
  participants?: number;
}

export function EventCard({ title, date, organizer, device, participants }: EventCardProps) {
  const getDeviceIcon = () => {
    if (device === 'PC') return <Monitor className="w-4 h-4" />;
    if (device === 'Android') return <Smartphone className="w-4 h-4" />;
    return <span className="text-xs">ALL</span>;
  };
  
  return (
    <div className="group relative w-[200px] sm:w-[160px] flex-shrink-0">
      <div className="relative bg-white border border-gray-900 rounded overflow-hidden transition-all hover:border-gray-600">
        {/* Image as background */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <div className="w-full h-full flex items-center justify-center bg-neutral-800">
            <ImageIcon className="w-12 h-12 text-neutral-600" />
          </div>
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          {/* Device badge */}
          <div className="absolute top-1 sm:top-1 right-1 sm:right-1 bg-white/90 backdrop-blur-sm border border-gray-900 rounded px-1.5 sm:px-1 py-1 sm:py-0.5 flex items-center gap-0.5 text-gray-900" style={{ fontSize: '10px' }}>
            {getDeviceIcon()}
          </div>

          {/* Participants count if available */}
          {participants && (
            <div className="absolute top-1 sm:top-1 left-1 sm:left-1 bg-white/90 backdrop-blur-sm border border-gray-900 rounded px-1.5 sm:px-1 py-1 sm:py-0.5 flex items-center gap-0.5 text-gray-900" style={{ fontSize: '10px' }}>
              <User className="w-3 h-3 sm:w-2 sm:h-2" />
              {participants}
            </div>
          )}

          {/* Content overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-1.5 space-y-1 sm:space-y-0.5">
            {/* Title */}
            <h3 className="text-white line-clamp-2" style={{ fontSize: '12px', lineHeight: '1.3' }}>
              {title}
            </h3>

            {/* Date */}
            <div className="flex items-center gap-1 sm:gap-0.5 text-gray-200" style={{ fontSize: '10px' }}>
              <Calendar className="w-3 h-3 sm:w-2 sm:h-2" />
              <span>{date}</span>
            </div>

            {/* Organizer */}
            <div className="flex items-center gap-1 sm:gap-0.5 text-gray-300" style={{ fontSize: '10px' }}>
              <User className="w-3 h-3 sm:w-2 sm:h-2" />
              <span className="truncate">{organizer}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
