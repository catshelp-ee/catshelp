import React from "react";
import * as utils from "../utils.ts";
import { Button, TextField } from "@mui/material";

const Login = () => {
  const USERS = [
    {
      id: 1,
      email: "markopeedosk@gmail.com",
      name: "marko",
    },
  ];

  const submitForm = (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    //const user = USERS.find((user) => user.name === "marko");
    fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: 0,
        name: "marko",
        email: payload.email,
      }),
    });
  };
  return (
    <form className="flex flex-col" onSubmit={submitForm}>
      <TextField name="email" label="EMAIL" />
      <Button type="submit">SAADA</Button>
    </form>
  );
};

export default Login;
