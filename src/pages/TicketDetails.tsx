import { useParams, useNavigate } from "react-router-dom";
import type { Ticket, TicketComments, TicketActivity } from "../utils/ticketUtils";
import { useState } from "react";
import {toast} from 'react-toastify'


export type TicketDetailsProps = {
  tickets: Ticket[];
  onAddComment: (ticketId: string, newComment: TicketComments, newActivity: TicketActivity) => void;
  
};

const timeStamp = Date.now();

function TicketDetails({ tickets, onAddComment}: TicketDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [textComment, setTextComment] = useState<string>("");

  const ticket = tickets.find((t) => t.id === id);

   const submitComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!textComment || !ticket) return;

    const newComment: TicketComments = {
      id: crypto.randomUUID(),
      author: "Current User",
      message: textComment.trim(),
      createdAt: timeStamp,
    };

    const newActivity: TicketActivity = {
      id: crypto.randomUUID(),
      action: "comment_added",
      createdAt: timeStamp,
    };
    onAddComment(ticket.id, newComment, newActivity);
    
    setTextComment("");
    toast.success("New comment added!", {
      toastId: "New comment"
    });
  };

  if (!ticket) {
    return (
      <div className="ticket-details-wrapper">
        <h2 className="ticket-details-title">Ticket not found</h2>

        <section className="detail-container">
          <div className="details-card">
            <p className="text-content">
              The ticket you’re looking for does not exist or may have been
              removed.
            </p>

            <div className="btn-container">
              <button className="btn-back" onClick={() => navigate(`/tickets`)}>
                Go Back
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ticket-details-wrapper">
      <h2 className="ticket-details-title">Selected Ticket: ({ticket.title}) details</h2>

      <section className="detail-container">
        <div className="details-card">
          <h2 className="id-title"> Ticket ID: <span> {id} </span> </h2>
          <div className="label-container">
            <h5 className="text-label">Title:</h5>
            <span className="text-content">{ticket.title}</span>
          </div>

          <div className="label-container">
            <h5 className="text-label">Assignee:</h5>
            <span className="text-content">{ticket.assignee}</span>
          </div>

          <div className="label-container">
            <h5 className="text-label">Reporter:</h5>
            <span className="text-content">{ticket.reporter}</span>
          </div>

          <div className="label-container">
            <h5 className="text-label">Priority:</h5>
            <span className="text-content">{ticket.priority}</span>
          </div>

          <div className="label-container">
            <h5 className="text-label">Status:</h5>
            <span className="text-content">{ticket.status}</span>
          </div>

          <div className="label-container">
            <h5 className="text-label">Date Created:</h5>
            <span className="text-content">
              {new Date(ticket.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="label-container">
            <h5 className="text-label">Date Updated:</h5>
            <span className="text-content">
              {ticket.updatedAt
                ? new Date(ticket.updatedAt).toLocaleString()
                : "Not Updated Yet"}
            </span>
          </div>

          <section className="activity-section-container">
            <h2 className="activity-title"> Activity History </h2>
            {ticket.activity.map(
              ({ id, action, createdAt, field, from, to, message }) => (
                <div key={id} className="activity-card">
                  <div className="activity-label-container">
                    <h5 className="activity-label-text"> Activity: </h5>
                    <span className="activity-content-text"> {action} </span>
                  </div>
                  <div className="activity-label-container">
                    <h5 className="activity-label-text"> Date: </h5>
                    <span className="activity-content-text">
                      {" "}
                      {new Date(createdAt).toLocaleString()}{" "}
                    </span>
                  </div>
                  <div className="activity-label-container">
                    <h5 className="activity-label-text"> Field: </h5>
                    <span className="activity-content-text"> {field} </span>
                  </div>
                  <div className="activity-label-container">
                    <h5 className="activity-label-text"> From: </h5>
                    <span className="activity-content-text"> {from} </span>
                  </div>
                  <div className="activity-label-container">
                    <h5 className="activity-label-text"> To: </h5>
                    <span className="activity-content-text"> {to} </span>
                  </div>
                  <div className="activity-label-container">
                    <h5 className="activity-label-text"> Message: </h5>
                    <span className="activity-content-text"> {message} </span>
                  </div>
                </div>
              ),
            )}
          </section>

          <section className="comment-section-container">
            <h2 className="comment-title">
              Comments ({ticket.comments.length})
            </h2>
            {ticket.comments.length === 0 ? (
              <span className="no-comment-text"> No comments yet</span>
            ) : (
              <>
                {ticket.comments.map(({ id, author, message, createdAt }) => (
                  <div key={id} className="comment-card">
                    <div className="comment-label-container">
                      <h5 className="comment-text-label"> Author: </h5>
                      <span className="comment-text-content"> {author} </span>
                    </div>
                    <div className="comment-label-container">
                      <h5 className="comment-text-label"> comment: </h5>
                      <span className="comment-text-content"> {message} </span>
                    </div>
                    <div className="comment-label-container">
                      <h5 className="comment-text-label"> Date Created: </h5>
                      <span className="comment-text-content">
                        {" "}
                        {new Date(createdAt).toLocaleString()}{" "}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </section>

          <section className="add-comment-container">
            <form className="add-comment-form" onSubmit={submitComment}>
              <div className="comment-group">
                <label className="comment-label"> Add Comment </label>
                <textarea
                  placeholder="comment anything..."
                  className="comment-textarea"
                  value={textComment}
                  onChange={(e) => setTextComment(e.target.value)}
                />
                <button className="btn-submit-comment" type="submit">
                  {" "}
                  Post Comment{" "}
                </button>
              </div>
            </form>
          </section>

          <div className="btn-container">
            <button className="btn-back" onClick={() => navigate("/")}>
              Go Back
            </button>

            <button
              className="btn-edit"
              onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
            >
              Edit Ticket
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TicketDetails;
