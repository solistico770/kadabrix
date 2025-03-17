import React from 'react';
import { Box, Typography, Avatar, Chip, Divider, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StorefrontIcon from '@mui/icons-material/Storefront';
import WarningIcon from '@mui/icons-material/Warning';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Paper)(({ theme }) => ({
  borderRadius: '21px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08), 0 4px 15px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 18px 50px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 0, 0, 0.08)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: '16px',
  },
}));

const ProgressBar = styled(Box)(() => ({
  height: '10px',
  borderRadius: '5px',
  background: '#e0e7ff',
  position: 'relative',
  marginTop: 12,
  marginBottom: 12,
  overflow: 'hidden',
}));

const ProgressIndicator = styled(motion.div)(({ bgColor }) => ({
  height: '100%',
  borderRadius: '5px',
  background: bgColor || '#3b82f6',
}));

// Reusable styles
const fontSizes = {
  heading: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
  body: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
  caption: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
  title: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
};

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

const CustomerInfo = ({ selectedCustomer, obligoUsagePercentage, formatCurrency }) => {
  // Safeguard for formatCurrency
  const safeFormatCurrency = typeof formatCurrency === 'function' 
    ? formatCurrency 
    : (amount) => `₪${amount ?? 0}`;

  // Extract customer data with fallbacks
  const {
    contactPerson = 'לא נבחר לקוח',
    address = 'כתובת לא זמינה',
    status = 'לא זמין',
    name = 'לא זמין',
    phone = 'לא זמין',
    lastOrder = {},
    obligo = 0,
    debt = 0
  } = selectedCustomer || {};

  const isOverdue = status === 'בפיגור';
  const balance = obligo - debt;

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <StyledCard dir="rtl">
        {/* Company Name Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
              <Avatar
                sx={{
                  bgcolor: '#6366f1',
                  mr: 2,
                  width: { xs: 40, sm: 50, md: 60 },
                  height: { xs: 40, sm: 50, md: 60 },
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                }}
              >
                <StorefrontIcon sx={{ fontSize: { xs: 24, sm: 30, md: 36 } }} />
              </Avatar>
            </motion.div>
            <Box>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b', fontSize: fontSizes.title }}>
                {contactPerson}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: fontSizes.body }}>
                {address}
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={isOverdue ? <WarningIcon /> : null}
            label={status}
            sx={{
              borderRadius: '10px',
              fontWeight: 600,
              bgcolor: isOverdue ? '#fee2e2' : '#d1fae5',
              color: isOverdue ? '#ef4444' : '#10b981',
              fontSize: '0.7rem',
            }}
          />
        </Box>

        <Divider sx={{ my: 2, borderColor: '#e2e8f0' }} />

        {/* Contact and Last Order Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <motion.div custom={0} variants={itemVariants}>
              <Typography variant="h6" fontWeight={600} sx={{ color: '#64748b', mb: 1, fontSize: fontSizes.heading }}>
                פרטי קשר
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ color: '#1e293b', fontSize: fontSizes.body }}>
                  <strong>שם החברה:</strong> {name}
                </Typography>
                <Typography variant="body1" sx={{ color: '#1e293b', fontSize: fontSizes.body }}>
                  <strong>טלפון:</strong> {phone}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <motion.div custom={1} variants={itemVariants}>
              <Typography variant="h6" fontWeight={600} sx={{ color: '#64748b', mb: 1, fontSize: fontSizes.heading }}>
                הזמנה אחרונה
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography variant="body1" sx={{ color: '#1e293b', fontSize: fontSizes.body }}>
                  {lastOrder?.date || 'אין נתונים'}
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight={700} sx={{ color: '#1e293b', fontSize: fontSizes.body }}>
                {safeFormatCurrency(lastOrder?.amount)}
              </Typography>
            </motion.div>
          </Grid>
        </Grid>

        {/* Credit Status Section */}
        <Box sx={{ mt: 4 }}>
          <motion.div custom={2} variants={itemVariants}>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#64748b', mb: 2, fontSize: fontSizes.heading }}>
              מצב אשראי
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: '#1e293b', fontSize: fontSizes.body }}>
                    אובליגו
                  </Typography>
                  <Typography variant="body1" fontWeight={700} sx={{ color: '#1e293b', fontSize: fontSizes.body }}>
                    {safeFormatCurrency(obligo)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: '#1e293b', fontSize: fontSizes.body }}>
                    חוב נוכחי
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    sx={{
                      color: isOverdue ? '#ef4444' : '#1e293b',
                      fontSize: fontSizes.body
                    }}
                  >
                    {safeFormatCurrency(debt)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <ProgressBar>
              <ProgressIndicator
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(obligoUsagePercentage, 100)}%` }}
                bgColor={obligoUsagePercentage >= 80 ? '#ef4444' : '#3b82f6'}
              />
            </ProgressBar>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: fontSizes.caption }}>
                ניצול אובליגו: {obligoUsagePercentage}%
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: fontSizes.caption }}>
                יתרה: {safeFormatCurrency(balance)}
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </StyledCard>
    </motion.div>
  );
};

export default CustomerInfo;