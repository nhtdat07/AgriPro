import React from "react";
import { Route, Routes } from "react-router-dom";

import AuthLayout from "./components/Layout/AuthLayout";

import Landing from "./pages/auth/landing";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

import Homepage from "./pages/admin/homepage";
import InventoryPurchase from "./pages/admin/inventoryPurchase";
import Sales from "./pages/admin/sales";
import StatisticReport from "./pages/admin/statisticReport";
import Settings from "./pages/admin/settings";

import initadMenu from "./data/admenus";

function App() {
  return (
    <React.StrictMode>
      <Routes>
        <Route exact path="/" element={<Landing />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>

        <Route path="/homepage" element={<AuthLayout menu={initadMenu} />}>
          <Route path="/homepage/" element={<Homepage />}></Route>
        </Route>
        <Route path="/inventoryPurchase" element={<AuthLayout menu={initadMenu} />}>
          <Route path="/inventoryPurchase/" element={<InventoryPurchase />}></Route>
        </Route>
        <Route path="/sales" element={<AuthLayout menu={initadMenu} />}>
          <Route path="/sales/" element={<Sales />}></Route>
        </Route>
        <Route path="/statisticReport" element={<AuthLayout menu={initadMenu} />}>
          <Route path="/statisticReport/" element={<StatisticReport />}></Route>
        </Route>
        <Route path="/settings" element={<AuthLayout menu={initadMenu} />}>
          <Route path="/settings/" element={<Settings />}></Route>
        </Route>
      </Routes>
    </React.StrictMode>
  );
}

export default App;
