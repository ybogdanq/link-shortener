import axios from "axios";

const defineApiErrorMsg = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const data: any = error.response?.data;
    if (data && typeof data === "string") return data;
    else if (!data) return error.message;
    else return !(data instanceof FormData) && data?.msg ? data.msg : error.message;
  }
  return error.message;
};

export default defineApiErrorMsg;
