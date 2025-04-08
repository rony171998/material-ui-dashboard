import * as React from 'react';
import { DataGrid, GridRowSelectionModel, GridColDef } from '@mui/x-data-grid';
import { columns, rows } from '../internals/data/gridData';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { PaymentProcessor } from '../abstractFactory/PaymentProcessor';
import { CardActionArea, CardContent, styled, Typography } from '@mui/material';
import MuiCard from '@mui/material/Card';
import { AccountBalanceRounded, CreditCardRounded } from '@mui/icons-material';
import { CreditCardFactory } from '../abstractFactory/paymentFactories/CreditCardFactory';
import { PayPalFactory } from '../abstractFactory/paymentFactories/PayPalFactory';
import { BankTransferFactory } from '../abstractFactory/paymentFactories/BankTransferFactory';

// Extend the Product type from your rows data
type Product = typeof rows[0];

// Mapa de fábricas
const paymentFactories = {
  credit: new CreditCardFactory(),
  paypal: new PayPalFactory(),
  bank: new BankTransferFactory()
};

const Card = styled(MuiCard)<{ selected?: boolean }>(({ theme }) => ({
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  width: '100%',
  '&:hover': {
    background:
      'linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)',
    borderColor: 'primary.light',
    boxShadow: '0px 2px 8px hsla(0, 0%, 0%, 0.1)',
    ...theme.applyStyles('dark', {
      background:
        'linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)',
      borderColor: 'primary.dark',
      boxShadow: '0px 1px 8px hsla(210, 100%, 25%, 0.5) ',
    }),
  },
  [theme.breakpoints.up('md')]: {
    flexGrow: 1,
    maxWidth: `calc(50% - ${theme.spacing(1)})`,
  },
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        borderColor: (theme.vars || theme).palette.primary.light,
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

export default function ProductGrid() {
  const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
  const [paymentMethod, setPaymentMethod] = React.useState('credit');
  const [paymentDetails, setPaymentDetails] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);
  const [purchaseStatus, setPurchaseStatus] = React.useState<{ success: boolean, message: string } | null>(null);
  const [step, setStep] = React.useState(1); // 1: selección método, 2: detalles pago
  const [openDialog, setOpenDialog] = React.useState(false);
  const selectedProducts = rows.filter(row => rowSelectionModel.includes(row.id));
  const currentFactory = paymentFactories[paymentMethod];
  const paymentProcessor = React.useMemo(() => new PaymentProcessor(currentFactory), [paymentMethod]);

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod((event.target as HTMLInputElement).value);
  };

  const handlePaymentDetailsChange = (details: any) => {
    setPaymentDetails(prev => ({ ...prev, ...details }));
  };

  const handlePurchaseClick = () => {
    if (selectedProducts.length === 0) {
      setPurchaseStatus({ success: false, message: 'Por favor seleccione al menos un producto' });
      return;
    }
    setStep(1);
    setOpenDialog(true);
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const handlePurchaseConfirm = async () => {
    setLoading(true);
    try {
      // 1. Obtener la fábrica adecuada
      const factory = paymentFactories[paymentMethod];

      // 2. Crear el procesador de pago
      const processor = new PaymentProcessor(factory);
      processor.initializePaymentMethod(paymentDetails);

      // 3. Calcular el total
      const total = selectedProducts.reduce((sum, product) => sum + product.price, 0);

      // 4. Aquí es donde se dispara la petición al endpoint
      // (se ejecuta el processPayment de la implementación concreta)
      const result = await processor.processOrder(total, selectedProducts);

      setPurchaseStatus({
        success: true,
        message: `${result.message} Transaction ID: ${result.transactionId}`
      });
      
      setOpenDialog(false);
      setRowSelectionModel([]);
      setStep(1);
      setPaymentDetails({});
    } catch (error) {
      setPurchaseStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Payment processing failed'
      });
    } finally {
      setLoading(false);
    }
  };

  // Add action column to the existing columns
  const columnsWithActions: GridColDef[] = [
    ...columns,
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setRowSelectionModel([params.id]);
            setOpenDialog(true);
          }}
        >
          Buy
        </Button>
      ),
    },
  ];

  const renderPaymentForm = () => {
    const FormComponent = paymentProcessor.getFormComponent();
    return <FormComponent onChange={handlePaymentDetailsChange} />;
  };

  return (
    <div style={{ height: 800, width: '100%' }}>


      <div style={{ marginBottom: 16 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePurchaseClick}
          disabled={selectedProducts.length === 0}
        >
          Purchase Selected ({selectedProducts.length})
        </Button>
      </div>

      <DataGrid
        checkboxSelection
        rows={rows}
        columns={columnsWithActions}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
      />

      {purchaseStatus && (
        <Alert
          severity={purchaseStatus.success ? 'success' : 'error'}
          onClose={() => setPurchaseStatus(null)}
          sx={{ mb: 2 }}
        >
          {purchaseStatus.message}
        </Alert>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        {step === 1 ? (
          <>
            <DialogTitle>Seleccione método de pago</DialogTitle>
            <DialogContent>
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <RadioGroup
                  aria-label="payment-method"
                  name="payment-method"
                  value={paymentMethod}
                  onChange={handlePaymentChange}
                  sx={{
                    //display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                  }}
                >
                  <Card selected={paymentMethod === "credit"}>
                    <CardActionArea
                      onClick={() => setPaymentMethod("credit")}
                      sx={{
                        '.MuiCardActionArea-focusHighlight': {
                          backgroundColor: 'transparent',
                        },
                        '&:focus-visible': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CreditCardRounded
                          fontSize="small"
                          sx={[
                            (theme) => ({
                              color: 'grey.400',
                              ...theme.applyStyles('dark', {
                                color: 'grey.600',
                              }),
                            }),
                            paymentMethod === "credit" && {
                              color: 'primary.main',
                            },
                          ]}
                        />
                        <Typography sx={{ fontWeight: 'medium' }}>Card</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                  <Card selected={paymentMethod === "bank"}>
                    <CardActionArea
                      onClick={() => setPaymentMethod("bank")}
                      sx={{
                        '.MuiCardActionArea-focusHighlight': {
                          backgroundColor: 'transparent',
                        },
                        '&:focus-visible': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountBalanceRounded
                          fontSize="small"
                          sx={[
                            (theme) => ({
                              color: 'grey.400',
                              ...theme.applyStyles('dark', {
                                color: 'grey.600',
                              }),
                            }),
                            paymentMethod === "bank" && {
                              color: 'primary.main',
                            },
                          ]}
                        />
                        <Typography sx={{ fontWeight: 'medium' }}>Bank account</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                  <Card selected={paymentMethod === "paypal"}>
                    <CardActionArea
                      onClick={() => setPaymentMethod("paypal")}
                      sx={{
                        '.MuiCardActionArea-focusHighlight': {
                          backgroundColor: 'transparent',
                        },
                        '&:focus-visible': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountBalanceRounded
                          fontSize="small"
                          sx={[
                            (theme) => ({
                              color: 'grey.400',
                              ...theme.applyStyles('dark', {
                                color: 'grey.600',
                              }),
                            }),
                            paymentMethod === "paypal" && {
                              color: 'primary.main',
                            },
                          ]}
                        />
                        <Typography sx={{ fontWeight: 'medium' }}>Paypal</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </RadioGroup>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
              <Button onClick={handleNextStep} color="primary">
                Siguiente
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Complete los detalles de pago</DialogTitle>
            <DialogContent>
              {renderPaymentForm()}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleBackStep}>Atrás</Button>
              <Button
                onClick={handlePurchaseConfirm}
                color="primary"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} /> : null}
              >
                Confirmar Pago
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}