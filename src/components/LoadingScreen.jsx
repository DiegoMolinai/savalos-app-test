// src/components/LoadingScreen.jsx
'use client'

import { CircularProgress, Box, Typography } from '@mui/material'

export default function LoadingScreen() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column">
      <CircularProgress size={60} color="primary" />
      <Typography variant="h6" mt={2}>Cargando aplicación...</Typography>
    </Box>
  )
}
