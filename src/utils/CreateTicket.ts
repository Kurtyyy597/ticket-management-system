
import type { TicketActivity, TicketActivityAction, Ticket } from "./ticketUtils";

export const createActivity = (
action: TicketActivityAction,
options?: {
  field?: string,
  from?: string,
  to?: string,
  message?: string,
  createdAt: number;
}
) : TicketActivity => ({
  id: crypto.randomUUID(),
  createdAt: options?.createdAt ?? 0,
  action: action,
  field: options?.field,
  from: options?.from,
  to: options?.to,
  message: options?.message
});


export const updateTicketActivity = (
  ticket: Ticket,
  updates: Partial<Ticket>,
  newActivity: TicketActivity
): Ticket => {
  return {
    ...ticket,
    ...updates,
    updatedAt: newActivity.createdAt,
    activity: [...ticket.activity ?? [], newActivity]
  };
};