import type { TicketForms, Ticket } from "../utils/ticketUtils"
import UseTicketForm from "../components/UseTicketFormComponent"
import { useNavigate } from "react-router-dom";
import { initialForms } from "../const/ticketConst";
import { fakeDelay } from "../utils/FakeDelay";
import { toast } from "react-toastify";
import { useEffect, } from "react";

export type NewTicketProps = {
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  setIsFormDirty: React.Dispatch<React.SetStateAction<boolean>>;
};

export function NewTicket({setTickets, setIsFormDirty}: NewTicketProps) {
  const navigate = useNavigate();

  useEffect(() => {
    return () => setIsFormDirty(false);
  }, [setIsFormDirty]);

  const handleCreateTicket = async (formData: TicketForms) => {
    const now = Date.now();

    const newTicket : Ticket = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: null ,
      comments: [],
      activity: [
        {
          id: crypto.randomUUID(),
          action: "create",
          createdAt: now
        }
      ],
      ...formData,
      status: "open"
    };

    try {
      await fakeDelay(700);

      setTickets((prev) => [...prev, newTicket]);

      toast.success("Ticket created Successfully",{
        toastId: "ticket-created-success"
      });

      setIsFormDirty(false);
      navigate("/")
    } catch {
      toast.error("Failed to create ticket", {
        toastId: "ticket-create-failed"
      });
    };
  };

  return (
    <div className="Add-form-wrapper">
      <h2 className="add-title"> Create Ticket </h2>
      <UseTicketForm
      initialData={initialForms}
      allowedStatuses={["open"]}
      onSubmit={handleCreateTicket}
      submitLabel="Create Ticket"
      statusLabel="Status (Default to Open)"
      cancelPath="/"
      cancelTitle="Cancel ticket creation?"
      cancelTitleSub="this will cancel your new ticket"
      cancelButtonMessage="Back to create"
      confirmButtonMessage="Confirm"
      setIsFormDirty={setIsFormDirty}
      />
    </div>
  )
};

export default NewTicket;