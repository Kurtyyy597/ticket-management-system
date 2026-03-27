import type { ValidationForms, TicketForms } from "./ticketUtils";

export function validateField(name: keyof TicketForms, value: string) {
  const trimmedValue = value.trim();
  const hasNumber = /\d/.test(value);

  switch (name) {
    case "title": {
      if (!trimmedValue) return "Title is Required";
      if (trimmedValue.length < 4) return "Title must be atleast 3 characters";
      return "";
    };
    case "assignee": {
      if (!trimmedValue) return "Assignee is Required";
      if (trimmedValue.length < 4) return "Assignee must be atleast 3 characters";
      if (hasNumber) return "Assignee must not contain numbers";
      return ""
    };
    case "reporter": {
      if (hasNumber) return "Reporter must not contain numbers";
      return ""
    };
    case "priority": {
      if (!trimmedValue) return "Priority is required";
      return ""
    };
    case "status": {
      if (!trimmedValue) return "Status is required";
      return ""
    };
    default:
      return "";
  };
};

export function validateForm(forms: TicketForms) {
  const errors: ValidationForms = {
    title: validateField("title", forms.title),
    assignee: validateField("assignee", forms.assignee),
    reporter: validateField("reporter", forms.reporter),
    status: validateField("status", forms.status),
    priority: validateField("priority", forms.priority)
  };

  const isValid = Object.values(errors).every((error) => error === "");

  return {
    isValid,
    errors
  }
 
  
}