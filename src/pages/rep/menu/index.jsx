import React, { useState, useEffect } from 'react';
import { Container, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../kadabrix/userState';
import kdb from '../../../kadabrix/kadabrix';

import AgentInfo from './AgentInfo';
import CustomerInfo from './CustomerInfo';
import MenuSection from './MenuSection';
import {  Typography } from '@mui/material';

const EnhancedMenu = () => {
  const navigate = useNavigate();
  const userDetails = useUserStore((state) => state.userDetails) ?? { permissions: [] };
  const [agentData, setAgentData] = useState({
    name: '',
    region: '',
    avatar: null,
    performance: {
      currentMonthSales: 0,
      target: 0,
      lastYearSame: 0,
      improvement: 0,
      daysLeft: 0,
    },
    customers: {
      total: 0,
      withDebt: 0,
      totalDebt: 0,
      debtCategories: {
        current: 0,
        days30: 0,
        days60: 0,
        days90: 0,
      },
    },
  });

  const [selectedCustomer, setSelectedCustomer] = useState({
    id: '',
    name: '',
    address: '',
    contactPerson: '',
    phone: '',
    debt: 0,
    obligo: 0,
    status: '',
    lastOrder: {
      date: '',
      amount: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await kdb.run({
          module: 'repMenu',
          name: 'dashboardData',
          data: {},
        });

        setAgentData((prev) => ({
          ...prev,
          ...data?.agentData,
        }));

        setSelectedCustomer((prev) => ({
          ...prev,
          ...data?.customerData,
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(amount ?? 0);
  };

  const performancePercentage = Math.round(
    ((agentData?.performance?.currentMonthSales ?? 0) / (agentData?.performance?.target || 1)) * 100
  ) || 0;

  const obligoUsagePercentage = Math.round(
    ((selectedCustomer?.debt ?? 0) / (selectedCustomer?.obligo || 1)) * 100
  ) || 0;

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">טוען...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

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
        
        <Grid
          container
          spacing={3}
          sx={{
            width: '100%',
            maxWidth: '1200px',
            mb: { xs: 2, md: 4 },
            px: { xs: 0, md: 2 },
          }}
        >
          <Grid item xs={12} md={6}>
            <AgentInfo
              agentData={agentData}
              performancePercentage={performancePercentage}
              formatCurrency={formatCurrency}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomerInfo
              selectedCustomer={selectedCustomer}
              obligoUsagePercentage={obligoUsagePercentage}
              formatCurrency={formatCurrency}
            />
          </Grid>
        </Grid>
        <MenuSection userDetails={userDetails} navigate={navigate} />
      </Box>
    </Container>
  );
};

export default EnhancedMenu;