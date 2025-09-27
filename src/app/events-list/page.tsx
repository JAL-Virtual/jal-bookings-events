import {Fragment} from "react";
import {EventListLayout} from "../../layouts/EventListLayout";
import {useEventList} from "../../hooks/useEventList";
import {EventCard} from "../../components/EventCard";
import {ActionButton} from "../../components/buttons/ActionButton";
import {LoadingIndicator} from "../../components/LoadingIndicator";
import {getEventTypeName} from "../../types/Event";
import {useText} from "../../hooks/useText";
import {RequireAuthGuard} from "../../components/RequireAuthGuard";

export default function EventsListPage() {
  const {t} = useText();
  const {pages, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage} = useEventList();
  const totalFound = pages?.[0]?.total || 0;

  return (
    <RequireAuthGuard>
      <EventListLayout>
        {isLoading ? <LoadingIndicator/> : (
          <>
            <p className="font-header text-light-gray-2 dark:text-white text-center md:text-left">
              {t('events.found', {count: totalFound})}
            </p>
            <div className="mt-8 flex flex-col md:flex-row gap-12 xl:gap-24 items-center md:items-start flex-wrap">
              {pages?.map(eventPage => (
                <Fragment key={eventPage.page}>
                  {eventPage.data.map((event) => {
                    return (
                      <Fragment key={event.id}>
                        <EventCard
                          eventId={event.id.toString()}
                          imageSrc={event.banner}
                          eventName={event.name}
                          eventType={getEventTypeName(event.type)}
                          description={event.description}
                          tbd={event.has_ended}/>
                      </Fragment>
                    )
                  })}
                </Fragment>
              ))}
            </div>
            {(hasNextPage) && (
              <div className="flex justify-center mt-8">
                {isFetchingNextPage ? <LoadingIndicator/> : (
                  <ActionButton 
                    content="Ver mais eventos" 
                    backgroundFilled={false} 
                    onClick={() => fetchNextPage()}
                  />
                )}
              </div>
            )}
          </>
        )}
      </EventListLayout>
    </RequireAuthGuard>
  );
}
