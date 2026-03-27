import type { Ticket } from "../utils/ticketUtils";
import "../index.css";
import Highlighter from "react-highlight-words";

export type TicketTableComponentProps = {
  tickets: Ticket[];
  onRowClick: (ticket: Ticket) => void;
  onEditClick: (ticket: Ticket) => void;
  onClickDelete: (ticket: Ticket) => void;
  search: string;

  selectedIds: Ticket["id"][];
  onToggleSelectTicket: (ticketId: Ticket["id"]) => void;
  onToggleSelectAllVisible: () => void;
  isAllVisibleSelected: boolean;
};

export default function TicketTableComponent({
  tickets,
  search,
  onRowClick,
  onEditClick,
  onClickDelete,
  selectedIds,
  onToggleSelectTicket,
  onToggleSelectAllVisible,
  isAllVisibleSelected,
}: TicketTableComponentProps) {
  return (
    <div
      className="table-wrapper tooltip-wrap"
      data-tip="Click a row to view ticket details"
    >
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={isAllVisibleSelected}
                onChange={onToggleSelectAllVisible}
                onClick={(e) => e.stopPropagation()}
                aria-label="Select all visible tickets"
              />
            </th>
            <th>Title</th>
            <th>Asignee</th>
            <th>Reporter</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Date Created</th>
            <th>Date Updated</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t) => {
            const isSelected = selectedIds.includes(t.id);

            return (
              <tr
                key={t.id}
                onClick={() => onRowClick(t)}
                className={isSelected ? "selected-row" : ""}
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelectTicket(t.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ticket ${t.title}`}
                  />
                </td>

                <td>
                  <Highlighter
                    searchWords={[search]}
                    autoEscape
                    textToHighlight={t.title}
                  />
                </td>
                <td>
                  <Highlighter
                    searchWords={[search]}
                    autoEscape
                    textToHighlight={t.assignee ?? ""}
                  />
                </td>
                <td>
                  <Highlighter
                    searchWords={[search]}
                    autoEscape
                    textToHighlight={t.reporter ?? ""}
                  />
                </td>
                <td>
                  <Highlighter
                    searchWords={[search]}
                    autoEscape
                    textToHighlight={
                      t.description ? `${t.description}` : "No Description"
                    }
                  />
                </td>
                <td>
                  <Highlighter
                    searchWords={[search]}
                    autoEscape
                    textToHighlight={t.priority}
                  />
                </td>
                <td>
                  <Highlighter
                    searchWords={[search]}
                    autoEscape
                    textToHighlight={t.status}
                  />
                </td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
                <td>
                  {t.updatedAt
                    ? new Date(t.updatedAt).toLocaleString()
                    : "Not Updated Yet"}
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="btn-container">
                    <span
                      className="tooltip-wrap"
                      data-tip="Delete this ticket"
                    >
                      <button
                        className="btn-delete"
                        onClick={() => onClickDelete(t)}
                      >
                        Delete
                      </button>
                    </span>

                    <span className="tooltip-wrap" data-tip="Edit this ticket">
                      <button
                        className="btn-edit"
                        onClick={() => onEditClick(t)}
                      >
                        Edit
                      </button>
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
