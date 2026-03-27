
import type { Ticket, TicketForms, Filter, ValidationForms, Touch  } from "../utils/ticketUtils";

export const initialTicket: Ticket[] = [
  {
    id: crypto.randomUUID(),
    title: "Login page throws 500 error",
    reporter: "Alice",
    priority: "high",
    assignee: "Kurt Allen",
    status: "open",
    createdAt: Date.now(),
    updatedAt: null,
    comments: [],
    activity: [],
  },
];

export const initialForms: TicketForms = {
  title: "",
  reporter: "",
  status: "open",
  priority: "low",
  assignee: "",
  description: "",
};

export const initialFilter: Filter = {
  search: "",
  priority: "all",
  status: "all",
};

export const initialValidationForms: ValidationForms = {
  title: "",
  reporter: "",
  status: "",
  priority: "",
  assignee: ""
};

export const initialTouched: Touch = {
  title: false,
  reporter: false,
  status: false,
  priority: false,
  assignee: false,
  description: false,
  comment: false,
}


