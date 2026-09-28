import { Navigate } from "react-router-dom";

export function WorkIndex() {
  return <Navigate to={{ pathname: "/", hash: "case-studies" }} replace />;
}
