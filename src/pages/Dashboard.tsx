import React from "react";

const Dashboard = () => {
  return (
    <div>
      <button
        onClick={() => {
          const response = fetch(`/`);
          console.log(response);
        }}
      ></button>
    </div>
  );
};

export default Dashboard;
