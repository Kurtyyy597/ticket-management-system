export type DiscardProps = {
  openDiscard: boolean;
  cancelDiscard: () =>void;
  confirmDiscard: () => void;
  cancelTitle: string;
  cancelTitleSub: string;
  cancelMessage: string;
  confirmMessage: string;
};

function DiscardComponent({openDiscard, confirmDiscard, cancelDiscard, cancelTitle, cancelTitleSub, confirmMessage, cancelMessage}: DiscardProps) {
  if (!openDiscard) return null;
  
  return (
    <div className="discard-wrapper">

      {openDiscard && (
        <div className="discard-card">
          <h2 className="discard-title"> {cancelTitle} </h2>
          <p className="discard-sub"> {cancelTitleSub} </p>

          <div className="btn-discard-container">
            <button className="cancel-discard" onClick={cancelDiscard} data-tip="discard-button"> {cancelMessage} </button>
            <button className="confirm-discard" onClick={confirmDiscard} data-tip="confirm-discard" >  {confirmMessage} </button>
          </div>
        </div>
      )}
    </div>
  )
};
export default DiscardComponent;