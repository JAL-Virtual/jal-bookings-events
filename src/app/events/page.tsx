"use client";

import { Fragment } from "react";
import { EventListLayout } from "../../components/layouts/EventListLayout";
import { useEvents } from "../../hooks/event/useEventList";
import { ActionButton } from "../../components/buttons/ActionButton";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { RequireAuthGuard } from "../../components/RequireAuthGuard";

export default function EventsListPage() {
  const {isLoading, hasNextPage, isFetchingNextPage, fetchNextPage} = useEvents();

  return (
    <RequireAuthGuard>
      <EventListLayout>
        {isLoading ? <LoadingIndicator/> : (
          <>
            <p className="font-header text-light-gray-2 dark:text-white text-center md:text-left">
              Events
            </p>
            <div className="mt-8 text-center">
              <p className="text-light-gray-2 dark:text-white">Events will be displayed here.</p>
            </div>
            {(hasNextPage) && (
              <div className="flex justify-center mt-8">
                {isFetchingNextPage ? <LoadingIndicator/> : (
                  <ActionButton content="Ver mais eventos" backgroundFilled={false} onClick={() => fetchNextPage()}/>
                )}
              </div>
            )}
          </>
        )}
      </EventListLayout>
    </RequireAuthGuard>
  );
}