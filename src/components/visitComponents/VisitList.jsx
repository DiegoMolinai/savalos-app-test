'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export default function VisitList() {
  const router = useRouter()

  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    clientName: '',
    commune: '',
    status: ''
  })

  const [selectedToDelete, setSelectedToDelete] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const fetchVisits = async () => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      if (filters.clientName) query.append('clientName', filters.clientName)
      if (filters.commune) query.append('commune', filters.commune)
      if (filters.status) query.append('status', filters.status)

      const res = await fetch(`/api/visits?${query.toString()}`)
      if (!res.ok) throw new Error('Error al obtener visitas')
      const data = await res.json()
      setVisits(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisits()
  }, [])

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleApplyFilters = (e) => {
    e.preventDefault()
    fetchVisits()
  }

  const handleResetFilters = () => {
    setFilters({ clientName: '', commune: '', status: '' })
    fetchVisits()
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/visits/${selectedToDelete}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Error al eliminar la visita')
      fetchVisits()
    } catch (err) {
      setError(err.message)
    } finally {
      setConfirmOpen(false)
    }
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Listado de Visitas</Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/visitas/nueva')}
          disabled={loading}
        >
          + Nueva Visita
        </Button>
      </Box>

      {/* Filtros */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleApplyFilters}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                name="clientName"
                label="Nombre del cliente"
                value={filters.clientName}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                name="commune"
                label="Comuna"
                value={filters.commune}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  label="Estado"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="Confirmada">Confirmada</MenuItem>
                  <MenuItem value="Reprogramada">Reprogramada</MenuItem>
                  <MenuItem value="Cancelada">Cancelada</MenuItem>
                  <MenuItem value="Realizada">Realizada</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Button fullWidth variant="outlined" type="submit" disabled={loading}>
                Filtrar
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button fullWidth variant="text" onClick={handleResetFilters} disabled={loading}>
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Cargando o sin datos */}
      {loading ? (
        <Paper elevation={1} sx={{ py: 5, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress />
          <Typography variant="body1">Cargando visitas...</Typography>
        </Paper>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : visits.length === 0 ? (
        <Paper elevation={1} sx={{ py: 5, textAlign: 'center' }}>
          <Typography variant="body1">No se encontraron visitas registradas con los filtros aplicados.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Creado por</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visits.map((visit) => (
                <TableRow key={visit._id}>
                  <TableCell>{visit.client?.fullName}</TableCell>
                  <TableCell>{visit.address?.street}, {visit.address?.commune}</TableCell>
                  <TableCell>{new Date(visit.scheduledDate).toLocaleDateString()}</TableCell>
                  <TableCell>{visit.status}</TableCell>
                  <TableCell>{visit.createdBy?.name}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedToDelete(visit._id)
                        setConfirmOpen(true)
                      }}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo confirmación */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro que deseas eliminar esta visita?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
