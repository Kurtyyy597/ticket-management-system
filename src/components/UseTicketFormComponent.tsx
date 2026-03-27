import {useEffect, useState} from 'react';
import type {TicketForms, ValidationForms, Touch, Status} from "../utils/ticketUtils";
import "../index.css"
import { validateField, validateForm } from "../utils/ValidateForms";
import { initialValidationForms, initialTouched } from "../const/ticketConst";
import { useNavigate } from "react-router-dom";
import DiscardComponent from "./DiscardComponent";

type TicketFormProps = {
  initialData: TicketForms;
  onSubmit: (formData: TicketForms) => void | Promise<void>;
  submitLabel: string;
  cancelPath: string;
  cancelTitle: string;
  cancelTitleSub: string;
  cancelButtonMessage: string;
  confirmButtonMessage: string;
  allowedStatuses?: Status[];
  statusLabel: string;
  setIsFormDirty: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UseTicketForm({initialData, statusLabel,  onSubmit, submitLabel, cancelPath, cancelTitle, cancelTitleSub, cancelButtonMessage, confirmButtonMessage, allowedStatuses,setIsFormDirty}: TicketFormProps) {
  const [forms, setForms] = useState<TicketForms>(initialData);

  const [errors, setErrors] = useState<ValidationForms>(initialValidationForms);
  const [touched, setTouched] = useState<Touch>(initialTouched);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  

  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);

  const isDirty = JSON.stringify(forms) !== JSON.stringify(initialData);
  
  useEffect(() => {
    setIsFormDirty(isDirty);
  }, [isDirty, setIsFormDirty]);

  const handleCancel = () => {
    if (isDirty) {
      setOpenDiscardModal(true);
    } else {
      navigate(cancelPath)
    }
  };

  const cancelDiscard = () => {
    setOpenDiscardModal(false);
  }
  
  const confirmDiscard = () => {
    setOpenDiscardModal(false);
    setForms(initialData);
    setErrors(initialValidationForms);
    setTouched(initialTouched);
    setIsFormDirty(false);
    navigate(cancelPath);
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setForms((prev) => ({
      ...prev,
      [name]: value
    }));

    if (touched[name as keyof typeof touched]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name as keyof TicketForms, value)
      }));
    };
  };

  const handleBlur = (e:React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof TicketForms, value)
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    const result = validateForm(forms);

    setErrors(result.errors);
    setTouched({
      title: true,
      assignee: true,
      reporter: true,
      status: true,
      priority: true,
      description: true,
      comment: true
    });

    if (!result.isValid) return;

    try {
      setIsSubmitting(true);
      await onSubmit(forms);
    } finally {
      setIsSubmitting(false);
    }


  }

  return (
    <div className="form-container">
      <button className="cancel-btn" onClick={handleCancel}> Cancel </button>
      <form className="form" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title" className="label"> Title </label>
          <input
            name="title"
            placeholder="Enter ticket title..."
            data-tip="Ticket title"
            className="input"
            value={forms.title}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.title && touched.title ? (
            <span className="text-error"> {errors.title} </span>
          ) : (
            null
          )}
        </div>

        {/* Reporter */}
        <div className="form-group">
          <label htmlFor="reporter" className="label"> Reporter </label>
          <input
            data-tip="Enter reporter"
            placeholder="Enter reporter..."
            name="reporter"
            className="input"
            value={forms.reporter}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.reporter && touched.reporter ? (
            <span className="text-error"> {errors.reporter} </span>
          ) : (
            null
          )}
        </div>

        {/* Asignee */}
        <div className="form-group">
          <label htmlFor="assignee" className="label"> Assignee </label>
          <input
            data-tip="Enter assignee"
            placeholder="Enter assignee..."
            name="assignee"
            className="input"
            value={forms.assignee}
            required
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.assignee && touched.assignee ? (
            <span className="text-error"> {errors.assignee} </span>
          ) : (
            null
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="label"> Description </label>
          <textarea
          data-tip="Enter description"
          name="description" 
          className="text-area"
          value={forms.description}
          onBlur={handleBlur}
          onChange={handleChange}/>
        </div>

        {/* Priority */}
        <div className="form-group">
          <label htmlFor="priority" className="label"> Priority </label>
          <select
          data-tip="Select priority" 
          name="priority" 
          className="select"
          value={forms.priority}
          onBlur={handleBlur}
          onChange={handleChange}>
            <option value="low"> Low </option>
            <option value="medium"> Medium </option>
            <option value="high"> High </option>
          </select>
          {errors.priority && touched.priority ? (
            <span className="text-error"> {errors.priority} </span>
          ) : (
            null
          )}
        </div>

        {/* Status */}
        <div className="form-group">
          <label htmlFor="status" className="label"> {statusLabel} </label>
          <select
          data-tip="Select status" 
          name="status" 
          className="select"
          value={forms.status}
          onBlur={handleBlur}
          onChange={handleChange}>
            {allowedStatuses?.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.status && touched.status ? (
            <span className="text-error"> {errors.status} </span>
          ) : (
            null
          )}
        </div>
      
      {/* Submit Label */}
      <button className="btn-submit" type="submit" disabled={isSubmitting}> {isSubmitting ? "Submitting..." : `${submitLabel}`} </button>
      </form>
      <DiscardComponent
      openDiscard={openDiscardModal}
      cancelDiscard={cancelDiscard}
      confirmDiscard={confirmDiscard}
      cancelTitle={cancelTitle}
      cancelTitleSub={cancelTitleSub}
      cancelMessage={cancelButtonMessage}
      confirmMessage={confirmButtonMessage}/>
    </div>
  );
} 

