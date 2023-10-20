import { useQuery } from "react-query";
import api from "../api/api";

const fetchTopics = async () => {
  const response = await api.get("/topics");
  const data = response.data;

  return data;
};

function useTopics() {
  return useQuery("topics", fetchTopics);
}

export default useTopics;
