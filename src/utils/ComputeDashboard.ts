import type { Ticket } from "./ticketUtils";

export type DashboardStats = {
  totalTickets: number;

  lowPriority: number;
  mediumPriority: number;
  highPriority: number;

  closedStatus: number;
  openStatus: number;
  inProgressStatus: number;
  doneStatus: number;

  activeTickets: number;
  resolvedTickets: number;
  highPriorityPending: number;
  updatedTickets: number;

  neverUpdatedTickets: number;
  completionRate: number;

  highPriorityDone: number;
  latestCreatedTicket: Ticket | null;
  latestUpdatedTicket: Ticket | null;

  ticketsByAssignee: Record<string, number>;
  ticketsByReporter: Record<string, number>;

  unassignedTickets: number;
  staleTickets: number;

  ticketsWithComments: number;
  ticketsWithoutComments: number;
  totalComments: number;
  averageCommentsPerTicket: number;
  mostCommentedTicket: Ticket | null;

  ticketsWithNoActivity: number;
  totalActivityEvents: number;
  averageActivityPerTicket: number;
  mostActiveTicket: Ticket | null;

  createdToday: number;
  updatedToday: number;
  createdThisWeek: number;
  updatedThisWeek: number;
};

export function computeDashboardStats(tickets: Ticket[]): DashboardStats {
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const SEVEN_DAYS = 7 * ONE_DAY;
  const STALE_DAYS = 3 * ONE_DAY;

  const initialStats: DashboardStats = {
    totalTickets: tickets.length,

    lowPriority: 0,
    mediumPriority: 0,
    highPriority: 0,

    closedStatus: 0,
    openStatus: 0,
    inProgressStatus: 0,
    doneStatus: 0,

    activeTickets: 0,
    resolvedTickets: 0,
    highPriorityPending: 0,
    updatedTickets: 0,

    neverUpdatedTickets: 0,
    completionRate: 0,

    highPriorityDone: 0,
    latestCreatedTicket: null,
    latestUpdatedTicket: null,

    ticketsByAssignee: {},
    ticketsByReporter: {},

    unassignedTickets: 0,
    staleTickets: 0,

    ticketsWithComments: 0,
    ticketsWithoutComments: 0,
    totalComments: 0,
    averageCommentsPerTicket: 0,
    mostCommentedTicket: null,

    ticketsWithNoActivity: 0,
    totalActivityEvents: 0,
    averageActivityPerTicket: 0,
    mostActiveTicket: null,

    createdToday: 0,
    updatedToday: 0,
    createdThisWeek: 0,
    updatedThisWeek: 0,
  };

  const stats = tickets.reduce<DashboardStats>((acc, ticket) => {
    const assignee = ticket.assignee.trim() || "Unassigned";
    const reporter = ticket.reporter.trim() || "Unknown";

    const isOpen = ticket.status === "open";
    const isInProgress = ticket.status === "in-progress";
    const isDone = ticket.status === "done";
    const isClosed = ticket.status === "closed";
    const isHighPriority = ticket.priority === "high";

    const isActive = isOpen || isInProgress;
    const isResolved = isDone || isClosed;

    const commentsCount = ticket.comments.length;
    const activityCount = ticket.activity.length;

    const lastTouchedAt = ticket.updatedAt ?? ticket.createdAt;
    const isStale = isActive && now - lastTouchedAt > STALE_DAYS;

    // Priority counts
    if (ticket.priority === "low") acc.lowPriority++;
    if (ticket.priority === "medium") acc.mediumPriority++;
    if (ticket.priority === "high") acc.highPriority++;

    // Status counts
    if (isOpen) {
      acc.openStatus++;
      acc.activeTickets++;
    }

    if (isInProgress) {
      acc.inProgressStatus++;
      acc.activeTickets++;
    }

    if (isDone) {
      acc.doneStatus++;
      acc.resolvedTickets++;
    }

    if (isClosed) {
      acc.closedStatus++;
      acc.resolvedTickets++;
    }

    // High priority metrics
    if (isHighPriority && isActive) {
      acc.highPriorityPending++;
    }

    if (isHighPriority && isResolved) {
      acc.highPriorityDone++;
    }

    // Updated / never updated
    if (ticket.updatedAt === null) {
      acc.neverUpdatedTickets++;
    } else {
      acc.updatedTickets++;

      const currentLatestUpdatedAt = acc.latestUpdatedTicket?.updatedAt ?? 0;

      if (ticket.updatedAt > currentLatestUpdatedAt) {
        acc.latestUpdatedTicket = ticket;
      }
    }

    // Latest created
    if (
      !acc.latestCreatedTicket ||
      ticket.createdAt > acc.latestCreatedTicket.createdAt
    ) {
      acc.latestCreatedTicket = ticket;
    }

    // Assignee / reporter grouping
    acc.ticketsByAssignee[assignee] =
      (acc.ticketsByAssignee[assignee] || 0) + 1;

    acc.ticketsByReporter[reporter] =
      (acc.ticketsByReporter[reporter] || 0) + 1;

    // Unassigned
    if (assignee === "Unassigned") {
      acc.unassignedTickets++;
    }

    // Stale tickets
    if (isStale) {
      acc.staleTickets++;
    }

    // Comment stats
    acc.totalComments += commentsCount;

    if (commentsCount > 0) {
      acc.ticketsWithComments++;
    } else {
      acc.ticketsWithoutComments++;
    }

    if (
      !acc.mostCommentedTicket ||
      commentsCount > acc.mostCommentedTicket.comments.length
    ) {
      acc.mostCommentedTicket = ticket;
    }

    // Activity stats
    acc.totalActivityEvents += activityCount;

    if (activityCount === 0) {
      acc.ticketsWithNoActivity++;
    }

    if (
      !acc.mostActiveTicket ||
      activityCount > acc.mostActiveTicket.activity.length
    ) {
      acc.mostActiveTicket = ticket;
    }

    // Recent created stats
    if (now - ticket.createdAt <= ONE_DAY) {
      acc.createdToday++;
    }

    if (now - ticket.createdAt <= SEVEN_DAYS) {
      acc.createdThisWeek++;
    }

    // Recent updated stats
    if (ticket.updatedAt !== null) {
      if (now - ticket.updatedAt <= ONE_DAY) {
        acc.updatedToday++;
      }

      if (now - ticket.updatedAt <= SEVEN_DAYS) {
        acc.updatedThisWeek++;
      }
    }

    return acc;
  }, initialStats);

  stats.completionRate =
    stats.totalTickets === 0
      ? 0
      : Math.round((stats.resolvedTickets / stats.totalTickets) * 100);

  stats.averageCommentsPerTicket =
    stats.totalTickets === 0
      ? 0
      : Number((stats.totalComments / stats.totalTickets).toFixed(1));

  stats.averageActivityPerTicket =
    stats.totalTickets === 0
      ? 0
      : Number((stats.totalActivityEvents / stats.totalTickets).toFixed(1));

  return stats;
}
