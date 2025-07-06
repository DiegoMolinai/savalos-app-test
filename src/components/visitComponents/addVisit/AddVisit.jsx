'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Paper,
  List,
  ListItem,
  IconButton
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export default function AddVisit() {
  const router = useRouter()

  const [client, setClient] = useState({ fullName: '', phone: '', email: '' })
  const [address, setAddress] = useState({ street: '', number: '', commune: '', region: '', reference: '' })
  const [scheduledDate, setScheduledDate] = useState('')
  const [status, setStatus] = useState('Pendiente')
  const [createdBy, setCreatedBy] = useState('')
  const [assignedTo, setAssignedTo] = useState([])
  const [notes, setNotes] = useState('')
  const [usedMaterials, setUsedMaterials] = useState([])
  const [materialSelected, setMaterialSelected] = useState('')
  const [materialQuantity, setMaterialQuantity] = useState(0)
  const [allUsers, setAllUsers] = useState([])
  const [allMaterials, setAllMaterials] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await fetch('/api/users')
        const resMaterials = await fetch('/api/materials')
        setAllUsers(await resUsers.json())
        setAllMaterials(await resMaterials.json())
      } catch {
        setError('Error al cargar usuarios o materiales.')
      }
    }
    fetchData()
  }, [])

  const handleAddMaterial = () => {
    const exists = usedMaterials.find((m) => m.materialId === materialSelected)
    const material = allMaterials.find((m) => m._id === materialSelected)
    if (exists || !material) return

    setUsedMaterials([...usedMaterials, {
      materialId: materialSelected,
      name: material.name,
      unit: material.unit,
      quantity: Number(materialQuantity)
    }])
    setMaterialSelected('')
    setMaterialQuantity(0)
  }

  const handleRemoveMaterial = (id) => {
    setUsedMaterials(usedMaterials.filter((m) => m.materialId !== id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const creator = allUsers.find((u) => u._id === createdBy)
    const assignees = allUsers
      .filter((u) => assignedTo.includes(u._id))
      .map((u) => ({ userId: u._id, name: u.fullName, role: u.role }))

    const visitData = {
      client,
      address,
      scheduledDate: new Date(scheduledDate),
      status,
      createdBy: {
        userId: createdBy,
        name: creator?.fullName || '',
        role: creator?.role || ''
      },
      assignedTo: assignees,
      usedMaterials,
      notes
    }

    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitData)
      })
      if (!res.ok) throw new Error('Error al guardar la visita')
      router.push('/visitas')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxWidth="md" mx="auto" p={3}>
      <Typography variant="h5" gutterBottom>Registrar nueva visita</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        {/* CLIENTE */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" mb={2}>Cliente</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth required label="Nombre completo" value={client.fullName} onChange={(e) => setClient({ ...client, fullName: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Teléfono" value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Email" type="email" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} />
            </Grid>
          </Grid>
        </Paper>

        {/* DIRECCIÓN */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" mb={2}>Dirección</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField fullWidth required label="Calle" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth required label="Número" value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required label="Comuna" value={address.commune} onChange={(e) => setAddress({ ...address, commune: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required label="Región" value={address.region} onChange={(e) => setAddress({ ...address, region: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Referencia" value={address.reference} onChange={(e) => setAddress({ ...address, reference: e.target.value })} />
            </Grid>
          </Grid>
        </Paper>

        {/* INFORMACIÓN GENERAL */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required type="datetime-local" label="Fecha programada" InputLabelProps={{ shrink: true }} value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Creado por</InputLabel>
                <Select value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} input={<OutlinedInput label="Creado por" />}>
                  {allUsers.map((u) => (
                    <MenuItem key={u._id} value={u._id}>{u.fullName} ({u.role})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Técnicos asignados</InputLabel>
            <Select
              multiple
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              input={<OutlinedInput label="Técnicos asignados" />}
              renderValue={(selected) =>
                selected.map(id => allUsers.find(u => u._id === id)?.fullName).join(', ')
              }
            >
              {allUsers.map((u) => (
                <MenuItem key={u._id} value={u._id}>
                  <Checkbox checked={assignedTo.includes(u._id)} />
                  <ListItemText primary={u.fullName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* MATERIALES */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" mb={2}>Materiales utilizados</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Material</InputLabel>
                <Select
                  value={materialSelected}
                  onChange={(e) => setMaterialSelected(e.target.value)}
                  input={<OutlinedInput label="Material" />}
                >
                  {allMaterials.map((mat) => (
                    <MenuItem key={mat._id} value={mat._id}>{mat.name} ({mat.unit})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField type="number" label="Cantidad" value={materialQuantity} onChange={(e) => setMaterialQuantity(e.target.value)} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Button fullWidth variant="contained" onClick={handleAddMaterial} disabled={!materialSelected || materialQuantity <= 0}>Agregar</Button>
            </Grid>
          </Grid>

          {usedMaterials.length > 0 && (
            <Paper variant="outlined" sx={{ mt: 2 }}>
              <List dense>
                {usedMaterials.map((mat) => (
                  <ListItem key={mat.materialId} secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveMaterial(mat.materialId)}>
                      <DeleteIcon />
                    </IconButton>
                  }>
                    {mat.name} – {mat.quantity} {mat.unit}
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Paper>

        {/* ESTADO Y NOTAS */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select value={status} onChange={(e) => setStatus(e.target.value)} input={<OutlinedInput label="Estado" />}>
                  {['Pendiente', 'Confirmada', 'Reprogramada', 'Cancelada', 'Realizada'].map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Notas / Observaciones" multiline rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Grid>
          </Grid>
        </Paper>

        <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={loading}>
          {loading ? 'Guardando...' : 'Registrar visita'}
        </Button>
      </form>
    </Box>
  )
}
