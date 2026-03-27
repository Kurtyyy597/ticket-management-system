import UseTicketForm from "../components/UseTicketFormComponent";
import type { Ticket, TicketForms } from "../utils/ticketUtils";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  canTransitionStatus,
  getAllowedStatuses,
} from "../utils/TicketWorkflow";
import { fakeDelay } from "../utils/FakeDelay";
import { useEffect } from "react";

export type EditTicketProps = {
  tickets: Ticket[];
  setTickets: Dispatch<SetStateAction<Ticket[]>>;
  setIsFormDirty: React.Dispatch<React.SetStateAction<boolean>>;
};

export function EditTicket({ tickets, setTickets, setIsFormDirty }: EditTicketProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  
    useEffect(() => {
      return () => setIsFormDirty(false);
    }, [setIsFormDirty]);

  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return <div>Ticket not found.</div>;                 
  }

  const allowedStatuses = getAllowedStatuses(ticket.status);

   const handleUpdate = async (formData: TicketForms) => {
     if (!canTransitionStatus(ticket.status, formData.status)) {
       toast.error(
         `Invalid status transition: ${ticket.status} → ${formData.status}`,
         {
           toastId: "ticket-update-invalid-status",
         },
       );
       return;
     }

     try {
       await fakeDelay(700);

       setTickets((prev) =>
         prev.map((t) => {
           if (t.id !== ticket.id) return t;

           const now = Date.now();
           const newActivities = [...t.activity];

           if (t.title !== formData.title) {
             newActivities.push({
               id: crypto.randomUUID(),
               action: "title_changed",
               createdAt: now,
               field: "title",
               from: t.title,
               to: formData.title,
               message: `Title changed from ${t.title} to ${formData.title}`,
             });
           }

           if (t.reporter !== formData.reporter) {
             newActivities.push({
               id: crypto.randomUUID(),
               action: "reporter_changed",
               createdAt: now,
               field: "reporter",
               from: t.reporter,
               to: formData.reporter,
               message: `Reporter changed from ${t.reporter} to ${formData.reporter}`,
             });
           }

           if (t.assignee !== formData.assignee) {
             newActivities.push({
               id: crypto.randomUUID(),
               action: "assignee_changed",
               createdAt: now,
               field: "assignee",
               from: t.assignee,
               to: formData.assignee,
               message: `Assignee changed from ${t.assignee} to ${formData.assignee}`,
             });
           }

           if (t.description !== formData.description) {
             newActivities.push({
               id: crypto.randomUUID(),
               action: "description_changed",
               createdAt: now,
               field: "description",
               from: t.description,
               to: formData.description,
               message: "Description updated",
             });
           }

           if (t.priority !== formData.priority) {
             newActivities.push({
               id: crypto.randomUUID(),
               action: "priority_changed",
               createdAt: now,
               field: "priority",
               from: t.priority,
               to: formData.priority,
               message: `Priority changed from ${t.priority} to ${formData.priority}`,
             });
           }

           if (t.status !== formData.status) {
             newActivities.push({
               id: crypto.randomUUID(),
               action: "status_changed",
               createdAt: now,
               field: "status",
               from: t.status,
               to: formData.status,
               message: `Status changed from ${t.status} to ${formData.status}`,
             });
           }

           return {
             ...t,
             ...formData,
             activity: newActivities,
             updatedAt: now,
           };
         }),
       );

       toast.success("Ticket updated successfully", {
         toastId: "ticket-update-success",
       });

       navigate(`/tickets/${id}`);
     } catch (error) {
       toast.error("Failed to update ticket", {
         toastId: "ticket-update-failed",
       });
       console.error(error);
     }
   };

  return (
    <div className="edit-wrapper">
      <h2 className="edit-title">Edit Ticket</h2>
      <UseTicketForm
        initialData={{
          title: ticket.title,
          reporter: ticket.reporter,
          assignee: ticket.assignee,
          priority: ticket.priority,
          status: ticket.status,
          description: ticket.description,
        }}
        onSubmit={handleUpdate}
        statusLabel="Status"
        allowedStatuses={allowedStatuses}
        submitLabel="Edit Ticket"
        cancelPath={`/tickets/${id}`}
        cancelTitle="Discard Changes?"
        cancelTitleSub="this will discard your unsaved changes"
        cancelButtonMessage="Continue editing"
        confirmButtonMessage="Discard"
        setIsFormDirty={setIsFormDirty}
      />
    </div>
  );
}

export default EditTicket;
