import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Tanadon",
  });
  return (
    <AuthContext.Provider>
      valur={{ user }}
      {children}
    </AuthContext.Provider>
  );
};
