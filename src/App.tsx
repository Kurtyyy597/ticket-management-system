import { NavLink, Routes, Route, useNavigate,} from "react-router-dom";
import type {
  Ticket,
  TicketActivity,
  TicketComments,
} from "./utils/ticketUtils";
import { useState, useEffect, useCallback } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import EditTicket from "./pages/EditTicket";
import NewTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";
import { ToastContainer } from "react-toastify";
  

function App() {
  const navigate = useNavigate();
 

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const storedTickets = localStorage.getItem("tickets");
    return storedTickets ? JSON.parse(storedTickets) : [];
  });
  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }, [tickets]);

 const handleSubmitComment = (
    ticketId: string,
    newComment: TicketComments,
    newActivity: TicketActivity,
  ) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              comments: [...t.comments, newComment],
              activity: [...t.activity, newActivity],
              updatedAt: Date.now(),
            }
          : t,
      ),
    );
  };

  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  
  const requestNavigation = useCallback(
    (path: string) => {
      console.log("requestNavigation", { path, isDirty });

      if (isDirty) {
        setPendingPath(path);
        setShowDiscardModal(true);
        return;
      }

      navigate(path);
    },
    [isDirty, navigate],
  );

  const handleConfirmDiscard = () => {
    setIsDirty(false);
    setShowDiscardModal(false);


    if (pendingPath) {
      navigate(pendingPath);
    }
    setPendingPath(null);

  };

  const handleCancelDiscard = () => {
    setShowDiscardModal(false);
    setPendingPath(null);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tagName = target?.tagName;

      const isTyping = 
      tagName === "INPUT" ||
      tagName === "TEXTAREA" ||
      tagName === "SELECT" ||
      target?.isContentEditable;

      if (isTyping || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (showDiscardModal) return;

      const key = e.key.toLowerCase();
      
      switch (key) {
        case "n":
          e.preventDefault();
          requestNavigation("/tickets/new");
          break;
        case "d":
          e.preventDefault();
          requestNavigation("/dashboard");
          break;
        case "h":
          e.preventDefault();
          requestNavigation("/");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showDiscardModal, requestNavigation])


  return (
    <div className="app-wrapper">
      <section className="nav-container">
        <nav className="navbar">
          <NavLink to="/">
            {" "}
            Home{" "}
          </NavLink>
          <NavLink to="/dashboard">
            {" "}
            Dashboard{" "}
          </NavLink>
          <NavLink to="/tickets/new">
            {" "}
            Create Ticket{" "}
          </NavLink>
        </nav>
      </section>

      <Routes>
        <Route
          path="/"
          element={<Home tickets={tickets} setTickets={setTickets} />}
        />
        <Route path="/dashboard" element={<Dashboard tickets={tickets} />} />
        <Route
          path="/tickets/new"
          element={
            <NewTicket setTickets={setTickets} setIsFormDirty={setIsDirty} />
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <TicketDetails
              tickets={tickets}
              onAddComment={handleSubmitComment}
            />
          }
        />
        <Route
          path="/tickets/:id/edit"
          element={
            <EditTicket
              tickets={tickets}
              setTickets={setTickets}
              setIsFormDirty={setIsDirty}
            />
          }
        />
      </Routes>

      {showDiscardModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Discard changes?</h3>
            <p>You have unsaved changes. Are you sure you want to leave?</p>

            <div className="modal-actions">
              <button onClick={handleCancelDiscard}>Stay</button>
              <button onClick={handleConfirmDiscard}>Discard</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="dark"
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}
export default App;
