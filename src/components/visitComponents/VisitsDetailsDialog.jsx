"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Grid,
  Stack,
  Avatar,
  Chip,
  Tooltip,
  Box,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Event as EventIcon,
  AssignmentInd as AssignmentIndIcon,
  Inventory2 as Inventory2Icon,
  Notes as NotesIcon,
} from "@mui/icons-material";

export default function VisitDetailsDialog({ open, onClose, visit }) {
  if (!visit) return null;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalles de la Visita</DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {/* CLIENTE */}
        <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
          <Typography
            variant="subtitle1"
            color="primary"
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <PersonIcon sx={{ mr: 1 }} /> Cliente
          </Typography>
          <Grid container spacing={1}>
            {/* <Grid item size={{ xs: 12, sm: 6 }}>
              <Typography><strong>Nombre:</strong> {visit.client?.fullName}</Typography>
            </Grid> */}

            <Grid item size={{ xs: 12, sm: 3 }}>
              <Typography>
                <strong>Nombre:</strong> {visit.client?.firstName}
              </Typography>
            </Grid>
            <Grid item size={{ xs: 12, sm: 3 }}>
              <Typography>
                <strong>Apellido:</strong> {visit.client?.lastName}
              </Typography>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <Typography fontWeight="bold">
                <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                Teléfono: {visit.client?.phone || "-"}
              </Typography>
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <Typography>
                <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                Correo{visit.client?.email || "-"}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* DIRECCIÓN */}
        <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
          <Typography
            variant="subtitle1"
            color="primary"
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <LocationOnIcon sx={{ mr: 1 }} /> Dirección
          </Typography>
          <Grid container spacing={1}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <Typography>
                {visit.address?.street} #{visit.address?.number}
              </Typography>
            </Grid>
            <Grid item size={{ xs: 6, sm: 3 }}>
              <Typography>
                <strong>Comuna:</strong> {visit.address?.commune}
              </Typography>
            </Grid>
            <Grid item size={{ xs: 6, sm: 3 }}>
              <Typography>
                <strong>Región:</strong> {visit.address?.region}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* FECHA Y ESTADO */}
        <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
          <Grid container spacing={1}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="subtitle1"
                color="primary"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <EventIcon sx={{ mr: 1 }} /> Fecha Programada
              </Typography>
              <Typography>{formatDate(visit.scheduledDate)}</Typography>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                Estado
              </Typography>
              <Chip
                label={visit.status}
                color={
                  visit.status === "Realizada"
                    ? "success"
                    : visit.status === "Pendiente"
                    ? "warning"
                    : visit.status === "Cancelada"
                    ? "error"
                    : "info"
                }
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>

        {/* TÉCNICOS */}
        <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
          <Typography
            variant="subtitle1"
            color="primary"
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <AssignmentIndIcon sx={{ mr: 1 }} /> Técnicos Asignados
          </Typography>
          {visit.assignedTo?.length > 0 ? (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {visit.assignedTo.map((tech, i) => (
                <Chip
                  key={i}
                  avatar={<Avatar>{tech.name?.[0]}</Avatar>}
                  label={tech.name}
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          ) : (
            <Typography>No asignados</Typography>
          )}
        </Box>

        {/* MATERIALES DETALLADOS */}
        <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
          <Typography
            variant="subtitle1"
            color="primary"
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <Inventory2Icon sx={{ mr: 1 }} /> Materiales Usados
          </Typography>
          {visit.usedMaterials?.length > 0 ? (
            <Grid container spacing={1}>
              {visit.usedMaterials.map((mat, index) => (
                <Grid key={index} item size={{ xs: 12, sm: 6 }}>
                  <Typography>
                    <strong>{mat.name}</strong> — {mat.quantity} unidades
                  </Typography>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>Sin materiales registrados</Typography>
          )}
        </Box>

        {/* NOTAS */}
        <Box sx={{ p: 2 }}>
          <Typography
            variant="subtitle1"
            color="primary"
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <NotesIcon sx={{ mr: 1 }} /> Notas
          </Typography>
          <Typography>{visit.notes || "Sin observaciones"}</Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
