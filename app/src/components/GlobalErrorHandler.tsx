import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GlobalErrorHandler: React.FC = () => {
    useEffect(() => {
        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleError);

        return () => {
            window.removeEventListener("error", handleError);
            window.addEventListener("unhandledrejection", handleError);
        };
    }, []);

    function handleError(event: any) {
        const message =
            event instanceof PromiseRejectionEvent
                ? event.reason?.message
                : event?.message;

        toast.error(message ?? "Unknown Rejection", {
            position: "top-center",
            autoClose: 6000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    return <ToastContainer />;
};

export default GlobalErrorHandler;
