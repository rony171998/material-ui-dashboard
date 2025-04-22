import * as React from 'react';
import {
  Box,
  Typography,
  OutlinedInput,
  FormLabel,
  TextField,
  Grid,
  MenuItem,
  Chip,
  Button,
  InputAdornment,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';

const WhatsAppContainer = styled(Box)(({ theme }) => ({
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
    .matches(/^\+?[0-9\s]{10,15}$/, 'Número de WhatsApp inválido'),
  message: yup.string()
    .when('mediaUrl', {
      is: (mediaUrl: string) => !mediaUrl,
      then: yup.string().required('El mensaje es requerido si no hay archivo multimedia')
    })
    .max(1000, 'El mensaje no puede exceder 1000 caracteres'),
  mediaUrl: yup.string()
    .url('Debe ser una URL válida')
    .nullable(),
  caption: yup.string()
    .when('mediaUrl', {
      is: (mediaUrl: string) => !!mediaUrl,
      then: yup.string().max(1000, 'El pie de foto no puede exceder 1000 caracteres')
    }),
  interactiveButtons: yup.array()
    .of(yup.string().max(20, 'El texto del botón no puede exceder 20 caracteres'))
    .max(3, 'Máximo 3 botones interactivos'),
  language: yup.string()
    .required('Idioma requerido')
    .oneOf(['es', 'en', 'pt', 'fr'], 'Idioma no soportado')
});

interface WhatsAppFormProps {
  onChange: (data: any) => void;
  onSubmit?: () => void;
}

export function WhatsAppForm({ onChange, onSubmit }: WhatsAppFormProps) {
  const [buttonText, setButtonText] = React.useState('');
  
  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
      message: '',
      mediaUrl: '',
      caption: '',
      interactiveButtons: [],
      language: 'es'
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      if (onSubmit) onSubmit();
    },
  });

  React.useEffect(() => {
    onChange(formik.values);
  }, [formik.values, onChange]);

  const handleAddButton = () => {
    if (buttonText && formik.values.interactiveButtons.length < 3) {
      formik.setFieldValue('interactiveButtons', [...formik.values.interactiveButtons, buttonText]);
      setButtonText('');
    }
  };

  const handleRemoveButton = (index: number) => {
    const newButtons = [...formik.values.interactiveButtons];
    newButtons.splice(index, 1);
    formik.setFieldValue('interactiveButtons', newButtons);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <WhatsAppContainer>
        <Typography variant="subtitle2">Configuración de WhatsApp</Typography>
        
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
              <FormLabel htmlFor="message">
                Mensaje
              </FormLabel>
              <TextField
                id="message"
                name="message"
                size="small"
                multiline
                rows={4}
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.message && Boolean(formik.errors.message)}
                helperText={`${formik.values.message.length}/1000 caracteres`}
                disabled={!!formik.values.mediaUrl && !formik.values.caption}
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
              <FormLabel htmlFor="mediaUrl">
                URL de Multimedia (Imagen, Video o Documento)
              </FormLabel>
              <OutlinedInput
                id="mediaUrl"
                name="mediaUrl"
                placeholder="https://ejemplo.com/archivo.jpg"
                size="small"
                value={formik.values.mediaUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mediaUrl && Boolean(formik.errors.mediaUrl)}
              />
              {formik.touched.mediaUrl && formik.errors.mediaUrl && (
                <Typography color="error" variant="caption">
                  {formik.errors.mediaUrl}
                </Typography>
              )}
            </FormGrid>
          </Grid>

          {formik.values.mediaUrl && (
            <Grid item xs={12}>
              <FormGrid>
                <FormLabel htmlFor="caption">
                  Pie de foto (Caption)
                </FormLabel>
                <TextField
                  id="caption"
                  name="caption"
                  size="small"
                  multiline
                  rows={2}
                  value={formik.values.caption}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.caption && Boolean(formik.errors.caption)}
                  helperText={`${formik.values.caption.length}/1000 caracteres`}
                />
                {formik.touched.caption && formik.errors.caption && (
                  <Typography color="error" variant="caption">
                    {formik.errors.caption}
                  </Typography>
                )}
              </FormGrid>
            </Grid>
          )}

          <Grid item xs={12}>
            <FormGrid>
              <FormLabel htmlFor="interactiveButtons">
                Botones Interactivos (Máx. 3)
              </FormLabel>
              <OutlinedInput
                id="interactiveButtons"
                name="interactiveButtons"
                size="small"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddButton()}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleAddButton}
                      disabled={!buttonText || formik.values.interactiveButtons.length >= 3}
                      edge="end"
                    >
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {formik.values.interactiveButtons.map((button, index) => (
                  <Chip
                    key={index}
                    label={button}
                    onDelete={() => handleRemoveButton(index)}
                    deleteIcon={<CancelIcon />}
                    size="small"
                  />
                ))}
              </Box>
              {formik.touched.interactiveButtons && formik.errors.interactiveButtons && (
                <Typography color="error" variant="caption">
                  {typeof formik.errors.interactiveButtons === 'string' 
                    ? formik.errors.interactiveButtons 
                    : 'Error en los botones'}
                </Typography>
              )}
            </FormGrid>
          </Grid>

          <Grid item xs={12}>
            <FormGrid>
              <FormLabel htmlFor="language" required>
                Idioma
              </FormLabel>
              <TextField
                select
                id="language"
                name="language"
                size="small"
                value={formik.values.language}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.language && Boolean(formik.errors.language)}
              >
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="en">Inglés</MenuItem>
                <MenuItem value="pt">Portugués</MenuItem>
                <MenuItem value="fr">Francés</MenuItem>
              </TextField>
              {formik.touched.language && formik.errors.language && (
                <Typography color="error" variant="caption">
                  {formik.errors.language}
                </Typography>
              )}
            </FormGrid>
          </Grid>
        </Grid>
      </WhatsAppContainer>
    </Box>
  );
}