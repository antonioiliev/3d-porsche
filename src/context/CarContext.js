import React from "react";
export const CarContext = React.createContext({});

const CarContextProvider = ({ children }) => {
  const [carColor, setCarColor] = React.useState("#ff0000");

  const values = {
    carColor,
    setCarColor,
  };

  return <CarContext.Provider value={values}>{children}</CarContext.Provider>;
};

export const useCarContext = () => React.useContext(CarContext);

export default CarContextProvider;
