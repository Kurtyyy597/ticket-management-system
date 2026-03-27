export type Priority = "low" | "medium" | "high";

export type Status = "closed" | "open" | "in-progress" | "done";


export type TicketComments = {
  id: string;
  author: string;
  message: string;
  createdAt: number;
};

export type TicketActivityAction =
  | "create"
  | "title_changed"
  | "assignee_changed"
  | "reporter_changed"
  | "priority_changed"
  | "description_changed"
  | "status_changed"
  | "assigned"
  | "deleted"
  | "comment_added";

export type TicketActivity = {
  id: string;
  action: TicketActivityAction;
  createdAt: number;
  field?:string;
  from?: string;
  to?: string;
  message?: string;
};

export type Ticket = {
  id: string;
  title: string;
  reporter: string;
  assignee: string;
  description?: string;
  priority: Priority;
  status: Status;
  createdAt: number;
  updatedAt: number | null;
  comments: TicketComments[];
  activity: TicketActivity[];
};

export type TicketForms = {
  title: string;
  reporter: string;
  assignee: string;
  priority: Priority;
  status: Status;
  description?: string;
};

export type Filter = {
  search: string;
  priority: Priority | "all";
  status: Status | "all";
};

export type Sort =
  | "createdAt-asc"
  | "createdAt-desc"
  | "updatedAt-asc"
  | "updatedAt-desc"
  | "title-asc"
  | "title-desc"
  | "assignee-asc"
  | "assignee-desc"
  | "reporter-asc"
  | "reporter-desc";

export type ValidationForms = {
  title: string;
  reporter: string;
  status: string;
  priority: string;
  assignee: string;
};

export type Touch = {
  title: boolean;
  reporter: boolean;
  status: boolean;
  priority: boolean;
  assignee: boolean;
  description: boolean;
  comment: boolean;
};

