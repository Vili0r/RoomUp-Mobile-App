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
