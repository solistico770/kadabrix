import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Tooltip, Grid, Paper, Divider, Avatar, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useUserStore } from '../../../kadabrix/userState';
import kdb from '../../../kadabrix/kadabrix';

// Icons
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import ShoppingCartCheckoutRoundedIcon from '@mui/icons-material/ShoppingCartCheckoutRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StorefrontIcon from '@mui/icons-material/Storefront';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

import logo from '../../../assets/logo.png';

// Styled components
const MenuGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: theme.spacing(3),
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: theme.spacing(2),
  },
}));

const MenuCard = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  borderRadius: '16px',
  overflow: 'hidden',
  height: '180px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  cursor: 'pointer',
  padding: theme.spacing(3),
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.4s ease',
  [theme.breakpoints.down('sm')]: {
    height: '150px',
    padding: theme.spacing(2),
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '20px',
  width: '56px',
  height: '56px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
  [theme.breakpoints.down('sm')]: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    top: '15px',
    right: '15px',
  },
}));

const AgentCard = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(135deg, #f6f9fc 0%, #eef1f5 100%)',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const CustomerCard = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(135deg, #f6f9fc 0%, #eef1f5 100%)',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  height: '8px',
  borderRadius: '4px',
  background: '#e2e8f0',
  position: 'relative',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  overflow: 'hidden',
}));

const ProgressIndicator = styled(Box)(({ bgColor }) => ({
  height: '100%',
  borderRadius: '4px',
  background: bgColor || '#3B82F6',
  transition: 'width 1s ease-in-out',
}));

// Menu items with modern styling and better icons
const menuItems = [
  { 
    key: 'catalog-customers', 
    label: 'לקוחות', 
    icon: <PeopleAltRoundedIcon fontSize="large" />,
    route: '/rep/selectCust', 
    permission: 'repSelectCust', 
    bgColor: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    iconBg: '#fef9ed'
  },
  { 
    key: 'catalog-products', 
    label: 'קטלוג מוצרים', 
    icon: <CategoryRoundedIcon fontSize="large" />,
    route: '/rep/catalog', 
    permission: 'repCatalog', 
    bgColor: 'linear-gradient(135deg, #90caf9 0%, #047edf 100%)',
    iconBg: '#e6f4fe'
  },
  { 
    key: 'orders', 
    label: 'מצב ההזמנות', 
    icon: <ShoppingCartCheckoutRoundedIcon fontSize="large" />,
    route: '/rep/orders', 
    permission: 'repOrders', 
    bgColor: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    iconBg: '#e8fbf2'
  },
  { 
    key: 'invoices', 
    label: 'חשבוניות', 
    icon: <ReceiptLongRoundedIcon fontSize="large" />,
    route: '/rep/invoices', 
    permission: 'repInvoices', 
    bgColor: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    iconBg: '#f4eafd'
  },
  { 
    key: 'receipt', 
    label: 'קבלות', 
    icon: <PaymentsRoundedIcon fontSize="large" />,
    route: '/rep/receipt', 
    permission: 'userOrders', 
    bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    iconBg: '#feecea'
  },
  { 
    key: 'accIndex', 
    label: 'כרטסת', 
    icon: <AccountBalanceWalletRoundedIcon fontSize="large" />,
    route: '/rep/accIndex', 
    permission: 'repAccIndex', 
    bgColor: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
    iconBg: '#e6f7ef'
  },
  { 
    key: 'debtAging', 
    label: 'גיול חובות', 
    icon: <PaidRoundedIcon fontSize="large" />,
    route: '/rep/debtAging', 
    permission: 'repDebtAging', 
    bgColor: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
    iconBg: '#fff0e6'
  },
  { 
    key: 'salesReport', 
    label: 'דוח מכירות', 
    icon: <QueryStatsRoundedIcon fontSize="large" />,
    route: '/rep/salesReport', 
    permission: 'salesReports', 
    bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    iconBg: '#eeeeff'
  },
];

