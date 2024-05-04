import axios from "axios";
import { toast } from "react-toastify";

axios.interceptors.response.use(null, (err) => {
  if (!err.response || err.response.status >= 500) {
    toast.error("unexpected error");
    err = null;
  }
  return Promise.reject(err);
});

export default axios;
