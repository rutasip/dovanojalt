import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import Axios from "axios";
import Navbars from "./components/nav/Navbars";
import Home from "./components/Home";
import Default from "./components/Default";
import Sell from "./components/sell/Sell";
// import ListingDetail from "./components/listing/ListingDetail";
import UserSettings from "./components/users/UserSettings";
import ProtectedRoute from "./routes/ProtectedRoute";
// import AuthCheckRoute from "./routes/AuthCheckRoute";
import UserContext from "./context/UserContext";
import MyItems from "./components/users/MyItems";
import Favorites from "./components/users/Favorites";
import Seller from "./components/users/Seller";
import EditListing from "./components/listing/EditListing";
import AlertMsg from "./components/shared/AlertMsg";
import Messages from "./components/messaging/Messages";

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
    loading: true,
  });

  const [globalMsg, setGlobalMsg] = useState({
    message: undefined,
    variant: undefined,
  });

  const providerValue = useMemo(
    () => ({ userData, setUserData, globalMsg, setGlobalMsg }),
    [userData, globalMsg]
  );

  useEffect(() => {
    const checkLoggedIn = () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }

      Axios.post("/api/users/token-is-valid", null, {
        headers: { "x-auth-token": token },
      })
        .then((res) => {
          if (res.data) {
            Axios.get("/api/users/user", {
              headers: { "x-auth-token": token },
            })
              .then((userRes) => {
                setUserData({
                  token,
                  user: userRes.data,
                  loading: false,
                });
                console.log(userRes);
              })
              .catch((error) => {
                console.error(new Error(error));
              });
          } else {
            setUserData({ loading: false });
          }
        })
        .catch((error) => {
          console.error(new Error(error));
        });
    };

    checkLoggedIn();
  }, []);

  return (
    <UserContext.Provider value={providerValue}>
      <Navbars />
      {globalMsg.message ? (
        <AlertMsg
          variant={globalMsg.variant}
          message={globalMsg.message}
          clearError={() => {
            setGlobalMsg({ message: undefined, variant: undefined });
          }}
        />
      ) : null}
      <Routes>
        <Route element={<ProtectedRoute isAllowed={!!userData} />}>
          <Route exact path="/sell" element={<Sell />} />
          <Route exact path="/messages" element={<Messages />} />
          <Route exact path="/detail/:id/edit" element={<EditListing />} />
          <Route exact path="/users/settings" element={<UserSettings />} />
          <Route exact path="/users/myitems" element={<MyItems />} />
          <Route exact path="/users/favorites" element={<Favorites />} />
          <Route exact path="/:location?/:category?/:text?" element={<Home />} />
        </Route>
        <Route exact path="/user/:username" component={Seller} />
        {/* <AuthCheckRoute exact path="/detail/:id" component={ListingDetail} /> */}
        <Route component={Default} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
