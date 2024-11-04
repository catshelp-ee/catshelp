import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddCatForm from "./pages/AddCatForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/et";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "./App.css";

dayjs.extend(weekday);
dayjs.extend(localeData);

function App() {
  dayjs.locale("et");
  dayjs().weekday(1);
  const [count, setCount] = useState(0);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="et">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lisa" element={<AddCatForm />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
