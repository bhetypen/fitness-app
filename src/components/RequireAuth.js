// RequireAuth.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import UserContext from "./UserContext";

export default function RequireAuth({ children }) {
    const { user, authReady } = useContext(UserContext);
    const location = useLocation();

    if (!authReady) return <p>Checking session…</p>;  // avoids flicker

    if (!user?.id) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}
