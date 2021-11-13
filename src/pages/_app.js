import '../styles/globals.css'
import CarContextProvider from '../context/CarContext'

const PorscheConfiguratorApp = ({ Component, pageProps }) => {
  return (
    <CarContextProvider>
      <Component {...pageProps} />
    </CarContextProvider>
  )
}

export default PorscheConfiguratorApp
