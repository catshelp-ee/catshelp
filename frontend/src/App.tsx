import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./Pages/Profile";
import FosterApplication from "./Pages/FosterApplication";
import FormEditor from "./Pages/FormEditor";
import Hoiukodud from "./Pages/Hoiukodud";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/profiil/:nimi" Component={Profile} />
        <Route path="/" Component={Hoiukodud} />
        <Route path="/hoiukodud" Component={Hoiukodud} />
        <Route path="/create" Component={FormEditor} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
