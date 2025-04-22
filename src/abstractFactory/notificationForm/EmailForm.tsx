import * as React from 'react';
import {
  Box,
  Typography,
  OutlinedInput,
  FormControlLabel,
  Checkbox,
  FormLabel,
  TextField,
  Grid,
  MenuItem,
  InputAdornment,
  Chip,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelIcon from '@mui/icons-material/Cancel';

const EmailContainer = styled(Box)(({ theme }) => ({
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
  to: yup.string()
    .required('Destinatario requerido')
    .email('Debe ser una dirección de email válida'),
  subject: yup.string()
    .required('Asunto requerido')
    .max(100, 'El asunto no puede exceder 100 caracteres'),
  body: yup.string()
    .required('Cuerpo del email requerido'),
  cc: yup.array().of(yup.string().email('Debe ser una dirección de email válida')),
  bcc: yup.array().of(yup.string().email('Debe ser una dirección de email válida')),
  priority: yup.string()
    .required('Prioridad requerida')
    .oneOf(['high', 'medium', 'low'], 'Prioridad inválida'),
});

interface EmailFormProps {
  onChange: (data: any) => void;
  onSubmit?: () => void;
}

export function EmailForm({ onChange, onSubmit }: EmailFormProps) {
  const [ccInput, setCcInput] = React.useState('');
  const [bccInput, setBccInput] = React.useState('');
  const [attachmentNames, setAttachmentNames] = React.useState<string[]>([]);

  const formik = useFormik({
    initialValues: {
      to: '',
      subject: '',
      body: '',
      cc: [],
      bcc: [],
      attachments: [],
      priority: 'medium'
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      if (onSubmit) onSubmit();
    },
  });

  React.useEffect(() => {
    onChange(formik.values);
  }, [formik.values, onChange]);

  const handleAddCc = () => {
    if (ccInput && !formik.values.cc.includes(ccInput)) {
      formik.setFieldValue('cc', [...formik.values.cc, ccInput]);
      setCcInput('');
    }
  };

  const handleRemoveCc = (emailToRemove: string) => {
    formik.setFieldValue('cc', formik.values.cc.filter(email => email !== emailToRemove));
  };

  const handleAddBcc = () => {
    if (bccInput && !formik.values.bcc.includes(bccInput)) {
      formik.setFieldValue('bcc', [...formik.values.bcc, bccInput]);
      setBccInput('');
    }
  };

  const handleRemoveBcc = (emailToRemove: string) => {
    formik.setFieldValue('bcc', formik.values.bcc.filter(email => email !== emailToRemove));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const fileNames = files.map(file => file.name);
      setAttachmentNames([...attachmentNames, ...fileNames]);
      formik.setFieldValue('attachments', [...formik.values.attachments, ...files]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...formik.values.attachments];
    newAttachments.splice(index, 1);
    formik.setFieldValue('attachments', newAttachments);

    const newAttachmentNames = [...attachmentNames];
    newAttachmentNames.splice(index, 1);
    setAttachmentNames(newAttachmentNames);
  };

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <EmailContainer>
          <Typography variant="subtitle2">Configuración de Email</Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormGrid>
                <FormLabel htmlFor="to" required>
                  Para
                </FormLabel>
                <OutlinedInput
                  id="to"
                  name="to"
                  placeholder="destinatario@example.com"
                  required
                  size="small"
                  value={formik.values.to}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.to && Boolean(formik.errors.to)}
                />
                {formik.touched.to && formik.errors.to && (
                  <Typography color="error" variant="caption">
                    {formik.errors.to}
                  </Typography>
                )}
              </FormGrid>
            </Grid>

            <Grid item xs={12}>
              <FormGrid>
                <FormLabel htmlFor="subject" required>
                  Asunto
                </FormLabel>
                <OutlinedInput
                  id="subject"
                  name="subject"
                  required
                  size="small"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.subject && Boolean(formik.errors.subject)}
                />
                {formik.touched.subject && formik.errors.subject && (
                  <Typography color="error" variant="caption">
                    {formik.errors.subject}
                  </Typography>
                )}
              </FormGrid>
            </Grid>

            <Grid item xs={12}>
              <FormGrid>
                <FormLabel htmlFor="cc">
                  CC (Copia)
                </FormLabel>
                <OutlinedInput
                  id="cc"
                  name="cc"
                  size="small"
                  value={ccInput}
                  onChange={(e) => setCcInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCc()}
                  onBlur={handleAddCc}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button size="small" onClick={handleAddCc}>Agregar</Button>
                    </InputAdornment>
                  }
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {formik.values.cc.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      onDelete={() => handleRemoveCc(email)}
                      size="small"
                    />
                  ))}
                </Box>
              </FormGrid>
            </Grid>

            <Grid item xs={12}>
              <FormGrid>
                <FormLabel htmlFor="bcc">
                  BCC (Copia oculta)
                </FormLabel>
                <OutlinedInput
                  id="bcc"
                  name="bcc"
                  size="small"
                  value={bccInput}
                  onChange={(e) => setBccInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddBcc()}
                  onBlur={handleAddBcc}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button size="small" onClick={handleAddBcc}>Agregar</Button>
                    </InputAdornment>
                  }
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {formik.values.bcc.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      onDelete={() => handleRemoveBcc(email)}
                      size="small"
                    />
                  ))}
                </Box>
              </FormGrid>
            </Grid>

            <Grid item xs={12}>
              <FormGrid>
                <FormLabel htmlFor="priority">
                  Prioridad
                </FormLabel>
                <TextField
                  select
                  id="priority"
                  name="priority"
                  size="small"
                  value={formik.values.priority}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.priority && Boolean(formik.errors.priority)}
                >
                  <MenuItem value="high">Alta</MenuItem>
                  <MenuItem value="medium">Media</MenuItem>
                  <MenuItem value="low">Baja</MenuItem>
                </TextField>
              </FormGrid>
            </Grid>

            <Grid item xs={12}>
              <FormGrid>
                <FormLabel htmlFor="body" required>
                  Cuerpo del mensaje
                </FormLabel>
                <TextField
                  id="body"
                  name="body"
                  required
                  size="small"
                  multiline
                  rows={6}
                  value={formik.values.body}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.body && Boolean(formik.errors.body)}
                />
                {formik.touched.body && formik.errors.body && (
                  <Typography color="error" variant="caption">
                    {formik.errors.body}
                  </Typography>
                )}
              </FormGrid>
            </Grid>

            <Grid item xs={12}>
              <FormGrid>
                <FormLabel htmlFor="attachments">
                  Archivos adjuntos
                </FormLabel>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFileIcon />}
                  size="small"
                >
                  Adjuntar archivos
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileUpload}
                  />
                </Button>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {attachmentNames.map((name, index) => (
                    <Chip
                      key={index}
                      label={name}
                      onDelete={() => handleRemoveAttachment(index)}
                      deleteIcon={<CancelIcon />}
                      size="small"
                    />
                  ))}
                </Box>
              </FormGrid>
            </Grid>
          </Grid>
        </EmailContainer>
      </Box>
  );
}