import { useQuery } from "react-query";
import api from "../api/api";

const fetchOnline = async () => {
  const response = await api.get("/topics/online");
  const data = response.data;

  return data;
};

function useOnline() {
  return useQuery("online", fetchOnline);
}

export default useOnline;
