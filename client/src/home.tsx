import { Route, Router, Routes } from "react-router-dom";
import App from "./app";
import CreateDom from "./creator/CreateDom";
import UiActionsPage from "./UiActionsPage";
import Configurator from "./creator/configurator";

function Home() {
  return (
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/configurator" element={<Configurator />} />
        <Route path="/actions" element={<UiActionsPage />} />
      </Routes>
  );
}

export default Home;