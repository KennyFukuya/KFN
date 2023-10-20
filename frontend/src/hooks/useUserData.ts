import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

function useUserData() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>();
  const oauth = localStorage.getItem("oauth");

  useEffect(() => {
    try {
      const token = JSON.parse(oauth!);
      const decodedToken = jwtDecode(token.id_token);

      if (decodedToken) {
        setUserData(decodedToken);
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  }, [oauth]);

  return userData;
}

export default useUserData;
