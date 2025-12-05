import { Route, Router, Routes } from "react-router-dom";
import App from "./app";
import CreateDom from "./creator/CreateDom";
import UiActionsPage from "./UiActionsPage";

function Home() {
  return (
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/configurator" element={<CreateDom />} />
        <Route path="/actions" element={<UiActionsPage />} />
      </Routes>
  );
}

export default Home;