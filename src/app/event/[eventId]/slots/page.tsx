import {FilterState} from "../components/Filter";
import {LoadingIndicator} from "../components/LoadingIndicator";
import {BookInfoMessage} from "../components/BookInfoMessage";
import {SlotPageHeader} from "../components/SlotPageHeader";
import {SlotsTable} from "../components/SlotsTable";
import {SlotTypeFilter} from "../components/SlotTypeFilter";
import {useAirlineLogosFromSlots} from "../hooks/useAirlineLogosFromSlots";
import {useAirportInfoFromSlots} from "../hooks/useAirportInfoFromSlots";
import {useEventSlots} from "../hooks/useEventSlots";
import {useSlotCountByType} from "../hooks/useSlotCountByType";
import {useEventDetail} from "../hooks/useEventDetail";
import {useFlatInfiniteData} from "../hooks/useFlatInfiniteData";
import {useText} from "../hooks/useText";
import {useEffect, useMemo, useState} from "react";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {AirportDetails} from "../components/SlotsTable";
import {SlotScheduleData, Slot} from "../components/SlotsTable";
import {SlotTypeOptions} from "../types/SlotFilter";

export interface SlotsPageLocationState {
  hasError?: boolean;
  errorMessage?: string;
}

interface SlotBookError {
  hasError: boolean;
  errorMessage?: string;
}

let defaultSelectedSlot = SlotTypeOptions.LANDING;

