import React from "react";
import AllEvents from "./AllEvents";
import RegisteredEvents from "./RegisteredEvents";
import TrendingEvents from "./TrendingEvents";
import SearchEvents from "./SearchEvents";

const UserDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <div className="grid gap-4">
        <RegisteredEvents />
        <TrendingEvents />
        <SearchEvents />
        <AllEvents />
      </div>
    </div>
  );
};

export default UserDashboard;
