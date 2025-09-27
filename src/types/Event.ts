export interface EventListEvent {
  id: string;
  eventName: string;
  banner: string;
  type: string;
  description: string;
  status: string;
}

export interface EventListPage {
  page: number;
  data: EventListEvent[];
  total: number;
}

export interface EventListResult {
  pages: EventListPage[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function getEventTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    'takeoff': 'Takeoff Event',
    'landing': 'Landing Event',
    'takeoff_landing': 'Takeoff & Landing Event',
    'tour': 'Tour Event',
    'training': 'Training Event',
    'competition': 'Competition Event'
  };
  
  return typeMap[type] || type;
}
