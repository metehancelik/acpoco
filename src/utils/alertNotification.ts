import { toast } from "react-toastify";

const AlertNotification = (message: string, type: string) => {
  if (type === "error") {
    toast.error(message);
  } else {
    toast.success(message);
  }
};
export default AlertNotification;
