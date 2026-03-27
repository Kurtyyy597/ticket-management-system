import TicketTableComponent from "../components/TicketTableComponent";
import type { Ticket, Filter, Sort } from "../utils/ticketUtils";
import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import FilterComponent from "../components/FilterComponent";
import { initialFilter } from "../const/ticketConst";
import { toast } from "react-toastify";
import { useDebounce } from "../utils/UseDebounce";
import { canTransitionStatus } from "../utils/TicketWorkflow";
import { createActivity, updateTicketActivity } from "../utils/CreateTicket";
import { fakeDelay } from "../utils/FakeDelay";

const normalizeForSearch = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim();

const fuzzyMatch = (text: string, query: string) => {
  const normalizedText = normalizeForSearch(text);
  const normalizedQuery = normalizeForSearch(query);

  if (!normalizedQuery) return true;

  const escapedChars = normalizedQuery
    .split("")
    .map((char) => char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const fuzzyPattern = escapedChars.join(".*");

  return new RegExp(fuzzyPattern).test(normalizedText);
};

export type HomeProps = {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
};

function Home({ tickets, setTickets }: HomeProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState<boolean>(false);

  const [sort, setSort] = useState<Sort>("createdAt-asc");
  const [filters, setFilters] = useState<Filter>(initialFilter);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const ticketsPerPage = 5;

  const [selectedIds, setSelectedIds] = useState<Ticket["id"][]>([]);

  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] =
    useState<boolean>(false);

  const [isShortcutOpen, setIsShortcutOpen] = useState<boolean>(false);

  const openDropDown = () => {
    setIsShortcutOpen((prev) => !prev);
  }

  useEffect(() => {
    const state = location.state as { toastMessage?: string } | null;

    if (state?.toastMessage) {
      toast.success(state.toastMessage, {
        toastId: "ticket-action-success",
      });

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tagName = target?.tagName;

      const isTyping = 
      tagName === "INPUT" || 
      tagName === "SELECT" ||
      tagName === "SELECT" || 
      target?.isContentEditable;

      const key = e.key;

      if (key === "/" && !isTyping) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const debounceSearch = useDebounce(filters.search, 600);

  const visibleTickets = useMemo(() => {
    return tickets.filter((t) => {
      const searchInput = normalizeForSearch(debounceSearch);

      const searchableFields = [
        normalizeForSearch(String(t.id ?? "")),
        normalizeForSearch(t.title ?? ""),
        normalizeForSearch(t.reporter ?? ""),
        normalizeForSearch(t.assignee ?? ""),
        normalizeForSearch(t.description ?? ""),
        normalizeForSearch(t.status ?? ""),
        normalizeForSearch(t.priority ?? ""),
      ];

      const matchesSearch =
        !searchInput ||
        searchableFields.some(
          (field) =>
            field.includes(searchInput) || fuzzyMatch(field, searchInput),
        );

      if (!matchesSearch) return false;
      if (filters.priority !== "all" && t.priority !== filters.priority)
        return false;
      if (filters.status !== "all" && t.status !== filters.status) return false;

      return true;
    });
  }, [filters, tickets, debounceSearch]);

  const sortedTickets = useMemo(() => {
    const sorted = [...visibleTickets];

    sorted.sort((a, b) => {
      if (sort === "createdAt-asc") return a.createdAt - b.createdAt;
      if (sort === "createdAt-desc") return b.createdAt - a.createdAt;
      if (sort === "updatedAt-asc")
        return (a.updatedAt ?? 0) - (b.updatedAt ?? 0);
      if (sort === "updatedAt-desc")
        return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);

      if (sort === "assignee-asc") return a.assignee.localeCompare(b.assignee);
      if (sort === "assignee-desc") return b.assignee.localeCompare(a.assignee);

      if (sort === "reporter-asc")
        return (a.reporter ?? "").localeCompare(b.reporter ?? "");
      if (sort === "reporter-desc")
        return (b.reporter ?? "").localeCompare(a.reporter ?? "");

      if (sort === "title-asc") return a.title.localeCompare(b.title);
      return b.title.localeCompare(a.title);
    });

    return sorted;
  }, [sort, visibleTickets]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedTickets.length / ticketsPerPage),
  );

  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * ticketsPerPage;
    const endIndex = startIndex + ticketsPerPage;

    return sortedTickets.slice(startIndex, endIndex);
  }, [currentPage, sortedTickets]);

  const allVisibleTicketsIds = paginatedTickets.map((t) => t.id);

  const isAllVisibleSelectedIds =
    allVisibleTicketsIds.length > 0 &&
    allVisibleTicketsIds.every((visibleId) => selectedIds.includes(visibleId));

  const selectedCount = selectedIds.length;

  const toggleSelect = (ticketId: Ticket["id"]) => {
    setSelectedIds((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId],
    );
  };

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      if (isAllVisibleSelectedIds) {
        return prev.filter((id) => !allVisibleTicketsIds.includes(id));
      }
      return Array.from(new Set([...prev, ...allVisibleTicketsIds]));
    });
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const openDeleteBulk = () => {
    if (selectedIds.length === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const cancelDeleteBulkModal = () => {
    if (isBulkDeleting) return;
    setIsBulkDeleteModalOpen(false);
  };

  const confirmBulkDeleteModal = async () => {
    if (selectedIds.length === 0 || isBulkDeleting) return;

    try {
      setIsBulkDeleting(true);

      await fakeDelay(700);

      setTickets((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
      clearSelection();
      setIsBulkDeleteModalOpen(false);

      toast.success("All tickets selected deleted", {
        toastId: "all-selected-tickets-deleted",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const selectedTickets = tickets.filter((t) => selectedIds.includes(t.id));

  const bulkPriorityUpdateTickets = (newPriority: Ticket["priority"]) => {
    if (selectedIds.length === 0) return;

    setTickets((prev) =>
      prev.map((t) => {
        if (!selectedIds.includes(t.id)) return t;
        if (t.priority === newPriority) return t;

        const newActivity = createActivity("priority_changed", {
          field: "Priority",
          from: t.priority,
          to: newPriority,
          message: `priority changed from ${t.priority} to ${newPriority}`,
          createdAt: Date.now(),
        });

        return updateTicketActivity(
          t,
          {
            priority: newPriority,
          },
          newActivity,
        );
      }),
    );
    toast.success(`All selected ticket(s) changed to ${newPriority} priority`, {
      toastId: "all-ticket-selected-updated-priority-success",
    });

    clearSelection();
  };

  const bulkUpdateStatus = (newStatus: Ticket["status"]) => {
    if (selectedIds.length === 0) return;

    let updatedCount = 0;
    let invalidCount = 0;
    let unchangedCount = 0;

    setTickets((prev) =>
      prev.map((t) => {
        if (!selectedIds.includes(t.id)) return t;

        if (t.status === newStatus) {
          unchangedCount++;
          return t;
        }

        const isAllowed = canTransitionStatus(t.status, newStatus);

        if (!isAllowed) {
          invalidCount++;
          return t;
        }

        updatedCount++;

        const newActivity = createActivity("status_changed", {
          field: "Status",
          from: t.status,
          to: newStatus,
          message: `Status changed from ${t.status} to ${newStatus}`,
          createdAt: Date.now(),
        });

        return updateTicketActivity(
          t,
          {
            status: newStatus,
          },
          newActivity,
        );
      }),
    );

    clearSelection();

    if (updatedCount > 0) {
      const extraParts = [];

      if (invalidCount > 0) extraParts.push(`${invalidCount} invalid`);
      if (unchangedCount > 0) extraParts.push(`${unchangedCount} unchanged`);

      const extraText =
        extraParts.length > 0 ? ` (${extraParts.join(", ")})` : "";

      toast.success(
        `${updatedCount} ticket(s) updated to ${newStatus}${extraText}`,
        {
          toastId: "bulk-status-success",
        },
      );
      return;
    }

    const warningParts = [];
    if (invalidCount > 0)
      warningParts.push(`Invalid transitions: ${invalidCount}`);
    if (unchangedCount > 0) warningParts.push(`Same status: ${unchangedCount}`);

    toast.warning(warningParts.join(" | "), {
      toastId: "bulk-ticket-status-no-change",
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debounceSearch, filters.priority, filters.status, sort]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goBack = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage1 = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const pageButtons = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;

      return (
        <button
          key={page}
          type="button"
          className={currentPage === page ? "active-page" : ""}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      );
    });
  }, [totalPages, currentPage]);

  const clickDetails = (ticket: Ticket) => {
    navigate(`/tickets/${ticket.id}`);
  };

  const clickEdit = (ticket: Ticket) => {
    navigate(`/tickets/${ticket.id}/edit`);
  };

  const clickDelete = (ticket: Ticket) => {
    setTicketToDelete(ticket);
  };

  const confirmDelete = async () => {
    if (!ticketToDelete || isDeleting) return;

    try {
      setIsDeleting(true);

      await fakeDelay(700);

      setTickets((prev) => prev.filter((t) => t.id !== ticketToDelete.id));

      toast.success("Ticket deleted successfully", {
        toastId: "ticket-deleted-success",
      });
      setTicketToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setTicketToDelete(null);
  };

  const hasNoTickets = tickets.length === 0;
  const hasNoFilteredResults = tickets.length > 0 && sortedTickets.length === 0;

  return (
    <div className="home-wrapper">
      <div className="shortcut-dropdown">
        <button
          className="btn-shortcut"
          onClick={openDropDown}
          aria-expanded={isShortcutOpen}
          aria-controls="keyboard-shortcuts-menu"
        >
          Keyboard Shortcuts
          <span className={`shortcut-arrow ${isShortcutOpen ? "open" : ""}`}>
            ▼
          </span>
        </button>

        {isShortcutOpen && (
          <div id="keyboard-shortcuts-menu" className="shortcut-menu">
            <ul>
              <li>
                <strong>N</strong>
                <span>Create Ticket</span>
              </li>
              <li>
                <strong>D</strong>
                <span>Dashboard</span>
              </li>
              <li>
                <strong>H</strong>
                <span>Homepage</span>
              </li>
              <li>
                <strong>/</strong>
                <span>Focus Search</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="title-add-btn-container">
        <h1 className="title"> Ticket Lists </h1>
        <Link to={`/tickets/new`} data-tip="Create new ticket">
          {" "}
          Create New Ticket{" "}
        </Link>
      </div>
      <FilterComponent
        sort={sort}
        setSort={setSort}
        filter={filters}
        setFilters={setFilters}
        searchInputRef={searchInputRef}
      />
      {selectedCount > 0 && (
        <section className="bulk-actions-bar">
          <p className="bulk-selected-text">
            {selectedCount} ticket(s) selected
          </p>

          <div className="action-card-overall-container">
            <div className="action-card">
              <h2 className="action-title"> Priority </h2>
              <div className="action-btn-containers">
                <button
                  className="btn-priority"
                  onClick={() => bulkPriorityUpdateTickets("low")}
                >
                  Mark as Low Priority
                </button>
                <button
                  className="btn-priority"
                  onClick={() => bulkPriorityUpdateTickets("medium")}
                >
                  Mark as Medium Priority
                </button>
                <button
                  className="btn-priority"
                  onClick={() => bulkPriorityUpdateTickets("high")}
                >
                  Mark as High Priority
                </button>
              </div>
            </div>

            <div className="action-card">
              <h2 className="action-title"> Status </h2>
              <div className="action-btn-containers">
                <button
                  className="btn-priority"
                  onClick={() => bulkUpdateStatus("open")}
                >
                  Mark as Open
                </button>
                <button
                  className="btn-priority"
                  onClick={() => bulkUpdateStatus("in-progress")}
                >
                  Mark as In-Progress
                </button>
                <button
                  className="btn-priority"
                  onClick={() => bulkUpdateStatus("done")}
                >
                  Mark as Done
                </button>
                <button
                  className="btn-priority"
                  onClick={() => bulkUpdateStatus("closed")}
                >
                  Mark as Closed
                </button>
              </div>
            </div>

            <div className="btn-clear-delete-container">
              <button
                className="btn-delete-ticket-selected"
                onClick={openDeleteBulk}
              >
                {" "}
                Delete{" "}
              </button>
              <button
                className="btn-clear-ticket-selected"
                onClick={clearSelection}
              >
                {" "}
                Clear checkbox{" "}
              </button>
            </div>
          </div>
        </section>
      )}
      {isBulkDeleteModalOpen && (
        <div className="delete-modal-bulk">
          <div className="delete-modal-bulk-card">
            <h2 className="bulk-delete-title">
              Delete {selectedCount} selected ticket(s)?
            </h2>

            <p className="bulk-delete-message">This action cannot be undone.</p>

            <ul className="bulk-delete-list">
              {selectedTickets.slice(0, 5).map((ticket) => (
                <li key={ticket.id}>{ticket.title}</li>
              ))}
            </ul>

            {selectedTickets.length > 5 && (
              <p className="bulk-delete-more">
                And {selectedTickets.length - 5} more...
              </p>
            )}

            <div className="bulk-delete-btn-container">
              <button
                className="bulk-btn-cancel-delete"
                onClick={cancelDeleteBulkModal}
                disabled={isBulkDeleting}
              >
                Cancel
              </button>

              <button
                className="bulk-btn-confirm"
                onClick={confirmBulkDeleteModal}
                disabled={isBulkDeleting}
              >
                {isBulkDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {hasNoTickets ? (
        <div className="empty-state">
          <h2 className="empty-state-title">No tickets yet</h2>
          <p className="empty-state-text">
            Start by creating your first ticket.
          </p>
          <Link className="empty-state-button" to="/tickets/new">
            Create ticket
          </Link>
        </div>
      ) : hasNoFilteredResults ? (
        <div className="empty-state">
          <h2 className="empty-state-title">No results found</h2>
          <p className="empty-state-text">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <TicketTableComponent
          tickets={paginatedTickets}
          onRowClick={clickDetails}
          onEditClick={clickEdit}
          onClickDelete={clickDelete}
          search={filters.search}
          selectedIds={selectedIds}
          onToggleSelectTicket={toggleSelect}
          onToggleSelectAllVisible={toggleSelectAllVisible}
          isAllVisibleSelected={isAllVisibleSelectedIds}
        />
      )}
      <section className="pagination-container">
        <div className="pagination-card">
          <div className="pagination-controls">
            <button
              type="button"
              data-tip="Go to First page"
              className="btn-reset-page"
              onClick={goToPage1}
              disabled={currentPage === 1}
            >
              Start
            </button>

            <button
              type="button"
              data-tip="Go to previous page"
              className="btn-pagination"
              onClick={goBack}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {pageButtons}

            <button
              type="button"
              data-tip="Go to next page"
              className="btn-pagination"
              onClick={toggleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>

            <button
              type="button"
              data-tip="Go to last page"
              className="btn-pagination"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>

          <div className="page-length" data-tip="Page length">
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>
      </section>
      {ticketToDelete && (
        <section className="modal-delete-container">
          <div className="modal-delete-card">
            <h2 className="modal-delete-title"> Delete this ticket? </h2>
            <p className="modal-delete-title-sub">
              {" "}
              You are about to delete{" "}
              <strong> {ticketToDelete.title} </strong>{" "}
            </p>

            <div className="delete-ticket-meta">
              <p>
                {" "}
                ID: <strong> {ticketToDelete.id} </strong>{" "}
              </p>
              <p>
                {" "}
                Status: <strong> {ticketToDelete.status} </strong>{" "}
              </p>
              <p>
                {" "}
                Priority: <strong> {ticketToDelete.priority} </strong>{" "}
              </p>
              <p>
                {" "}
                Assignee:{" "}
                <strong>
                  {" "}
                  {ticketToDelete.assignee ?? "Unassigned"}{" "}
                </strong>{" "}
              </p>
            </div>

            <p className="action-warning"> This action cannot be undone </p>

            <div className="btn-delete-modal-container">
              <button
                className="btn-cancel-delete"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                {" "}
                Cancel{" "}
              </button>
              <button
                className="btn-confirm-delete"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {" "}
                {isDeleting ? "Deleting..." : "Confirm Delete "}{" "}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
export default Home;
