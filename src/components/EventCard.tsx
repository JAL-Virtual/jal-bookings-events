import Image from "next/image";

interface EventCardProps {
  eventId: string;
  imageSrc?: string;
  eventName: string;
  eventType: string;
  description: string;
  tbd?: boolean;
}

export function EventCard({ 
  eventId, 
  imageSrc, 
  eventName, 
  eventType, 
  description, 
  tbd = false 
}: EventCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden max-w-sm">
      {imageSrc && (
        <div className="h-48 bg-gray-200 dark:bg-gray-700">
          <Image 
            src={imageSrc} 
            alt={eventName}
            width={400}
            height={192}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {eventName}
          </h3>
          {tbd && (
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              TBD
            </span>
          )}
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
          {eventType}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
          {description}
        </p>
        <div className="mt-4">
          <a 
            href={`/event/${eventId}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
}