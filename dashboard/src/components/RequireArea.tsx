import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, type Area } from "../context/AuthContext";

type RequireAreaProps = {
  area: Area;
};

const RequireArea = ({ area, children }: PropsWithChildren<RequireAreaProps>) => {
  const { isAuthenticated, area: authenticatedArea } = useAuth();
  const location = useLocation();

  if (isAuthenticated && authenticatedArea === area) {
    return <>{children}</>;
  }

  return (
    <Navigate
      to={`/auth?area=${area}`}
      state={{ from: location.pathname }}
      replace
    />
  );
};

export default RequireArea;
