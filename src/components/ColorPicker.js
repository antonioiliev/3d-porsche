import { HexColorPicker } from 'react-colorful'
import { useCarContext } from '../context/CarContext'
import styled from 'styled-components'

const ColorPicker = () => {
  const { carColor, setCarColor } = useCarContext()
  return (
    <ColorPickerContainer>
      <HexColorPicker color={carColor} onChange={(color) => setCarColor(color)} />
    </ColorPickerContainer>
  )
}

export default ColorPicker

const ColorPickerContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;

  @media (max-width: 768px) {
    .react-colorful {
      width: 100px;
      height: 150px;
    }
  }
`
