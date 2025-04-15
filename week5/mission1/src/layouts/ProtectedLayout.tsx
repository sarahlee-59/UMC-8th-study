import {useAuth} from "../context/AuthContext.tsx";
import {Navigate, Outlet} from "react-router-dom";

const ProtectedLayout = () => {
    const {accessToken} = useAuth();

    if (!accessToken) {
        return <Navigate to={"/login"} replace />;
    }

    return <Outlet/>;
};

export default ProtectedLayout;