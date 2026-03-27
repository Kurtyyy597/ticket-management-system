import type { Status } from "./ticketUtils";

export const statusTransitions:Record<Status, Status[]> = {
 "open": ["open", "in-progress"],
 "in-progress": ["in-progress", "done"],
 "done": ["in-progress","done", "closed"],
 "closed": ["in-progress","closed"],
};

export const allStatuses: Status[] = [
  "open",
  "in-progress",
  "done",
  "closed"
];

export function canTransitionStatus(currentStatus: Status, nextStatus: Status): boolean {
  return statusTransitions[currentStatus].includes(nextStatus);
};

export function getAllowedStatuses(currentStatus: Status) : Status[] {
  return statusTransitions[currentStatus];
}