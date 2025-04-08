import * as React from 'react';
import {
  Box,
  Typography,
  OutlinedInput,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  FormLabel
} from '@mui/material';
import PayPalIcon from '@mui/icons-material/Payment';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';

const PaymentContainer = styled(Box)(({ theme }) => ({
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
  email: yup.string()
    .email('Ingrese un email válido')
    .required('Email de PayPal requerido')
    .test(
      'is-paypal-email',
      'Debe ser un email de PayPal',
      (value) => {
        // Validación básica - en producción usaría una verificación más robusta
        return value.endsWith('@paypal.com') || 
               value.endsWith('@gmail.com') || 
               value.endsWith('@hotmail.com');
      }
    ),
  saveAccount: yup.boolean()
});

interface PayPalFormProps {
  onChange: (data: any) => void;
  onSubmit?: () => void;
}

export function PayPalForm({ onChange, onSubmit }: PayPalFormProps) {
  const formik = useFormik({
    initialValues: {
      email: '',
      saveAccount: false
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
      <PaymentContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="subtitle2">PayPal</Typography>
          <PayPalIcon sx={{ color: 'text.secondary' }} />
        </Box>
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            gap: 2,
          }}
        >
          <FormGrid sx={{ flexGrow: 1 }}>
            <FormLabel htmlFor="paypal-email" required>
              Email de PayPal
            </FormLabel>
            <OutlinedInput
              id="paypal-email"
              name="email"
              autoComplete="email"
              placeholder="usuario@paypal.com"
              required
              size="small"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              startAdornment={
                <InputAdornment position="start">
                  <PayPalIcon color="action" />
                </InputAdornment>
              }
            />
            {formik.touched.email && formik.errors.email && (
              <Typography color="error" variant="caption">
                {formik.errors.email}
              </Typography>
            )}
          </FormGrid>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Al continuar, serás redirigido a PayPal para completar tu pago de forma segura.
          </Typography>
        </Box>
      </PaymentContainer>
      
      <FormControlLabel
        control={
          <Checkbox 
            name="saveAccount" 
            checked={formik.values.saveAccount}
            onChange={formik.handleChange}
            color="primary"
          />
        }
        label="Guardar esta cuenta de PayPal para futuras compras"
      />
    </Box>
  );
}