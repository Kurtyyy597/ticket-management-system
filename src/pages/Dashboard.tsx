import type { Ticket } from "../utils/ticketUtils";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { computeDashboardStats } from "../utils/ComputeDashboard";

type DashboardProps = {
  tickets: Ticket[];
};

type StatCard = {
  label: string;
  value: string | number;
  tone?: "default" | "primary" | "success" | "warning" | "danger";
};

export function Dashboard({ tickets }: DashboardProps) {
  const stats = useMemo(() => computeDashboardStats(tickets), [tickets]);

  const overviewCards: StatCard[] = [
    { label: "Total Tickets", value: stats.totalTickets, tone: "primary" },
    { label: "Active Tickets", value: stats.activeTickets, tone: "warning" },
    {
      label: "Resolved Tickets",
      value: stats.resolvedTickets,
      tone: "success",
    },
    {
      label: "Completion Rate",
      value: `${stats.completionRate}%`,
      tone: "default",
    },
  ];

  const healthCards: StatCard[] = [
    {
      label: "High Priority Pending",
      value: stats.highPriorityPending,
      tone: "danger",
    },
    { label: "Stale Tickets", value: stats.staleTickets, tone: "warning" },
    {
      label: "Unassigned Tickets",
      value: stats.unassignedTickets,
      tone: "warning",
    },
    {
      label: "Never Updated",
      value: stats.neverUpdatedTickets,
      tone: "default",
    },
  ];

  const statusBreakdown: StatCard[] = [
    { label: "Open", value: stats.openStatus },
    { label: "In Progress", value: stats.inProgressStatus },
    { label: "Done", value: stats.doneStatus },
    { label: "Closed", value: stats.closedStatus },
  ];

  const priorityBreakdown: StatCard[] = [
    { label: "Low", value: stats.lowPriority },
    { label: "Medium", value: stats.mediumPriority },
    { label: "High", value: stats.highPriority },
    { label: "High Priority Resolved", value: stats.highPriorityDone },
  ];

  const engagementStats: StatCard[] = [
    { label: "Tickets With Comments", value: stats.ticketsWithComments },
    { label: "Tickets Without Comments", value: stats.ticketsWithoutComments },
    { label: "Total Comments", value: stats.totalComments },
    { label: "Avg Comments / Ticket", value: stats.averageCommentsPerTicket },
  ];

  const activityStats: StatCard[] = [
    { label: "Created Today", value: stats.createdToday },
    { label: "Updated Today", value: stats.updatedToday },
    { label: "Created This Week", value: stats.createdThisWeek },
    { label: "Updated This Week", value: stats.updatedThisWeek },
  ];

  const assigneeEntries = Object.entries(stats.ticketsByAssignee).sort(
    ([, a], [, b]) => b - a,
  );

  const reporterEntries = Object.entries(stats.ticketsByReporter).sort(
    ([, a], [, b]) => b - a,
  );

  const completionBarStyle = {
    width: `${stats.completionRate}%`,
  };

  if (tickets.length === 0) {
    return (
      <div className="dashboard">
        <div className="dashboard__shell">
          <Link to="/" className="dashboard__back-link">
            <span className="dashboard__back-arrow">←</span>
            <span>Go To Tickets</span>
          </Link>

          <section className="dashboard__empty-state">
            <div className="dashboard__empty-icon">📭</div>
            <h1 className="dashboard__empty-title">No tickets yet</h1>
            <p className="dashboard__empty-text">
              Create your first ticket to unlock dashboard insights, activity,
              and team statistics.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__shell">
        <Link to="/" className="dashboard__back-link">
          <span className="dashboard__back-arrow">←</span>
          <span>Go To Tickets</span>
        </Link>

        <header className="dashboard__hero">
          <div>
            <p className="dashboard__eyebrow">Ticket System Dashboard</p>
            <h1 className="dashboard__title">Dashboard Overview</h1>
            <p className="dashboard__subtitle">
              Monitor ticket health, priorities, engagement, and recent activity
              in one place.
            </p>
          </div>

          <div className="dashboard__hero-meta">
            <div className="dashboard__hero-badge">
              <span className="dashboard__hero-badge-label">
                Latest Created
              </span>
              <strong
                className="dashboard__hero-badge-value"
                title={stats.latestCreatedTicket?.title ?? "No tickets"}
              >
                {stats.latestCreatedTicket?.title ?? "No tickets"}
              </strong>
            </div>

            <div className="dashboard__hero-badge">
              <span className="dashboard__hero-badge-label">
                Latest Updated
              </span>
              <strong
                className="dashboard__hero-badge-value"
                title={stats.latestUpdatedTicket?.title ?? "No updates yet"}
              >
                {stats.latestUpdatedTicket?.title ?? "No updates yet"}
              </strong>
            </div>
          </div>
        </header>

        <section className="dashboard__section">
          <div className="dashboard__section-heading">
            <h2>Overview</h2>
          </div>

          <div className="dashboard__card-grid dashboard__card-grid--overview">
            {overviewCards.map((card) => (
              <article
                key={card.label}
                className={`metric-card metric-card--${card.tone ?? "default"}`}
              >
                <span className="metric-card__label">{card.label}</span>
                <strong className="metric-card__value">{card.value}</strong>
              </article>
            ))}
          </div>

          <div className="dashboard__progress-panel">
            <div className="dashboard__progress-header">
              <div>
                <p className="dashboard__panel-kicker">Completion</p>
                <h3 className="dashboard__panel-title">
                  Ticket Resolution Progress
                </h3>
              </div>
              <strong className="dashboard__progress-value">
                {stats.completionRate}%
              </strong>
            </div>

            <div className="dashboard__progress-track">
              <div
                className="dashboard__progress-fill"
                style={completionBarStyle}
              />
            </div>
          </div>
        </section>

        <section className="dashboard__section">
          <div className="dashboard__section-heading">
            <h2>Health</h2>
          </div>

          <div className="dashboard__card-grid">
            {healthCards.map((card) => (
              <article
                key={card.label}
                className={`metric-card metric-card--${card.tone ?? "default"}`}
              >
                <span className="metric-card__label">{card.label}</span>
                <strong className="metric-card__value">{card.value}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard__analytics-grid">
          <article className="panel">
            <div className="panel__header">
              <div>
                <p className="panel__kicker">Breakdown</p>
                <h3 className="panel__title">Status Breakdown</h3>
              </div>
            </div>

            <div className="stats-grid">
              {statusBreakdown.map((item) => (
                <div className="stats-grid__item" key={item.label}>
                  <span className="stats-grid__label">{item.label}</span>
                  <strong className="stats-grid__value">{item.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel__header">
              <div>
                <p className="panel__kicker">Breakdown</p>
                <h3 className="panel__title">Priority Breakdown</h3>
              </div>
            </div>

            <div className="stats-grid">
              {priorityBreakdown.map((item) => (
                <div className="stats-grid__item" key={item.label}>
                  <span className="stats-grid__label">{item.label}</span>
                  <strong className="stats-grid__value">{item.value}</strong>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="dashboard__analytics-grid dashboard__analytics-grid--triple">
          <article className="panel">
            <div className="panel__header">
              <div>
                <p className="panel__kicker">Insights</p>
                <h3 className="panel__title">Engagement</h3>
              </div>
            </div>

            <div className="stats-grid">
              {engagementStats.map((item) => (
                <div className="stats-grid__item" key={item.label}>
                  <span className="stats-grid__label">{item.label}</span>
                  <strong className="stats-grid__value">{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="panel__info-list">
              <div className="panel__info-row">
                <span>Most Commented Ticket</span>
                <strong
                  title={stats.mostCommentedTicket?.title ?? "No tickets"}
                >
                  {stats.mostCommentedTicket?.title ?? "No tickets"}
                </strong>
              </div>
            </div>
          </article>

          <article className="panel">
            <div className="panel__header">
              <div>
                <p className="panel__kicker">Timeline</p>
                <h3 className="panel__title">Recent Activity</h3>
              </div>
            </div>

            <div className="stats-grid">
              {activityStats.map((item) => (
                <div className="stats-grid__item" key={item.label}>
                  <span className="stats-grid__label">{item.label}</span>
                  <strong className="stats-grid__value">{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="panel__info-list">
              <div className="panel__info-row">
                <span>Updated Tickets</span>
                <strong>{stats.updatedTickets}</strong>
              </div>
              <div className="panel__info-row">
                <span>Tickets With No Activity</span>
                <strong>{stats.ticketsWithNoActivity}</strong>
              </div>
              <div className="panel__info-row">
                <span>Most Active Ticket</span>
                <strong title={stats.mostActiveTicket?.title ?? "No tickets"}>
                  {stats.mostActiveTicket?.title ?? "No tickets"}
                </strong>
              </div>
            </div>
          </article>

          <article className="panel">
            <div className="panel__header">
              <div>
                <p className="panel__kicker">Activity</p>
                <h3 className="panel__title">System Summary</h3>
              </div>
            </div>

            <div className="panel__info-list">
              <div className="panel__info-row">
                <span>Total Activity Events</span>
                <strong>{stats.totalActivityEvents}</strong>
              </div>
              <div className="panel__info-row">
                <span>Avg Activity / Ticket</span>
                <strong>{stats.averageActivityPerTicket}</strong>
              </div>
              <div className="panel__info-row">
                <span>Latest Created</span>
                <strong
                  title={stats.latestCreatedTicket?.title ?? "No tickets"}
                >
                  {stats.latestCreatedTicket?.title ?? "No tickets"}
                </strong>
              </div>
              <div className="panel__info-row">
                <span>Latest Updated</span>
                <strong
                  title={stats.latestUpdatedTicket?.title ?? "No updates yet"}
                >
                  {stats.latestUpdatedTicket?.title ?? "No updates yet"}
                </strong>
              </div>
            </div>
          </article>
        </section>

        <section className="dashboard__leaderboard-grid">
          <article className="panel">
            <div className="panel__header">
              <div>
                <p className="panel__kicker">Leaderboard</p>
                <h3 className="panel__title">Tickets by Assignee</h3>
              </div>
            </div>

            <div className="leaderboard">
              {assigneeEntries.length > 0 ? (
                assigneeEntries.map(([name, count], index) => (
                  <div className="leaderboard__row" key={name}>
                    <div className="leaderboard__identity">
                      <span className="leaderboard__rank">{index + 1}</span>
                      <span className="leaderboard__name">{name}</span>
                    </div>
                    <span className="leaderboard__count">{count}</span>
                  </div>
                ))
              ) : (
                <p className="panel__empty">No assignees yet</p>
              )}
            </div>
          </article>

          <article className="panel">
            <div className="panel__header">
              <div>
                <p className="panel__kicker">Leaderboard</p>
                <h3 className="panel__title">Tickets by Reporter</h3>
              </div>
            </div>

            <div className="leaderboard">
              {reporterEntries.length > 0 ? (
                reporterEntries.map(([name, count], index) => (
                  <div className="leaderboard__row" key={`${name}-${index}`}>
                    <div className="leaderboard__identity">
                      <span className="leaderboard__rank">{index + 1}</span>
                      <span className="leaderboard__name">
                        {name || "Unknown"}
                      </span>
                    </div>
                    <span className="leaderboard__count">{count}</span>
                  </div>
                ))
              ) : (
                <p className="panel__empty">No reporters yet</p>
              )}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
