"use client";

import { EventListLayout } from "../../components/layouts/EventListLayout";
import { useEvents } from "../../hooks/event/useEventList";
import { ActionButton } from "../../components/buttons/ActionButton";
import { PageTransition, LoadingTransition } from "../../components";

// Optimized loading components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-32">
    <div className="relative">
      <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-r-green-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
    </div>
  </div>
);

const LoadingButton = () => (
  <div className="flex justify-center mt-8">
    <div className="px-6 py-3 bg-gray-600 rounded-lg animate-pulse">
      <div className="h-4 w-24 bg-gray-500 rounded"></div>
    </div>
  </div>
);

export default function EventsListPage() {
  const {isLoading, hasNextPage, isFetchingNextPage, fetchNextPage} = useEvents();

  return (
    <PageTransition type="slide" direction="up">
      <EventListLayout>
        <LoadingTransition isLoading={isLoading} loadingComponent={<LoadingSpinner/>}>
          <p className="font-header text-light-gray-2 dark:text-white text-center md:text-left">
            Events
          </p>
          <div className="mt-8 text-center">
            <p className="text-light-gray-2 dark:text-white">Events will be displayed here.</p>
          </div>
          {(hasNextPage) && (
            <div className="flex justify-center mt-8">
              {isFetchingNextPage ? <LoadingButton/> : (
                <ActionButton content="Ver mais eventos" backgroundFilled={false} onClick={() => fetchNextPage()}/>
              )}
            </div>
          )}
        </LoadingTransition>
      </EventListLayout>
    </PageTransition>
  );
}