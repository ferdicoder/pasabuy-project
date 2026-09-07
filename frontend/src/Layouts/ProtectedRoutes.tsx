import { Navigate, Outlet } from "react-router-dom";
import { API } from "../config/api";
import { useSession } from "../hooks/useAPI";
import { queryKeys } from "../config/queryKeys";
import LoadingSpinner  from "../components/LoadingSpinner"

export default function ProtectedRoutes(){
  const { data, isPending } = useSession(API.users.me, queryKeys.session);

  if (isPending) return <LoadingSpinner />;
  if (!data) return <Navigate to="/login" replace />;

  return <Outlet />;

  
}



  
