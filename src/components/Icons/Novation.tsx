import { useTheme } from '@mui/material'
import { ReactElement } from 'react'

const NovationLogo = (): ReactElement<any, any> => {
  const theme = useTheme()
  return (
    <svg viewBox="1.85 1.4 128.702 129.2" width="23.91" height="24">
      <path
        style={{ fill: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
        d="M 120.55 1.4 L 11.85 1.4 C 6.35 1.4 1.85 5.9 1.85 11.4 L 1.85 120.6 C 1.85 126.1 6.35 130.6 11.85 130.6 L 120.55 130.6 C 126.05 130.6 130.55 126.1 130.55 120.6 L 130.55 11.5 C 130.65 5.9 126.15 1.4 120.55 1.4 Z M 13.25 64.2 L 68.85 8.6 L 95.45 35.3 L 39.85 90.9 L 13.25 64.2 Z M 116.85 74.3 C 115.55 78.7 113.15 82.8 109.45 86.5 L 72.45 123.5 L 45.45 96.5 L 101.05 40.9 L 108.45 48.3 C 112.35 52.2 115.05 56.4 116.55 61 C 117.95 65.4 118.05 69.9 116.85 74.3 Z"
      />
    </svg>
  )
}
export default NovationLogo
