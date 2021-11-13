import React from 'react'
export const CarContext = React.createContext({})

const CarContextProvider = ({ children }) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false)
  const [carColor, setCarColor] = React.useState('#ff0000')

  const values = {
    showColorPicker,
    setShowColorPicker,
    carColor,
    setCarColor
  }

  return <CarContext.Provider value={values}>{children}</CarContext.Provider>
}

export const useCarContext = () => React.useContext(CarContext)

export default CarContextProvider
