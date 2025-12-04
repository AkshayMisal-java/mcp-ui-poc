import { Route, Router, Routes } from "react-router-dom";
import App from "./app";
import CreateDom from "./creator/createDom";

function Home() {
  return (
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/configurator" element={<CreateDom />} />
      </Routes>
  );
}

export default Home;