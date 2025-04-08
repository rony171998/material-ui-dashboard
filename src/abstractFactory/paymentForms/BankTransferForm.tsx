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
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
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
    accountNumber: yup.string()
        .matches(/^\d{8,20}$/, 'Número de cuenta inválido')
        .required('Número de cuenta requerido'),
    routingNumber: yup.string()
        .matches(/^\d{9}$/, 'Código de ruta inválido (debe tener 9 dígitos)')
        .required('Código de ruta requerido'),
    accountName: yup.string()
        .required('Nombre del titular requerido'),
    bankName: yup.string()
        .required('Nombre del banco requerido'),
    saveDetails: yup.boolean()
});

interface BankTransferFormProps {
    onChange: (data: any) => void;
    onSubmit?: () => void;
}

export function BankTransferForm({ onChange, onSubmit }: BankTransferFormProps) {
    const formik = useFormik({
        initialValues: {
            accountNumber: '',
            routingNumber: '',
            accountName: '',
            bankName: '',
            saveDetails: false
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            if (onSubmit) onSubmit();
        },
    });

    const formatAccountNumber = (value: string) => {
        return value.replace(/\D/g, ''); // Solo permite dígitos
    };

    const formatRoutingNumber = (value: string) => {
        const digits = value.replace(/\D/g, '');
        return digits.substring(0, 9); // Limita a 9 dígitos
    };

    React.useEffect(() => {
        onChange(formik.values);
    }, [formik.values, onChange]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <PaymentContainer>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">Transferencia Bancaria</Typography>
                    <AccountBalanceRoundedIcon sx={{ color: 'text.secondary' }} />
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
                        <FormLabel htmlFor="bank-name" required>
                            Nombre del Banco
                        </FormLabel>
                        <OutlinedInput
                            id="bank-name"
                            name="bankName"
                            autoComplete="organization"
                            placeholder="Ej: Banco Nacional"
                            required
                            size="small"
                            value={formik.values.bankName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                        />
                        {formik.touched.bankName && formik.errors.bankName && (
                            <Typography color="error" variant="caption">
                                {formik.errors.bankName}
                            </Typography>
                        )}
                    </FormGrid>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormGrid sx={{ flexGrow: 1 }}>
                        <FormLabel htmlFor="account-name" required>
                            Nombre del Titular
                        </FormLabel>
                        <OutlinedInput
                            id="account-name"
                            name="accountName"
                            autoComplete="name"
                            placeholder="Ej: Juan Pérez"
                            required
                            size="small"
                            value={formik.values.accountName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.accountName && Boolean(formik.errors.accountName)}
                        />
                        {formik.touched.accountName && formik.errors.accountName && (
                            <Typography color="error" variant="caption">
                                {formik.errors.accountName}
                            </Typography>
                        )}
                    </FormGrid>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormGrid sx={{ flexGrow: 1 }}>
                        <FormLabel htmlFor="account-number" required>
                            Número de Cuenta
                        </FormLabel>
                        <OutlinedInput
                            id="account-number"
                            name="accountNumber"
                            autoComplete="off"
                            placeholder="Ej: 12345678"
                            required
                            size="small"
                            value={formik.values.accountNumber}
                            onChange={(e) => {
                                const formatted = formatAccountNumber(e.target.value);
                                formik.setFieldValue('accountNumber', formatted);
                            }}
                            onBlur={formik.handleBlur}
                            error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                            inputProps={{ maxLength: 20 }}
                        />
                        {formik.touched.accountNumber && formik.errors.accountNumber && (
                            <Typography color="error" variant="caption">
                                {formik.errors.accountNumber}
                            </Typography>
                        )}
                    </FormGrid>

                    <FormGrid sx={{ flexGrow: 1 }}>
                        <FormLabel htmlFor="routing-number" required>
                            Código de Ruta (ABA/Routing)
                        </FormLabel>
                        <OutlinedInput
                            id="routing-number"
                            name="routingNumber"
                            autoComplete="off"
                            placeholder="Ej: 123456789"
                            required
                            size="small"
                            value={formik.values.routingNumber}
                            onChange={(e) => {
                                const formatted = formatRoutingNumber(e.target.value);
                                formik.setFieldValue('routingNumber', formatted);
                            }}
                            onBlur={formik.handleBlur}
                            error={formik.touched.routingNumber && Boolean(formik.errors.routingNumber)}
                            inputProps={{ maxLength: 9 }}
                        />
                        {formik.touched.routingNumber && formik.errors.routingNumber && (
                            <Typography color="error" variant="caption">
                                {formik.errors.routingNumber}
                            </Typography>
                        )}
                    </FormGrid>
                </Box>
            </PaymentContainer>

            <FormControlLabel
                control={
                    <Checkbox
                        name="saveDetails"
                        checked={formik.values.saveDetails}
                        onChange={formik.handleChange}
                        color="primary"
                    />
                }
                label="Guardar información bancaria para futuras compras"
            />
        </Box>
    );
}