export default function SlotsPage() {
  const [selectedSlotType, setSelectedSlotType] = useState<SlotTypeOptions | null>(defaultSelectedSlot);
  const [scheduleRequest, setBookingRequestError] = useState<SlotBookError>({hasError: false});
  const [appliedFilters, setAppliedFilters] = useState<Partial<FilterState>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {t} = useText();

  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = params?.eventId ? Number(params.eventId) : 0;

  const {data: event, isLoading: isLoadingEvent} = useEventDetail(eventId);

  const {
    data: slots,
    isLoading: isLoadingSlots,
    hasNextPage, isFetchingNextPage, fetchNextPage
  } = useEventSlots(eventId, selectedSlotType, appliedFilters);

  const tableData = useFlatInfiniteData(slots);

  const slotCountByType = useSlotCountByType(eventId);

  useEffect(() => {
    if(slotCountByType.data?.landing! > 0) {
      defaultSelectedSlot = SlotTypeOptions.LANDING;
    }
    else if(slotCountByType.data?.departure! > 0) {
      defaultSelectedSlot = SlotTypeOptions.TAKEOFF;
    }
    else if(slotCountByType.data?.departureLanding! > 0) {
      defaultSelectedSlot = SlotTypeOptions.TAKEOFF_LANDING;
    }
    setSelectedSlotType(defaultSelectedSlot);
  }, [slotCountByType.data]);

  useEffect(() => {
    const hasError = searchParams.get('error') === 'true';
    const errorMessage = searchParams.get('errorMessage');

    if (hasError && errorMessage) {
      setBookingRequestError({hasError: true, errorMessage});
      setSelectedSlotType(null);
      // Clear URL parameters
      router.replace(`/event/${eventId}/slots`);
    }
  }, [searchParams, router, eventId]);

  const airlineLogoQueries = useAirlineLogosFromSlots(tableData || [] as Slot[]);

  const airlineLogos = useMemo(() => {
    return airlineLogoQueries.map(queryResult => queryResult.data || null);
  }, [airlineLogoQueries]);

  const airportDetailsQueries = useAirportInfoFromSlots(tableData || [] as Slot[]);

  const airportDetailsMap = useMemo(() => {
    const result: Record<string, AirportDetails> = {};

    airportDetailsQueries.forEach(queryResult => {
      const {data} = queryResult;

      if (!data) {
        return;
      }

      result[data.icao] = data;
    });

    return result;
  }, [airportDetailsQueries]);

  const clearFlightNumberSearch = () => {
    setAppliedFilters(prevFilters => {
      const updatedFilters = {...prevFilters};
      delete updatedFilters.flightNumber;
      return updatedFilters;
    });
  }

  const onSlotBook = (slotId: number, slotData?: SlotScheduleData) => {
    const scheduleUrl = `/event/${eventId}/schedule/${slotId}`;
    if (slotData) {
      const params = new URLSearchParams();
      Object.entries(slotData).forEach(([key, value]) => {
        params.append(key, value);
      });
      router.push(`${scheduleUrl}?${params.toString()}`);
    } else {
      router.push(scheduleUrl);
    }
  }

  const onSlotTypeChange = (newType: SlotTypeOptions) => {
    setSelectedSlotType(newType);
    clearFlightNumberSearch();
  }

  const onFlightSearch = (flightNumber: string) => {
    if (flightNumber === "") {
      clearFlightNumberSearch();
      setSelectedSlotType(defaultSelectedSlot);
      return;
    }

    setSelectedSlotType(null);
    setAppliedFilters({flightNumber});
    setBookingRequestError({hasError: false, errorMessage: undefined});
  }

  const onFilterStateChange = (filterState: Partial<FilterState>, filterKeyCount: number) => {
    setAppliedFilters(filterState);

    if (filterKeyCount === 0 && selectedSlotType === null) {
      setSelectedSlotType(defaultSelectedSlot);
    }
  }

  const onScheduleErrorReset = () => {
    setBookingRequestError({hasError: false, errorMessage: undefined});
    setAppliedFilters({});
    setSelectedSlotType(defaultSelectedSlot);
  }

  const scrollBarClassName = "lg:h-slot-table lg:mt-5 lg:scrollbar-thin lg:scrollbar-thumb-light-gray-5 lg:dark:scrollbar-thumb-black lg:scrollbar-thumb-rounded";

  if (isLoadingEvent || isLoadingSlots || !event) {
    return (
      <LoadingIndicator/>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="lg:max-w-[18rem]">
        <SlotTypeFilter
          eventName={event.eventName}
          eventBanner={event.banner}
          eventType={event.type}
          selectedSlotType={selectedSlotType}
          slotsQtdData={{
            departure: slotCountByType.data?.departure,
            landing: slotCountByType.data?.landing,
            departureLanding: slotCountByType.data?.departureLanding
          }}
          onSlotTypeChange={onSlotTypeChange}/>
      </div>

      <div className="flex-1 lg:max-h-screen w-full bg-[#F7F7F7] dark:bg-dark-gray-2">
        <SlotPageHeader
          appliedFilters={appliedFilters}
          searchedFlightNumber={appliedFilters.flightNumber}
          onFlightSearch={onFlightSearch}
          onFilterChange={onFilterStateChange}
          onFilterStateChange={(state) => setIsFilterOpen(state)}
          showFilter={!scheduleRequest.hasError}
        />
        {scheduleRequest.hasError
          ? (
            <BookInfoMessage
              header={t('flights.error.unableToBook.title')}
              description={t('flights.error.unableToBook.subtitle')}
              type="error"
              onErrorReset={() => onScheduleErrorReset()}
            />
          )
          : (
            <>
              <div
                className={`relative overflow-x-auto h-screen ${scrollBarClassName} ${isFilterOpen ? "blur" : ""}`}
              >
                <div className="mx-2 lg:ml-8 lg:mr-4">
                  {tableData?.length
                    ? (
                      <SlotsTable
                        slots={tableData}
                        airlineImages={airlineLogos}
                        onSlotBook={onSlotBook}
                        hasMoreFlights={hasNextPage}
                        isFecthingMoreFlights={isFetchingNextPage}
                        airportDetailsMap={airportDetailsMap}
                        onMoreFlightsRequested={() => fetchNextPage()}
                      />
                    )
                    : (
                      <BookInfoMessage
                        header={t('flights.error.noFlightsFound.title')}
                        description={t('flights.error.noFlightsFound.subtitle')}
                        type="warning"
                        onErrorReset={() => onScheduleErrorReset()}
                      />
                    )}
                </div>
              </div>
            </>
          )}
      </div>
    </div>
  );
}