const EnhancedMenu = () => {
  const navigate = useNavigate();
  const userDetails = useUserStore(state => state.userDetails);
  const [agentData, setAgentData] = useState({
    name: "",
    region: "",
    avatar: null,
    performance: {
      currentMonthSales: 0,
      target: 0,
      lastYearSame: 0,
      improvement: 0,
      daysLeft: 0
    },
    customers: {
      total: 0,
      withDebt: 0,
      totalDebt: 0,
      debtCategories: {
        current: 0,
        days30: 0,
        days60: 0,
        days90: 0
      }
    }
  });
  
  const [selectedCustomer, setSelectedCustomer] = useState({
    id: "",
    name: "",
    address: "",
    contactPerson: "",
    phone: "",
    debt: 0,
    obligo: 0,
    status: "",
    lastOrder: {
      date: "",
      amount: 0
    }
  });

  // Fetch agent and customer data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get agent from kdb.config as specified
        
        
        const data = await kdb.run({
          module: "repMenu",
          name: "dashboardData",
          data: {
          }
        });
        
        if (data.agentData) {
          setAgentData(data.agentData);
        }
        
        if (data.customerData) {
          setSelectedCustomer(data.customerData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    
    fetchData();
  }, []);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(amount);
  };
  
  // Card animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { 
      y: -10,
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
      transition: { type: 'spring', stiffness: 300 }
    }
  };

  // Staggered animation for cards
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Calculate percentages
  const performancePercentage = Math.round((agentData.performance.currentMonthSales / agentData.performance.target) * 100) || 0;
  const obligoUsagePercentage = Math.round((selectedCustomer.debt / selectedCustomer.obligo) * 100) || 0;

  return (
    <Container maxWidth="xl" sx={{ dir: 'rtl' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          my: { xs: 2, md: 4 },
          p: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 3, sm: 4, md: 6 },
          borderRadius: 4,
          backgroundColor: '#f8f9fa',
        }}
      >
        {/* Logo with animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: { xs: 120, sm: 150, md: 180 },
              mb: { xs: 3, md: 4 },
              filter: 'drop-shadow(0px 5px 15px rgba(0, 0, 0, 0.05))',
              mixBlendMode: 'multiply'
            }}
          />
        </motion.div>
        
        {/* Agent & Customer Info Section */}
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            width: '100%', 
            maxWidth: '1200px',
            mb: { xs: 2, md: 4 },
            px: { xs: 0, md: 2 }
          }}
        >
          {/* Agent Scope */}
          <Grid item xs={12} md={6}>
            <AgentCard dir="rtl">
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#3B82F6', mr: 2, width: 50, height: 50 }}>
                  {agentData.avatar ? <img src={agentData.avatar} alt={agentData.name} /> : <AccountCircleIcon fontSize="large" />}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">{agentData.name}</Typography>
                  <Typography variant="body2" color="text.secondary">אזור {agentData.region} | נותרו {agentData.performance.daysLeft} ימים בחודש</Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    <TrendingUpIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    ביצועי חודש
                  </Typography>
                  <Chip
                    size="small"
                    icon={<TrendingUpIcon />}
                    label={`+${agentData.performance.improvement}% משנה שעברה`}
                    color="success"
                    sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{formatCurrency(agentData.performance.currentMonthSales)}</Typography>
                  <Typography variant="body2">מתוך {formatCurrency(agentData.performance.target)}</Typography>
                </Box>
                
                <ProgressBar>
                  <ProgressIndicator 
                    bgColor={performancePercentage >= 90 ? '#10B981' : performancePercentage >= 70 ? '#3B82F6' : performancePercentage >= 50 ? '#F59E0B' : '#EF4444'} 
                    sx={{ width: `${Math.min(performancePercentage, 100)}%` }} 
                  />
                </ProgressBar>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    <LocalAtmIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    חובות לקוחות
                  </Typography>
                  <Chip
                    size="small"
                    label={`${agentData.customers.withDebt} לקוחות`}
                    color="warning"
                    sx={{ borderRadius: '8px' }}
                  />
                </Box>
                
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={3}>
                    <Paper 
                      sx={{ 
                        p: 1, 
                        textAlign: 'center',
                        borderRadius: '8px',
                        bgcolor: '#E1F5FE'
                      }}
                    >
                      <Typography variant="caption" display="block">שוטף</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(agentData.customers.debtCategories.current).replace('₪', '')}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper 
                      sx={{ 
                        p: 1, 
                        textAlign: 'center',
                        borderRadius: '8px',
                        bgcolor: '#FFF8E1'
                      }}
                    >
                      <Typography variant="caption" display="block">30+ יום</Typography>
                      <Typography variant="body2" fontWeight="bold" color="warning.main">
                        {formatCurrency(agentData.customers.debtCategories.days30).replace('₪', '')}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper 
                      sx={{ 
                        p: 1, 
                        textAlign: 'center',
                        borderRadius: '8px',
                        bgcolor: '#FEE2E2'
                      }}
                    >
                      <Typography variant="caption" display="block">60+ יום</Typography>
                      <Typography variant="body2" fontWeight="bold" color="error.light">
                        {formatCurrency(agentData.customers.debtCategories.days60).replace('₪', '')}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper 
                      sx={{ 
                        p: 1, 
                        textAlign: 'center',
                        borderRadius: '8px',
                        bgcolor: '#FECACA'
                      }}
                    >
                      <Typography variant="caption" display="block">90+ יום</Typography>
                      <Typography variant="body2" fontWeight="bold" color="error.dark">
                        {formatCurrency(agentData.customers.debtCategories.days90).replace('₪', '')}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </AgentCard>
          </Grid>
          
          {/* Selected Customer Scope */}
          <Grid item xs={12} md={6}>
            <CustomerCard dir="rtl">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#6366F1', mr: 2 }}>
                    <StorefrontIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{selectedCustomer.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{selectedCustomer.address}</Typography>
                  </Box>
                </Box>
                <Chip
                  icon={selectedCustomer.status === "בפיגור" ? <WarningIcon /> : null}
                  label={selectedCustomer.status}
                  color={selectedCustomer.status === "בפיגור" ? "error" : "success"}
                  sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold">פרטי קשר</Typography>
                    <Typography variant="body2">
                      <strong>איש קשר:</strong> {selectedCustomer.contactPerson}
                    </Typography>
                    <Typography variant="body2">
                      <strong>טלפון:</strong> {selectedCustomer.phone}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">הזמנה אחרונה</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2">{selectedCustomer.lastOrder.date}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
                      {formatCurrency(selectedCustomer.lastOrder.amount)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>מצב אשראי</Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">אובליגו</Typography>
                      <Typography variant="body2" fontWeight="bold">{formatCurrency(selectedCustomer.obligo)}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">חוב נוכחי</Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight="bold" 
                        color={selectedCustomer.status === "בפיגור" ? "error.main" : "inherit"}
                      >
                        {formatCurrency(selectedCustomer.debt)}
                      </Typography>
                    </Box>
                    
                    <ProgressBar>
                      <ProgressIndicator 
                        bgColor={obligoUsagePercentage >= 80 ? '#EF4444' : '#3B82F6'} 
                        sx={{ width: `${Math.min(obligoUsagePercentage, 100)}%` }} 
                      />
                    </ProgressBar>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">ניצול אובליגו: {obligoUsagePercentage}%</Typography>
                      <Typography variant="caption" color="text.secondary">
                        יתרה: {formatCurrency(selectedCustomer.obligo - selectedCustomer.debt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CustomerCard>
          </Grid>
        </Grid>

        {/* Menu Grid */}
        <MenuGrid
          component={motion.div}
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {menuItems
            .filter(item => userDetails.permissions.includes(item.permission))
            .map((item, index) => (
              <Tooltip title={`פתח ${item.label}`} placement="top" key={item.key}>
                <MenuCard
                  onClick={() => navigate(item.route)}
                  style={{ background: item.bgColor }}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <IconWrapper style={{ backgroundColor: item.iconBg, color: item.bgColor.split(' ')[2] }}>
                    {item.icon}
                  </IconWrapper>
                  
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    sx={{ 
                      color: "white", 
                      textShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
                      position: "relative",
                      zIndex: 2,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    {item.label}
                  </Typography>
                  
                  {/* Visual indicator that shows on hover */}
                  <motion.div
                    initial={{ width: 40, opacity: 0.6 }}
                    whileHover={{ width: 80, opacity: 1 }}
                    style={{
                      height: 4,
                      borderRadius: 2,
                      background: 'white',
                      marginTop: 10,
                      position: "relative",
                      zIndex: 2
                    }}
                  />
                </MenuCard>
              </Tooltip>
            ))}
        </MenuGrid>
      </Box>
    </Container>
  );
};

export default EnhancedMenu;