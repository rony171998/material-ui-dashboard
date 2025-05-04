import * as React from 'react';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
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
import { AccountBalanceRounded, CreditCardRounded, Sms, Email, Notifications, WhatsApp } from '@mui/icons-material';
import { CreditCardFactory } from '../abstractFactory/paymentFactories/CreditCardFactory';
import { PayPalFactory } from '../abstractFactory/paymentFactories/PayPalFactory';
import { BankTransferFactory } from '../abstractFactory/paymentFactories/BankTransferFactory';
import { SmsFactory } from '../abstractFactory/notificationFactories/SmsFactory';
import { NotificationProcessor } from '../abstractFactory/NotificationProcessor';
import { EmailFactory } from '../abstractFactory/notificationFactories/EmailFactory';
import { PushFactory } from '../abstractFactory/notificationFactories/PushFactory';
import { WhastappFactory } from '../abstractFactory/notificationFactories/WhatsappFactory';
import { CheckoutSession } from '../prototype/CheckoutPrototype';

// Extend the Product type from your rows data
type Product = typeof rows[0];

// Mapa de fábricas
const paymentFactories = {
  credit: new CreditCardFactory(),
  paypal: new PayPalFactory(),
  bank: new BankTransferFactory()
};

const notificationFactories = {
  sms: new SmsFactory(),
  email: new EmailFactory(),
  push: new PushFactory(),
  whatsapp: new WhastappFactory()
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

// Add this new component before the ProductGrid component
const MethodSelectionCard = ({ 
  icon: Icon, 
  label, 
  value, 
  selected, 
  onClick 
}: { 
  icon: React.ElementType;
  label: string;
  value: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <Card selected={selected}>
    <CardActionArea
      onClick={onClick}
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
        <Icon
          fontSize="small"
          sx={[
            (theme) => ({
              color: 'grey.400',
              ...theme.applyStyles('dark', {
                color: 'grey.600',
              }),
            }),
            selected && {
              color: 'primary.main',
            },
          ]}
        />
        <Typography sx={{ fontWeight: 'medium' }}>{label}</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default function ProductGrid() {
  const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
  const [paymentMethod, setPaymentMethod] = React.useState('credit');
  const [notificationMethod, setNotificationMethod] = React.useState('sms');
  const [paymentDetails, setPaymentDetails] = React.useState<any>({});
  const [notificationDetails, setNotificationDetails] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);
  const [purchaseStatus, setPurchaseStatus] = React.useState<{ success: boolean, message: string } | null>(null);
  const [step, setStep] = React.useState(1); // 1: selección método, 2: detalles pago
  const [openDialog, setOpenDialog] = React.useState(false);
  const [lastCheckoutSession, setLastCheckoutSession] = React.useState<CheckoutSession | null>(null);
  const [savedCheckoutSessions, setSavedCheckoutSessions] = React.useState<CheckoutSession[]>([]);

  const selectedProducts = React.useMemo(() =>
    rows.filter(row => rowSelectionModel.includes(row.id)),
    [rowSelectionModel]
  ); 

  const paymentProcessor = React.useMemo(() =>
    new PaymentProcessor(paymentFactories[paymentMethod]),
    [paymentMethod]
  );
  const notificationProcessor = React.useMemo(() =>
    new PaymentProcessor(notificationFactories[notificationMethod]),
    [notificationMethod]
  );
  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod((event.target as HTMLInputElement).value);
  };

  const handlePaymentDetailsChange = React.useCallback((details: any) => {
    setPaymentDetails(prev => ({ ...prev, ...details }));
  }, []);

  const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationMethod((event.target as HTMLInputElement).value);
  };

  const handleNotificationDetailsChange = React.useCallback((details: any) => {
    setNotificationDetails(prev => ({ ...prev, ...details }));
  }, []);

  const handlePurchaseClick = () => {
    if (selectedProducts.length === 0) {
      setPurchaseStatus({ success: false, message: 'Por favor seleccione al menos un producto' });
      return;
    }
    setStep(1);
    setOpenDialog(true);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleBackStep = () => {
    setStep(step - 1);
  };

  // Implementar handlePurchaseAgain correctamente
  const handlePurchaseAgain = async (session: CheckoutSession) => {
    try {
      setLoading(true);
      
      // Clonar la sesión
      const clonedSession = session.clone();
  
      // Actualizar todos los estados de una vez
      setPaymentMethod(clonedSession.paymentMethod);
      setNotificationMethod(clonedSession.notificationMethod);
      setPaymentDetails(clonedSession.paymentDetails);
      setNotificationDetails(clonedSession.notificationDetails);
      setRowSelectionModel(clonedSession.selectedProducts.map(p => p.id));
  
      // Procesar pago
      const paymentFactory = paymentFactories[clonedSession.paymentMethod];
      const paymentProcessor = new PaymentProcessor(paymentFactory);
      paymentProcessor.initializePaymentMethod(clonedSession.paymentDetails);
  
      const total = clonedSession.selectedProducts.reduce((sum, product) => sum + product.price, 0);
      const paymentResult = await paymentProcessor.processOrder(total, clonedSession.selectedProducts);
  
      // Procesar notificación
      const notificationFactory = notificationFactories[clonedSession.notificationMethod];
      const notificationProcessor = new NotificationProcessor(notificationFactory);
      notificationProcessor.initializeNotificationMethod(clonedSession.notificationDetails);
      const notificationResult = await notificationProcessor.processOrder();
  
      // Mostrar resultado combinado
      setPurchaseStatus({
        success: paymentResult.success && notificationResult.success,
        message: `Pago: ${paymentResult.message} | Notificación: ${notificationResult.message}`
      });
  
      // Guardar la nueva sesión
      const newSession = new CheckoutSession(
        clonedSession.paymentMethod,
        clonedSession.notificationMethod,
        clonedSession.selectedProducts,
        clonedSession.paymentDetails,
        clonedSession.notificationDetails
      );
      
      setLastCheckoutSession(newSession);
      setSavedCheckoutSessions(prev => [...prev, newSession]);
  
      setOpenDialog(false);
      setRowSelectionModel([]);
      setStep(1);
    } catch (error) {
      setPurchaseStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Error al repetir la compra'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseConfirm = async () => {
    setLoading(true);
    try {
      const factory = paymentFactories[paymentMethod];
      const processor = new PaymentProcessor(factory);
      processor.initializePaymentMethod(paymentDetails);

      const total = selectedProducts.reduce((sum, product) => sum + product.price, 0);
      const result = await processor.processOrder(total, selectedProducts);

      // Crear y guardar la sesión de compra
      const newCheckoutSession = new CheckoutSession(
        paymentMethod,
        notificationMethod,
        selectedProducts,
        paymentDetails,
        notificationDetails
      );

      setLastCheckoutSession(newCheckoutSession);
      setSavedCheckoutSessions(prev => [...prev, newCheckoutSession]);

      setPurchaseStatus({
        success: true,
        message: `${result?.message ?? 0} Transaction ID: ${result?.transactionId ?? 0}`
      });

      setStep(3);
    } catch (error) {
      setPurchaseStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Payment processing failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationConfirm = async () => {
    setLoading(true);
    try {
      // 1. Obtener la fábrica adecuada
      const factory = notificationFactories[notificationMethod];

      // 2. Crear el procesador de pago
      const processor = new NotificationProcessor(factory);
      processor.initializeNotificationMethod(notificationDetails);

      // 4. Procesar el pago
      const result = await processor.processOrder();

      // 5. Mostrar mensaje de éxito
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
  const columnsWithActions = React.useMemo(() => [
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
  ], []);

  const renderPaymentForm = () => {
    const FormComponent = paymentProcessor.getFormComponent();
    return <FormComponent onChange={handlePaymentDetailsChange} />;
  };

  const renderNotificationForm = () => {
    const FormComponent = notificationProcessor.getFormComponent();
    return <FormComponent onChange={handleNotificationDetailsChange} />;
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


      <div style={{ marginTop: 16 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>Historial de Compras</Typography>
        {savedCheckoutSessions.length === 0 ? (
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
            <Typography variant="body1" color="text.secondary">
              No hay compras guardadas
            </Typography>
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {savedCheckoutSessions.map((session, index) => (
              <Card 
                key={index}
                sx={{ 
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Compra #{savedCheckoutSessions.indexOf(session) + 1}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {new Date().toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
                <div style={{ marginTop: 1 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCardRounded fontSize="small" color="primary" />
                    Método: {session.paymentMethod.charAt(0).toUpperCase() + session.paymentMethod.slice(1)}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <AccountBalanceRounded fontSize="small" color="primary" />
                    Notificación: {session.notificationMethod.charAt(0).toUpperCase() + session.notificationMethod.slice(1)}
                  </Typography>
                </div>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Productos: {session.selectedProducts.length}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Total: ${session.selectedProducts.reduce((sum, product) => sum + product.price, 0).toFixed(2)}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handlePurchaseAgain(session)}
                  sx={{ 
                    mt: 2,
                    alignSelf: 'flex-start',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white'
                    }
                  }}
                >
                  Repetir esta compra
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

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
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                  }}
                >
                  <MethodSelectionCard
                    icon={CreditCardRounded}
                    label="Card"
                    value="credit"
                    selected={paymentMethod === "credit"}
                    onClick={() => setPaymentMethod("credit")}
                  />
                  <MethodSelectionCard
                    icon={AccountBalanceRounded}
                    label="Bank account"
                    value="bank"
                    selected={paymentMethod === "bank"}
                    onClick={() => setPaymentMethod("bank")}
                  />
                  <MethodSelectionCard
                    icon={AccountBalanceRounded}
                    label="Paypal"
                    value="paypal"
                    selected={paymentMethod === "paypal"}
                    onClick={() => setPaymentMethod("paypal")}
                  />
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
        ) : null}
        {step === 2 && (
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

        {step === 3 ? (
          <>
            <DialogTitle>Seleccione método de notificación</DialogTitle>
            <DialogContent>
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <RadioGroup
                  aria-label="notification-method"
                  name="notification-method"
                  value={notificationMethod}
                  onChange={handleNotificationChange}
                  sx={{
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                  }}
                >
                  <MethodSelectionCard
                    icon={Sms}
                    label="SMS"
                    value="sms"
                    selected={notificationMethod === "sms"}
                    onClick={() => setNotificationMethod("sms")}
                  />
                  <MethodSelectionCard
                    icon={Email}
                    label="Email"
                    value="email"
                    selected={notificationMethod === "email"}
                    onClick={() => setNotificationMethod("email")}
                  />
                  <MethodSelectionCard
                    icon={Notifications}
                    label="Push"
                    value="push"
                    selected={notificationMethod === "push"}
                    onClick={() => setNotificationMethod("push")}
                  />
                  <MethodSelectionCard
                    icon={WhatsApp}
                    label="Whatsapp"
                    value="whatsapp"
                    selected={notificationMethod === "whatsapp"}
                    onClick={() => setNotificationMethod("whatsapp")}
                  />
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
        ) : null}

        {step === 4 && (
          <>
            <DialogTitle>Complete los detalles de notificaciones</DialogTitle>
            <DialogContent>
              {renderNotificationForm()}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleBackStep}>Atrás</Button>
              <Button
                onClick={handleNotificationConfirm}
                color="primary"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} /> : null}
              >
                Enviar Notificacion
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}