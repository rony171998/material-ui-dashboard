import * as React from 'react';
import {
  Box,
  Typography,
  OutlinedInput,
  FormControlLabel,
  Checkbox,
  FormLabel,
  TextField,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { DateTimePicker } from '@mui/x-date-pickers';

const SmsContainer = styled(Box)(({ theme }) => ({
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
  phoneNumber: yup.string()
    .required('Número de teléfono requerido')
    .matches(/^\+?[0-9\s]+$/, 'Número de teléfono no válido'),
  message: yup.string()
    .required('Mensaje requerido')
    .max(160, 'El mensaje no puede exceder 160 caracteres'),
  senderId: yup.string()
    .max(11, 'El senderId no puede exceder 11 caracteres'),
  deliveryReportRequired: yup.boolean(),
  scheduleTime: yup.date()
    .nullable()
    .min(new Date(), 'La fecha programada no puede ser en el pasado')
});

interface SmsFormProps {
  onChange: (data: any) => void;
  onSubmit?: () => void;
}

export function SmsForm({ onChange, onSubmit }: SmsFormProps) {
  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
      message: '',
      senderId: '',
      deliveryReportRequired: false,
      scheduleTime: null
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
        <SmsContainer>
          <Typography variant="subtitle2">Configuración de SMS</Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormGrid>
                <FormLabel htmlFor="phoneNumber" required>
                  Número de teléfono
                </FormLabel>
                <OutlinedInput
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+1234567890"
                  required
                  size="small"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <Typography color="error" variant="caption">
                    {formik.errors.phoneNumber}
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
                  rows={4}
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.message && Boolean(formik.errors.message)}
                  helperText={`${formik.values.message.length}/160 caracteres`}
                />
                {formik.touched.message && formik.errors.message && (
                  <Typography color="error" variant="caption">
                    {formik.errors.message}
                  </Typography>
                )}
              </FormGrid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormGrid>
                <FormLabel htmlFor="senderId">
                  Remitente (Sender ID)
                </FormLabel>
                <OutlinedInput
                  id="senderId"
                  name="senderId"
                  placeholder="Ej: MiEmpresa"
                  size="small"
                  value={formik.values.senderId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.senderId && Boolean(formik.errors.senderId)}
                />
                {formik.touched.senderId && formik.errors.senderId && (
                  <Typography color="error" variant="caption">
                    {formik.errors.senderId}
                  </Typography>
                )}
              </FormGrid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormGrid>
                <FormLabel htmlFor="scheduleTime">
                  Programar envío
                </FormLabel>
                <DateTimePicker
                  value={formik.values.scheduleTime}
                  onChange={(value) => formik.setFieldValue('scheduleTime', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      error={formik.touched.scheduleTime && Boolean(formik.errors.scheduleTime)}
                    />
                  )}
                />
                {formik.touched.scheduleTime && formik.errors.scheduleTime && (
                  <Typography color="error" variant="caption">
                    {formik.errors.scheduleTime}
                  </Typography>
                )}
              </FormGrid>
            </Grid>
          </Grid>
        </SmsContainer>
        
        <FormControlLabel
          control={
            <Checkbox 
              name="deliveryReportRequired" 
              checked={formik.values.deliveryReportRequired}
              onChange={formik.handleChange}
              color="primary"
            />
          }
          label="Requerir confirmación de entrega"
        />
      </Box>
  );
}