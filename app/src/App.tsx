import React from "react";
import "./App.css";
import Chart from "./components/Chart";
import GlobalErrorHandler from "./components/GlobalErrorHandler";

const App: React.FC = () => {
    return (
        <>
            <GlobalErrorHandler />
            <Chart title="Statistical Data" />
        </>
    );
};

export default App;
