import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    const context = useContext(AuthContext);
    useDebugValue(context?.auth, auth => auth?.user ? "Logged In" : "Logged Out")
    return context; // Return the whole context (auth + setAuth)
}

export default useAuth;