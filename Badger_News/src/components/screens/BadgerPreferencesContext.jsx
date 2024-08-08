import { createContext, useState, useContext } from "react";

const BadgerPreferencesContext = createContext([]); // export context

export const useBadgerPreferences = () => useContext(BadgerPreferencesContext); // useContext hook

// provide context to child components
export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState({});
  return (
    // share data with child components
    <BadgerPreferencesContext.Provider value={{ prefs, setPrefs }}>
      {children}
    </BadgerPreferencesContext.Provider>
  );
}
