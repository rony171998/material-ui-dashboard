import * as React from 'react';
import {
  Box,
  Typography,
  OutlinedInput,
  FormLabel,
  TextField,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';

const PushContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const FormGrid = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
}));

const validationSchema = yup.object({
  deviceToken: yup.string()
    .required('Token del dispositivo requerido')
    .min(10, 'El token debe tener al menos 10 caracteres'),
  title: yup.string()
    .required('Título requerido')
    .max(50, 'El título no puede exceder 50 caracteres'),
  message: yup.string()
    .required('Mensaje requerido')
    .max(200, 'El mensaje no puede exceder 200 caracteres'),
  imageUrl: yup.string()
    .url('Debe ser una URL válida')
    .nullable(),
  clickAction: yup.string()
    .required('Acción al hacer clic requerida')
    .max(200, 'La URL/acción no puede exceder 200 caracteres'),
  priority: yup.string()
    .required('Prioridad requerida')
    .oneOf(['high', 'normal'], 'Prioridad inválida'),
});

interface PushFormProps {
  onChange: (data: any) => void;
  onSubmit?: () => void;
}

export function PushForm({ onChange, onSubmit }: PushFormProps) {
  const formik = useFormik({
    initialValues: {
      deviceToken: '',
      title: '',
      message: '',
      imageUrl: '',
      clickAction: '',
      priority: 'normal'
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      if (onSubmit) onSubmit();
    },
  });

  React.useEffect(() => {
    onChange(formik.values);
  }, [formik.values, onChange]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PushContainer>
        <Typography variant="subtitle2">Configuración de Notificación Push</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormGrid>
              <FormLabel htmlFor="deviceToken" required>
                Token del Dispositivo
              </FormLabel>
              <OutlinedInput
                id="deviceToken"
                name="deviceToken"
                placeholder="Ej: fcm_token_o_apns_token"
                required
                size="small"
                value={formik.values.deviceToken}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.deviceToken && Boolean(formik.errors.deviceToken)}
              />
              {formik.touched.deviceToken && formik.errors.deviceToken && (
                <Typography color="error" variant="caption">
                  {formik.errors.deviceToken}
                </Typography>
              )}
            </FormGrid>
          </Grid>

          <Grid item xs={12}>
            <FormGrid>
              <FormLabel htmlFor="title" required>
                Título
              </FormLabel>
              <OutlinedInput
                id="title"
                name="title"
                placeholder="Título de la notificación"
                required
                size="small"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
              />
              {formik.touched.title && formik.errors.title && (
                <Typography color="error" variant="caption">
                  {formik.errors.title}
                </Typography>
              )}
            </FormGrid>
          </Grid>

          <Grid item xs={12}>
            <FormGrid>
              <FormLabel htmlFor="message" required>
                Mensaje
              </FormLabel>
              <TextField
                id="message"
                name="message"
                required
                size="small"
                multiline
                rows={3}
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.message && Boolean(formik.errors.message)}
                helperText={`${formik.values.message.length}/200 caracteres`}
              />
              {formik.touched.message && formik.errors.message && (
                <Typography color="error" variant="caption">
                  {formik.errors.message}
                </Typography>
              )}
            </FormGrid>
          </Grid>

          <Grid item xs={12}>
            <FormGrid>
              <FormLabel htmlFor="imageUrl">
                URL de Imagen (Opcional)
              </FormLabel>
              <OutlinedInput
                id="imageUrl"
                name="imageUrl"
                placeholder="https://ejemplo.com/imagen.jpg"
                size="small"
                value={formik.values.imageUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
              />
              {formik.touched.imageUrl && formik.errors.imageUrl && (
                <Typography color="error" variant="caption">
                  {formik.errors.imageUrl}
                </Typography>
              )}
            </FormGrid>
          </Grid>

          <Grid item xs={12}>
            <FormGrid>
              <FormLabel htmlFor="clickAction" required>
                Acción al hacer clic
              </FormLabel>
              <OutlinedInput
                id="clickAction"
                name="clickAction"
                placeholder="URL o nombre de acción"
                required
                size="small"
                value={formik.values.clickAction}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.clickAction && Boolean(formik.errors.clickAction)}
              />
              {formik.touched.clickAction && formik.errors.clickAction && (
                <Typography color="error" variant="caption">
                  {formik.errors.clickAction}
                </Typography>
              )}
            </FormGrid>
          </Grid>

          <Grid item xs={12}>
            <FormGrid>
              <FormControl component="fieldset">
                <FormLabel component="legend" required>
                  Prioridad
                </FormLabel>
                <RadioGroup
                  row
                  aria-label="priority"
                  name="priority"
                  value={formik.values.priority}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="high"
                    control={<Radio />}
                    label="Urgente"
                  />
                  <FormControlLabel
                    value="normal"
                    control={<Radio />}
                    label="Normal"
                  />
                </RadioGroup>
              </FormControl>
              {formik.touched.priority && formik.errors.priority && (
                <Typography color="error" variant="caption">
                  {formik.errors.priority}
                </Typography>
              )}
            </FormGrid>
          </Grid>
        </Grid>
      </PushContainer>
    </Box>
  );
}