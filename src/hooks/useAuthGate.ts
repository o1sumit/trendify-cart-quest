import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

export function useAuthGate() {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  return (nextPath?: string) => {
    if (isAuthenticated) return true;
    navigate("/login", {
      state: { from: { pathname: nextPath ?? location.pathname } },
    });
    return false;
  };
}
