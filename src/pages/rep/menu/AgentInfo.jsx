import React from 'react';
import { Box, Typography, Avatar, Chip, Divider, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Paper)(({ theme }) => ({
  borderRadius: '20px',
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

const ProgressBar = styled(Box)(({ theme }) => ({
  height: '10px',
  borderRadius: '5px',
  background: '#e0e7ff',
  position: 'relative',
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  overflow: 'hidden',
}));

const ProgressIndicator = styled(motion.div)(({ bgColor }) => ({
  height: '100%',
  borderRadius: '5px',
  background: bgColor || '#3b82f6',
  transition: 'width 0.6s ease-in-out',
}));

const DebtBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'transform 0.3s ease, background 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    background: 'rgba(255, 255, 255, 0.9)',
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(1.5),
  },
}));

const AgentInfo = ({ agentData, performancePercentage, formatCurrency }) => {
  // Safeguard for formatCurrency
  const safeFormatCurrency = typeof formatCurrency === 'function' ? formatCurrency : (amount) => `₪${amount ?? 0}`;

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

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <StyledCard dir="rtl">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar
              sx={{
                bgcolor: '#3b82f6',
                mr: 2,
                width: { xs: 40, sm: 50, md: 60 },
                height: { xs: 40, sm: 50, md: 60 },
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              }}
            >
              {agentData?.avatar ? (
                <img src={agentData.avatar} alt={agentData?.name || 'Agent'} />
              ) : (
                <AccountCircleIcon sx={{ fontSize: { xs: 24, sm: 30, md: 36 } }} />
              )}
            </Avatar>
          </motion.div>
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                color: '#1e293b',
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              }}
            >
              {agentData?.name || 'לא זמין'}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}
            >
              אזור {agentData?.region || 'לא זמין'} | נותרו{' '}
              {agentData?.performance?.daysLeft ?? 0} ימים בחודש
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#e2e8f0' }} />

        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <motion.div custom={0} variants={itemVariants}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ color: '#64748b', display: 'flex', alignItems: 'center' }}
              >
                <TrendingUpIcon sx={{ mr: 0.5, color: '#10b981' }} />
                ביצועי חודש
              </Typography>
            </motion.div>
            <motion.div custom={1} variants={itemVariants}>
              <Chip
                size="small"
                icon={<TrendingUpIcon />}
                label={`+${agentData?.performance?.improvement ?? 0}% משנה שעברה`}
                color="success"
                sx={{
                  borderRadius: '10px',
                  fontWeight: 600,
                  bgcolor: '#d1fae5',
                  color: '#10b981',
                }}
              />
            </motion.div>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <motion.div custom={2} variants={itemVariants}>
              <Typography variant="body1" sx={{ color: '#1e293b' }}>
                {safeFormatCurrency(agentData?.performance?.currentMonthSales)}
              </Typography>
            </motion.div>
            <motion.div custom={3} variants={itemVariants}>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                מתוך {safeFormatCurrency(agentData?.performance?.target)}
              </Typography>
            </motion.div>
          </Box>

          <ProgressBar>
            <ProgressIndicator
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(performancePercentage, 100)}%` }}
              bgColor={
                performancePercentage >= 90
                  ? '#10b981'
                  : performancePercentage >= 70
                  ? '#3b82f6'
                  : performancePercentage >= 50
                  ? '#f59e0b'
                  : '#ef4444'
              }
            />
          </ProgressBar>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 3,
              mb: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <motion.div custom={4} variants={itemVariants}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ color: '#64748b', display: 'flex', alignItems: 'center' }}
              >
                <LocalAtmIcon sx={{ mr: 0.5, color: '#f59e0b' }} />
                חובות לקוחות
              </Typography>
            </motion.div>
            <motion.div custom={5} variants={itemVariants}>
              <Chip
                size="small"
                label={`${agentData?.customers?.withDebt ?? 0} לקוחות`}
                color="warning"
                sx={{
                  borderRadius: '10px',
                  fontWeight: 600,
                  bgcolor: '#fef3c7',
                  color: '#f59e0b',
                }}
              />
            </motion.div>
          </Box>

          <Grid
            container
            spacing={{ xs: 1.5, md: 1 }}
            sx={{
              mt: 2,
              '& > *': {
                flexGrow: 1,
              },
            }}
          >
            {[
              { label: 'שוטף', value: agentData?.customers?.debtCategories?.current, bgColor: '#e0f2fe', textColor: '#3b82f6' },
              { label: '30+ יום', value: agentData?.customers?.debtCategories?.days30, bgColor: '#fef3c7', textColor: '#f59e0b' },
              { label: '60+ יום', value: agentData?.customers?.debtCategories?.days60, bgColor: '#fee2e2', textColor: '#ef4444' },
              { label: '90+ יום', value: agentData?.customers?.debtCategories?.days90, bgColor: '#fee2e2', textColor: '#dc2626' },
            ].map((debt, index) => (
              <Grid item xs={12} md={3} key={index}>
                <motion.div
                  custom={6 + index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                >
                  <DebtBox sx={{ bgcolor: debt.bgColor }}>
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748b', fontWeight: 500, textTransform: 'uppercase' }}
                    >
                      {debt.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{ color: debt.textColor }}
                    >
                      {safeFormatCurrency(debt.value).replace('₪', '')}
                    </Typography>
                  </DebtBox>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </StyledCard>
    </motion.div>
  );
};

export default AgentInfo;