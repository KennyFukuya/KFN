import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

function useUserData() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    try {
      if (!accessToken) {
        return;
      }

      const decodedToken = jwtDecode(accessToken!);

      if (decodedToken) {
        setUserData(decodedToken);
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  }, [accessToken]);

  return userData;
}

export default useUserData;
