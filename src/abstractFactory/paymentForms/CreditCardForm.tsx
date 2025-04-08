// CreditCardForm.tsx
import * as React from 'react';
import {
  Box,
  Typography,
  OutlinedInput,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  FormLabel
} from '@mui/material';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import SimCardRoundedIcon from '@mui/icons-material/SimCardRounded';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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
  cardNumber: yup.string()
    .matches(/^[\d ]{16,19}$/, 'Número de tarjeta inválido')
    .required('Número de tarjeta requerido'),
  cvv: yup.string()
    .matches(/^\d{3,4}$/, 'CVV inválido')
    .required('CVV requerido'),
  cardName: yup.string()
    .required('Nombre en la tarjeta requerido'),
  expirationDate: yup.string()
    .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Formato MM/YY')
    .test(
      'is-valid-date',
      'Fecha expirada',
      value => {
        if (!value) return false;
        const [month, year] = value.split('/');
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        
        return (
          parseInt(year) > currentYear || 
          (parseInt(year) === currentYear && parseInt(month) >= currentMonth)
        );
      }
    )
    .required('Fecha de expiración requerida'),
  saveCard: yup.boolean()
});

interface CreditCardFormProps {
  onChange: (data: any) => void;
  onSubmit?: () => void;
}

export function CreditCardForm({ onChange, onSubmit }: CreditCardFormProps) {
  const [showCvv, setShowCvv] = React.useState(false);
  
  const formik = useFormik({
    initialValues: {
      cardNumber: '',
      cvv: '',
      cardName: '',
      expirationDate: '',
      saveCard: false
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      if (onSubmit) onSubmit();
    },
  });

  // Formatear número de tarjeta para mostrar como XXXX XXXX XXXX XXXX
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  const formatExpirationDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    formik.setFieldValue('cardNumber', formatted);
  };

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpirationDate(e.target.value);
    formik.setFieldValue('expirationDate', formatted);
  };

  const toggleCvvVisibility = () => {
    setShowCvv(!showCvv);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PaymentContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="subtitle2">Credit card</Typography>
          <CreditCardRoundedIcon sx={{ color: 'text.secondary' }} />
        </Box>
        
        <SimCardRoundedIcon
          sx={{
            fontSize: { xs: 48, sm: 56 },
            transform: 'rotate(90deg)',
            color: 'text.secondary',
            alignSelf: 'center'
          }}
        />
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            gap: 2,
          }}
        >
          <FormGrid sx={{ flexGrow: 1 }}>
            <FormLabel htmlFor="card-number" required>
              Card number
            </FormLabel>
            <OutlinedInput
              id="card-number"
              autoComplete="card-number"
              placeholder="0000 0000 0000 0000"
              required
              size="small"
              value={formik.values.cardNumber}
              onChange={handleCardNumberChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
              inputProps={{ maxLength: 19 }}
              startAdornment={
                <InputAdornment position="start">
                  <CreditCardRoundedIcon color="action" />
                </InputAdornment>
              }
            />
            {formik.touched.cardNumber && formik.errors.cardNumber && (
              <Typography color="error" variant="caption">
                {formik.errors.cardNumber}
              </Typography>
            )}
          </FormGrid>
          
          <FormGrid sx={{ maxWidth: '20%' }}>
            <FormLabel htmlFor="cvv" required>
              CVV
            </FormLabel>
            <OutlinedInput
              id="cvv"
              autoComplete="CVV"
              placeholder="123"
              required
              size="small"
              type={showCvv ? 'text' : 'password'}
              value={formik.values.cvv}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cvv && Boolean(formik.errors.cvv)}
              inputProps={{ maxLength: 4 }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle CVV visibility"
                    onClick={toggleCvvVisibility}
                    edge="end"
                    size="small"
                  >
                    {showCvv ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {formik.touched.cvv && formik.errors.cvv && (
              <Typography color="error" variant="caption">
                {formik.errors.cvv}
              </Typography>
            )}
          </FormGrid>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormGrid sx={{ flexGrow: 1 }}>
            <FormLabel htmlFor="card-name" required>
              Name
            </FormLabel>
            <OutlinedInput
              id="card-name"
              name="cardName"
              autoComplete="cc-name"
              placeholder="John Smith"
              required
              size="small"
              value={formik.values.cardName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cardName && Boolean(formik.errors.cardName)}
            />
            {formik.touched.cardName && formik.errors.cardName && (
              <Typography color="error" variant="caption">
                {formik.errors.cardName}
              </Typography>
            )}
          </FormGrid>
          
          <FormGrid sx={{ flexGrow: 1 }}>
            <FormLabel htmlFor="card-expiration" required>
              Expiration date
            </FormLabel>
            <OutlinedInput
              id="card-expiration"
              name="expirationDate"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              required
              size="small"
              value={formik.values.expirationDate}
              onChange={handleExpirationDateChange}
              onBlur={formik.handleBlur}
              error={formik.touched.expirationDate && Boolean(formik.errors.expirationDate)}
              inputProps={{ maxLength: 5 }}
            />
            {formik.touched.expirationDate && formik.errors.expirationDate && (
              <Typography color="error" variant="caption">
                {formik.errors.expirationDate}
              </Typography>
            )}
          </FormGrid>
        </Box>
      </PaymentContainer>
      
      <FormControlLabel
        control={
          <Checkbox 
            name="saveCard" 
            checked={formik.values.saveCard}
            onChange={formik.handleChange}
            color="primary"
          />
        }
        label="Remember credit card details for next time"
      />
    </Box>
  );
}