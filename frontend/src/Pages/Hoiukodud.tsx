import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Menu, MenuItem, Box } from "@mui/material";

function Hoiukodud() {
  const [hoiukodud, setHoiukodud] = useState<any>([]);
  useEffect(() => {
    const hoiukodud = axios.get(`http://localhost:8080/hoiukodud`);
    hoiukodud.then((res) => setHoiukodud(res.data));

    return () => {};
  }, []);

  const [visibleItems, setVisibleItems] = useState<any>({});

  const toggleDropdown = (id: number) => {
    setVisibleItems((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const assignCat = () => {
    //const hoiukodud = axios.get(`http://localhost:8080/pilt?nimi=Armas`);
    //hoiukodud.then((res) => console.log(res));
  };

  return (
    <div className="flex flex-col m-auto mt-20 w-1/2">
      {hoiukodud.map((hoiukodu: any, index: number) => (
        <div className="w-full" key={index}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => toggleDropdown(index)}
          >
            <Box width="100%" display="flex" justifyContent="space-between">
              <span>
                {hoiukodu.nimi} - {hoiukodu.eesnimi} {hoiukodu.perenimi}
              </span>
              <span>{hoiukodu.mentor}</span>
            </Box>
          </Button>
          {visibleItems[index] && (
            <Box
              display="flex"
              flexDirection="column"
              position="relative"
              gap={2}
              p={2}
              bgcolor="grey.200"
            >
              <div>Isikukood: {hoiukodu.isikukood}</div>
              <div>
                Aadress: {hoiukodu.maakond} {hoiukodu.linn} {hoiukodu.tanav}
              </div>
              <div>Telefon: {hoiukodu.tel}</div>
              <div>Meiliaadress: {hoiukodu.epost}</div>
              <div>Lepingu nr: {hoiukodu.lepingu_nr}</div>
              <Button
                onClick={assignCat}
                sx={{ position: "absolute", right: 4 }}
              >
                anna kass
              </Button>
            </Box>
          )}
        </div>
      ))}
    </div>
  );
}

export default Hoiukodud;
