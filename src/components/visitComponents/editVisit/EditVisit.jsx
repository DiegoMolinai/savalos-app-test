"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EditVisit({ visitId }) {
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [materialSelected, setMaterialSelected] = useState("");
  const [materialQuantity, setMaterialQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visitRes, usersRes, materialsRes] = await Promise.all([
          fetch(`/api/visits/${visitId}`),
          fetch("/api/users"),
          fetch("/api/materials"),
        ]);
        const [visitData, users, materials] = await Promise.all([
          visitRes.json(),
          usersRes.json(),
          materialsRes.json(),
        ]);
        setForm({
          ...visitData,
          usedMaterials: visitData.usedMaterials || [],
        });
        setAllUsers(users);
        setAllMaterials(materials);
      } catch {
        setError("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [visitId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [key, subkey] = name.split(".");
    if (subkey) {
      setForm((prev) => ({
        ...prev,
        [key]: { ...prev[key], [subkey]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddMaterial = () => {
    const exists = form.usedMaterials.find(
      (m) => m.materialId === materialSelected
    );
    const material = allMaterials.find((m) => m._id === materialSelected);
    if (exists || !material) return;
    setForm((prev) => ({
      ...prev,
      usedMaterials: [
        ...prev.usedMaterials,
        {
          materialId: materialSelected,
          name: material.name,
          unit: material.unit,
          quantity: Number(materialQuantity),
        },
      ],
    }));
    setMaterialSelected("");
    setMaterialQuantity(0);
  };

  const handleRemoveMaterial = (id) => {
    setForm((prev) => ({
      ...prev,
      usedMaterials: prev.usedMaterials.filter((m) => m.materialId !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.client?.fullName?.trim()) {
      setError("El nombre del cliente es obligatorio");
      return;
    }
    if (
      !form.address?.street?.trim() ||
      !form.address?.number?.trim() ||
      !form.address?.commune?.trim() ||
      !form.address?.region?.trim()
    ) {
      setError("Todos los campos de dirección son obligatorios");
      return;
    }
    if (!form.scheduledDate) {
      setError("Debes definir una fecha programada");
      return;
    }

    setSaving(true);
    try {
      const assignees = allUsers
        .filter((u) => form.assignedTo?.some((a) => a.userId === u._id))
        .map((u) => ({ userId: u._id, name: u.fullName, role: u.role }));

      const updatedForm = {
        ...form,
        scheduledDate: new Date(form.scheduledDate),
        assignedTo: assignees,
      };

      const res = await fetch(`/api/visits/${visitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedForm),
      });

      if (!res.ok)
        throw new Error((await res.json()).error || "Error al actualizar");

      setSuccess("Visita actualizada correctamente");
      router.refresh?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" p={3}>
      <Typography variant="h5" gutterBottom>
        Editar visita
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        {/* Cliente */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" mb={2}>Cliente</Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12 }}>
              <TextField fullWidth required label="Nombre completo" name="client.fullName" value={form.client?.fullName || ""} onChange={handleChange} />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Teléfono" name="client.phone" value={form.client?.phone || ""} onChange={handleChange} />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Email" name="client.email" type="email" value={form.client?.email || ""} onChange={handleChange} />
            </Grid>
          </Grid>
        </Paper>

        {/* Dirección */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" mb={2}>Dirección</Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 8 }}>
              <TextField fullWidth required label="Calle" name="address.street" value={form.address?.street || ""} onChange={handleChange} />
            </Grid>
            <Grid item size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth required label="Número" name="address.number" value={form.address?.number || ""} onChange={handleChange} />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required label="Comuna" name="address.commune" value={form.address?.commune || ""} onChange={handleChange} />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required label="Región" name="address.region" value={form.address?.region || ""} onChange={handleChange} />
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <TextField fullWidth label="Referencia" name="address.reference" value={form.address?.reference || ""} onChange={handleChange} />
            </Grid>
          </Grid>
        </Paper>

        {/* Técnicos */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required type="datetime-local" label="Fecha programada" InputLabelProps={{ shrink: true }} name="scheduledDate" value={form.scheduledDate ? new Date(form.scheduledDate).toISOString().slice(0, 16) : ""} onChange={handleChange} />
            </Grid>
          </Grid>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Técnicos asignados</InputLabel>
            <Select
              multiple
              value={form.assignedTo?.map((a) => a.userId) || []}
              onChange={(e) => {
                const selected = e.target.value;
                const techs = allUsers
                  .filter((u) => selected.includes(u._id))
                  .map((u) => ({
                    userId: u._id,
                    name: u.fullName,
                    role: u.role,
                  }));
                setForm((prev) => ({ ...prev, assignedTo: techs }));
              }}
              input={<OutlinedInput label="Técnicos asignados" />}
              renderValue={(selected) =>
                selected.map((id) => allUsers.find((u) => u._id === id)?.fullName).join(", ")
              }
            >
              {allUsers.map((u) => (
                <MenuItem key={u._id} value={u._id}>
                  <Checkbox checked={form.assignedTo?.some((a) => a.userId === u._id)} />
                  <ListItemText primary={u.fullName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Materiales */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" mb={2}>Materiales utilizados</Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Material</InputLabel>
                <Select
                  value={materialSelected}
                  onChange={(e) => setMaterialSelected(e.target.value)}
                  input={<OutlinedInput label="Material" />}
                >
                  {allMaterials.map((mat) => (
                    <MenuItem key={mat._id} value={mat._id}>
                      {mat.name} ({mat.unit})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12, sm: 3 }}>
              <TextField type="number" label="Cantidad" value={materialQuantity} onChange={(e) => setMaterialQuantity(e.target.value)} fullWidth />
            </Grid>
            <Grid item size={{ xs: 12, sm: 3 }}>
              <Button fullWidth variant="contained" onClick={handleAddMaterial} disabled={!materialSelected || materialQuantity <= 0}>
                Agregar
              </Button>
            </Grid>
          </Grid>

          {form.usedMaterials?.length > 0 && (
            <Paper variant="outlined" sx={{ mt: 2 }}>
              <List dense>
                {form.usedMaterials.map((mat) => (
                  <ListItem
                    key={mat.materialId}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoveMaterial(mat.materialId)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    {mat.name} – {mat.quantity} {mat.unit}
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Paper>

        {/* Estado y notas */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={form.status || ""}
                  onChange={handleChange}
                  input={<OutlinedInput label="Estado" />}
                >
                  {["Pendiente", "Confirmada", "Reprogramada", "Cancelada", "Realizada"].map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Notas / Observaciones"
                name="notes"
                multiline
                rows={4}
                value={form.notes || ""}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Paper>

        <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </Box>
  );
}
