import React, { createContext, useState } from "react";
import * as SecureStore from "expo-secure-store";
import axiosConfig from "../helpers/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        isLoading,
        login: (email, password) => {
          setIsLoading(true);
          axiosConfig
            .post("/login", {
              email,
              password,
              device_name: "mobile",
            })
            .then((res) => {
              const userResponse = {
                token: res.data.token,
                id: res.data.user.id,
                name: res.data.user.name,
                username: res.data.user.username,
                email: res.data.user.email,
                avatar: res.data.user.avatar,
              };
              setUser(userResponse);
              setError(null);
              SecureStore.setItemAsync("user", JSON.stringify(userResponse));
              setIsLoading(false);
            })
            .catch((erorr) => {
              setError(erorr.response.data.message);
              setIsLoading(false);
              const key = Object.keys(error.response.data.errors)[0];
              setError(error.response.data.errors[key][0]);
            });
        },
        logout: () => {
          setIsLoading(true);
          axiosConfig.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${user.token}`;
          axiosConfig
            .post("/logout")
            .then((res) => {
              setUser(null);
              SecureStore.deleteItemAsync("user");
              setError(null);
              setIsLoading(false);
            })
            .catch((erorr) => {
              setError(erorr.response.data.message);
              setIsLoading(false);
            })
            .finally(() => {
              setUser(null);
              SecureStore.deleteItemAsync("user");
            });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
