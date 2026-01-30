import LoginHeader from "./loginheader";
import { Outlet } from "react-router-dom";

export const UserLayout = () => {
    return (
        <>
            <LoginHeader/>
            <Outlet/>
        </>
    );
}