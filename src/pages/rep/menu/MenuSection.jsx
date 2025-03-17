import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Icons
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import ShoppingCartCheckoutRoundedIcon from '@mui/icons-material/ShoppingCartCheckoutRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';

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

const MenuSection = ({ userDetails, navigate }) => {
  const menuItems = [
    {
      key: 'catalog-customers',
      label: 'לקוחות',
      icon: <PeopleAltRoundedIcon fontSize="large" />,
      route: '/rep/selectCust',
      permission: 'repSelectCust',
      bgColor: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      iconBg: '#fef9ed',
    },
    {
      key: 'catalog-products',
      label: 'קטלוג מוצרים',
      icon: <CategoryRoundedIcon fontSize="large" />,
      route: '/rep/catalog',
      permission: 'repCatalog',
      bgColor: 'linear-gradient(135deg, #90caf9 0%, #047edf 100%)',
      iconBg: '#e6f4fe',
    },
    {
      key: 'orders',
      label: 'מצב ההזמנות',
      icon: <ShoppingCartCheckoutRoundedIcon fontSize="large" />,
      route: '/rep/orders',
      permission: 'repOrders',
      bgColor: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      iconBg: '#e8fbf2',
    },
    {
      key: 'invoices',
      label: 'חשבוניות',
      icon: <ReceiptLongRoundedIcon fontSize="large" />,
      route: '/rep/invoices',
      permission: 'repInvoices',
      bgColor: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      iconBg: '#f4eafd',
    },
    {
      key: 'receipt',
      label: 'קבלות',
      icon: <PaymentsRoundedIcon fontSize="large" />,
      route: '/rep/receipt',
      permission: 'userOrders',
      bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
      iconBg: '#feecea',
    },
    {
      key: 'accIndex',
      label: 'כרטסת',
      icon: <AccountBalanceWalletRoundedIcon fontSize="large" />,
      route: '/rep/accIndex',
      permission: 'repAccIndex',
      bgColor: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
      iconBg: '#e6f7ef',
    },
    {
      key: 'debtAging',
      label: 'גיול חובות',
      icon: <PaidRoundedIcon fontSize="large" />,
      route: '/rep/debtAging',
      permission: 'repDebtAging',
      bgColor: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
      iconBg: '#fff0e6',
    },
    {
      key: 'salesReport',
      label: 'דוח מכירות',
      icon: <QueryStatsRoundedIcon fontSize="large" />,
      route: '/rep/salesReport',
      permission: 'salesReports',
      bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      iconBg: '#eeeeff',
    },
    {
      key: 'salesReport',
      label: 'ניהול הקטגוריות',
      icon: <QueryStatsRoundedIcon fontSize="large" />,
      route: '/rep/editCatalogCats',
      permission: 'b2bManager',
      bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      iconBg: '#eeeeff',
    }
    
  ];

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: {
      y: -10,
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
      transition: { type: 'spring', stiffness: 300 },
    },
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <MenuGrid
      component={motion.div}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {menuItems
        .filter((item) => userDetails?.permissions?.includes(item.permission) ?? false)
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
                  color: 'white',
                  textShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
                  position: 'relative',
                  zIndex: 2,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                {item.label}
              </Typography>

              <motion.div
                initial={{ width: 40, opacity: 0.6 }}
                whileHover={{ width: 80, opacity: 1 }}
                style={{
                  height: 4,
                  borderRadius: 2,
                  background: 'white',
                  marginTop: 10,
                  position: 'relative',
                  zIndex: 2,
                }}
              />
            </MenuCard>
          </Tooltip>
        ))}
    </MenuGrid>
  );
};

export default MenuSection;