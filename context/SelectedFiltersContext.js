import { createContext, useContext, useState } from "react";

const SelectedFiltersContext = createContext();

export const SelectedFiltersContextProvider = ({ children }) => {
  const [selectedPropertyFilterQueries, setSelctedPropertyFilterQueries] =
    useState(null);
  const [selectedRoommateFilterQueries, setSelctedRoommateFilterQueries] =
    useState(null);

  return (
    <SelectedFiltersContext.Provider
      value={{
        selectedPropertyFilterQueries,
        setSelctedPropertyFilterQueries,
        selectedRoommateFilterQueries,
        setSelctedRoommateFilterQueries,
      }}
    >
      {children}
    </SelectedFiltersContext.Provider>
  );
};

export const useSelectedFiltersContext = () =>
  useContext(SelectedFiltersContext);
