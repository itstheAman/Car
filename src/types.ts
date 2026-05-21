export interface Member {
  id: string;
  name: string;
  count: number;
  order: number;
}

export interface HistoryEvent {
  id: string;
  memberName: string;
  amountAdded: number;
  newTotal: number;
  timestamp: number;
}
