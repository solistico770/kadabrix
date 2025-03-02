// Part 1: UI Components and Styled Components
// =============================================
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import {
  Box,
  Chip,
  Typography,
  Button,
  Switch,
  IconButton,
  TextField,
  Dialog,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Avatar,
  Menu,
  MenuItem,
  InputAdornment,
  Badge,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  FormControlLabel,
  Drawer,
  Skeleton,
  Collapse,
  TablePagination,
  ButtonGroup
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SortIcon from '@mui/icons-material/Sort';
import FieldsIcon from '@mui/icons-material/ViewColumn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { debounce } from 'lodash';

// Styled components for enhanced UI
const StyledSearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    boxShadow: theme.shadows[2]
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
    flexGrow: 1
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary
}));

const StyledInputBase = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%'
  },
  width: '100%'
}));

const CollectionCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}));

const StatusBadge = styled(Chip)(({ theme, active }) => ({
  backgroundColor: active 
    ? alpha(theme.palette.success.main, 0.1)
    : alpha(theme.palette.error.main, 0.1),
  color: active ? theme.palette.success.main : theme.palette.error.main,
  fontWeight: 'bold',
  '& .MuiChip-icon': {
    color: 'inherit'
  }
}));

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    background: alpha(theme.palette.primary.main, 0.1)
  }
}));

const CollectionAvatar = styled(Avatar)(({ theme, active }) => ({
  backgroundColor: active 
    ? alpha(theme.palette.primary.main, 0.8)
    : alpha(theme.palette.grey[500], 0.8),
  color: theme.palette.common.white,
  width: 56,
  height: 56,
  marginRight: theme.spacing(2),
  boxShadow: theme.shadows[2]
}));

const FieldItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  marginBottom: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: 'translateX(4px)'
  }
}));

// Common layout components
const SectionTitle = ({ title, subtitle, action }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight="bold">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
        )}
      </Box>
      {action}
    </Box>
  );
};

// Empty state components
const EmptyState = ({ isFiltered, onClearFilters, onCreateNew }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: (theme) => `1px dashed ${theme.palette.divider}`,
        borderRadius: 2,
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.5)
      }}
    >
      {isFiltered ? (
        <>
          <SearchIcon sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No matching collections found
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3, maxWidth: 500 }}>
            Try adjusting your search or filters to find what you're looking for
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<CancelIcon />} 
            onClick={onClearFilters}
          >
            Clear All Filters
          </Button>
        </>
      ) : (
        <>
          <ViewListIcon sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No collections available
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3, maxWidth: 500 }}>
            Get started by creating your first collection
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />} 
            onClick={onCreateNew}
          >
            Create New Collection
          </Button>
        </>
      )}
    </Paper>
  );
};

// Part 2: Forms and Field Components
// =============================================

// Collection Form Component
const CollectionForm = ({ data, onChange, errors }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSwitchChange = (field) => (e) => {
    onChange(field, e.target.checked ? '1' : '0');
  };

  const handleTextChange = (field) => (e) => {
    onChange(field, e.target.value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Collection Name"
          value={data?.collectionname || ''}
          onChange={handleTextChange('collectionname')}
          fullWidth
          variant="outlined"
          required
          error={!!errors?.collectionname}
          helperText={errors?.collectionname}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ViewListIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            label="Priority" 
            icon={
              <Badge 
                color="primary" 
                variant="dot" 
                invisible={data?.priority_active !== '1'}
              >
                <LightbulbIcon />
              </Badge>
            } 
            iconPosition="start" 
          />
          <Tab 
            label="Priority ORA" 
            icon={
              <Badge 
                color="secondary" 
                variant="dot" 
                invisible={data?.priorityora_active !== '1'}
              >
                <LightbulbIcon />
              </Badge>
            } 
            iconPosition="start" 
          />
          <Tab 
            label="Hash" 
            icon={
              <Badge 
                color="info" 
                variant="dot" 
                invisible={data?.hash_active !== '1'}
              >
                <LightbulbIcon />
              </Badge>
            } 
            iconPosition="start" 
          />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="medium">Priority Settings</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={data?.priority_active === '1'}
                  onChange={handleSwitchChange('priority_active')}
                  color="primary"
                />
              }
              label={data?.priority_active === '1' ? "Active" : "Inactive"}
            />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                label="Type"
                value={data?.priority_type || ''}
                onChange={handleTextChange('priority_type')}
                fullWidth
                size="small"
                error={!!errors?.priority_type}
                helperText={errors?.priority_type}
                disabled={data?.priority_active !== '1'}
                inputProps={{ maxLength: 5 }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <TextField
                label="Meta"
                value={data?.priority_meta || ''}
                onChange={handleTextChange('priority_meta')}
                fullWidth
                size="small"
                disabled={data?.priority_active !== '1'}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <TextField
            label="Query"
            value={data?.priority_query || ''}
            onChange={handleTextChange('priority_query')}
            fullWidth
            multiline
            rows={4}
            disabled={data?.priority_active !== '1'}
          />
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.secondary.main, 0.05), borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="medium">Priority ORA Settings</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={data?.priorityora_active === '1'}
                  onChange={handleSwitchChange('priorityora_active')}
                  color="secondary"
                />
              }
              label={data?.priorityora_active === '1' ? "Active" : "Inactive"}
            />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                label="Type"
                value={data?.priorityora_type || ''}
                onChange={handleTextChange('priorityora_type')}
                fullWidth
                size="small"
                error={!!errors?.priorityora_type}
                helperText={errors?.priorityora_type}
                disabled={data?.priorityora_active !== '1'}
                inputProps={{ maxLength: 5 }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <TextField
                label="Meta"
                value={data?.priorityora_meta || ''}
                onChange={handleTextChange('priorityora_meta')}
                fullWidth
                size="small"
                disabled={data?.priorityora_active !== '1'}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <TextField
            label="Query"
            value={data?.priorityora_query || ''}
            onChange={handleTextChange('priorityora_query')}
            fullWidth
            multiline
            rows={4}
            disabled={data?.priorityora_active !== '1'}
          />
        </Box>
      )}

      {activeTab === 2 && (
        <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.info.main, 0.05), borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="medium">Hash Settings</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={data?.hash_active === '1'}
                  onChange={handleSwitchChange('hash_active')}
                  color="info"
                />
              }
              label={data?.hash_active === '1' ? "Active" : "Inactive"}
            />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                label="Type"
                value={data?.hash_type || ''}
                onChange={handleTextChange('hash_type')}
                fullWidth
                size="small"
                error={!!errors?.hash_type}
                helperText={errors?.hash_type}
                disabled={data?.hash_active !== '1'}
                inputProps={{ maxLength: 5 }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <TextField
                label="Meta"
                value={data?.hash_meta || ''}
                onChange={handleTextChange('hash_meta')}
                fullWidth
                size="small"
                disabled={data?.hash_active !== '1'}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <TextField
            label="Query"
            value={data?.hash_query || ''}
            onChange={handleTextChange('hash_query')}
            fullWidth
            multiline
            rows={4}
            disabled={data?.hash_active !== '1'}
          />
        </Box>
      )}
    </Box>
  );
};

// Field Form Component
const FieldForm = ({ data, onChange, collectionName }) => {
  const handleTextChange = (field) => (e) => {
    onChange(field, e.target.value);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          label="Field Name"
          value={data?.fieldname || ''}
          onChange={handleTextChange('fieldname')}
          fullWidth
          required
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Description"
          value={data?.descr || ''}
          onChange={handleTextChange('descr')}
          fullWidth
          variant="outlined"
        />
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
          Priority Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Priority Source"
          value={data?.priority_src || ''}
          onChange={handleTextChange('priority_src')}
          fullWidth
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Priority Meta"
          value={data?.priority_meta || ''}
          onChange={handleTextChange('priority_meta')}
          fullWidth
          variant="outlined"
        />
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
          ORA Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="ORA Source"
          value={data?.priorityora_src || ''}
          onChange={handleTextChange('priorityora_src')}
          fullWidth
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="ORA Meta"
          value={data?.priorityora_meta || ''}
          onChange={handleTextChange('priorityora_meta')}
          fullWidth
          variant="outlined"
        />
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
          Hash Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Hash Source"
          value={data?.hash_src || ''}
          onChange={handleTextChange('hash_src')}
          fullWidth
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Hash Meta"
          value={data?.hash_meta || ''}
          onChange={handleTextChange('hash_meta')}
          fullWidth
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
};

// Collection Card Component
const CollectionCardItem = ({ collection, onEdit, onViewFields, onOpenMenu }) => {
  return (
    <CollectionCard elevation={2}>
      <CardHeader
        avatar={
          <CollectionAvatar 
            active={
              collection.priority_active === '1' ||
              collection.priorityora_active === '1' ||
              collection.hash_active === '1'
            }
          >
            {collection.collectionname.charAt(0).toUpperCase()}
          </CollectionAvatar>
        }
        title={
          <Typography variant="h6" noWrap title={collection.collectionname}>
            {collection.collectionname}
          </Typography>
        }
        action={
          <IconButton 
            aria-label="more options"
            onClick={(e) => onOpenMenu(e, collection)}
          >
            <MoreVertIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Tooltip title="Priority">
              <StatusBadge
                label={collection.priority_type || "Priority"}
                active={collection.priority_active === '1'}
                icon={collection.priority_active === '1' ? <CheckCircleIcon /> : <CancelIcon />}
                size="small"
                variant="outlined"
              />
            </Tooltip>
          </Grid>
          <Grid item xs={4}>
            <Tooltip title="Priority ORA">
              <StatusBadge
                label={collection.priorityora_type || "ORA"}
                active={collection.priorityora_active === '1'}
                icon={collection.priorityora_active === '1' ? <CheckCircleIcon /> : <CancelIcon />}
                size="small"
                variant="outlined"
              />
            </Tooltip>
          </Grid>
          <Grid item xs={4}>
            <Tooltip title="Hash">
              <StatusBadge
                label={collection.hash_type || "Hash"}
                active={collection.hash_active === '1'}
                icon={collection.hash_active === '1' ? <CheckCircleIcon /> : <CancelIcon />}
                size="small"
                variant="outlined"
              />
            </Tooltip>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            size="small"
            startIcon={<FieldsIcon />}
            onClick={() => onViewFields(collection.collectionname)}
            sx={{ textTransform: 'none' }}
          >
            View Fields
          </Button>
        </Box>
      </CardContent>
    </CollectionCard>
  );
};

// Collection List Item Component
const CollectionListItem = ({ collection, index, total, onEdit, onViewFields, onOpenMenu }) => {
  const theme = useTheme();
  
  return (
    <React.Fragment>
      {index > 0 && <Divider />}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.05)
          }
        }}
      >
        <CollectionAvatar 
          active={
            collection.priority_active === '1' ||
            collection.priorityora_active === '1' ||
            collection.hash_active === '1'
          }
        >
          {collection.collectionname.charAt(0).toUpperCase()}
        </CollectionAvatar>
        
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            {collection.collectionname}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            <Tooltip title="Priority">
              <StatusBadge
                label={collection.priority_type || "Priority"}
                active={collection.priority_active === '1'}
                icon={collection.priority_active === '1' ? <CheckCircleIcon /> : <CancelIcon />}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Priority ORA">
              <StatusBadge
                label={collection.priorityora_type || "ORA"}
                active={collection.priorityora_active === '1'}
                icon={collection.priorityora_active === '1' ? <CheckCircleIcon /> : <CancelIcon />}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Hash">
              <StatusBadge
                label={collection.hash_type || "Hash"}
                active={collection.hash_active === '1'}
                icon={collection.hash_active === '1' ? <CheckCircleIcon /> : <CancelIcon />}
                size="small"
              />
            </Tooltip>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            size="small"
            startIcon={<FieldsIcon />}
            variant="outlined"
            onClick={() => onViewFields(collection.collectionname)}
            sx={{ mr: 1 }}
          >
            Fields
          </Button>
          <AnimatedIconButton 
            color="primary" 
            onClick={() => onEdit(collection)}
          >
            <EditIcon />
          </AnimatedIconButton>
          <IconButton
            onClick={(e) => onOpenMenu(e, collection)}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>
    </React.Fragment>
  );
};

// Field List Item Component
const FieldListItem = ({ field, expandedField, onExpand, onEdit, onDelete }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={1}
      sx={{
        mb: 2,
        borderRadius: 1,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[2]
        }
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          bgcolor: expandedField === field.id ? alpha(theme.palette.primary.main, 0.05) : 'background.paper'
        }}
        onClick={() => onExpand(field)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FieldsIcon color="primary" sx={{ mr: 1.5, opacity: 0.7 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              {field.fieldname}
            </Typography>
            {field.descr && (
              <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                {field.descr}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(field, e);
            }}
            sx={{ mr: 0.5 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(field.id, e);
            }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton size="small" onClick={() => onExpand(field)}>
            {expandedField === field.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expandedField === field.id}>
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.background.default, 0.5)
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Priority Source
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {field.priority_src || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Priority Meta
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {field.priority_meta || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                ORA Source
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {field.priorityora_src || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                ORA Meta
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {field.priorityora_meta || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Hash Source
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {field.hash_src || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Hash Meta
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {field.hash_meta || '-'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};


// Part 3: Dialog and Drawer Components
// =============================================

// Add Collection Dialog
const AddCollectionDialog = ({ open, onClose, onCreated }) => {
  const [collectionData, setCollectionData] = useState({
    collectionname: '',
    priority_active: '0',
    priority_type: '',
    priority_meta: '',
    priority_query: '',
    priorityora_active: '0',
    priorityora_type: '',
    priorityora_meta: '',
    priorityora_query: '',
    hash_active: '0',
    hash_type: '',
    hash_meta: '',
    hash_query: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setCollectionData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!collectionData.collectionname.trim()) {
      newErrors.collectionname = 'Collection name is required';
    }
    if (collectionData.priority_type && collectionData.priority_type.length > 5) {
      newErrors.priority_type = 'Maximum 5 characters allowed';
    }
    if (collectionData.priorityora_type && collectionData.priorityora_type.length > 5) {
      newErrors.priorityora_type = 'Maximum 5 characters allowed';
    }
    if (collectionData.hash_type && collectionData.hash_type.length > 5) {
      newErrors.hash_type = 'Maximum 5 characters allowed';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await kdb.run({
        module: 'etlEditor',
        name: 'createCollection',
        data: collectionData
      });
      setLoading(false);
      onClose();
      onCreated();
    } catch (error) {
      console.error('Error creating collection:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setCollectionData({
        collectionname: '',
        priority_active: '0',
        priority_type: '',
        priority_meta: '',
        priority_query: '',
        priorityora_active: '0',
        priorityora_type: '',
        priorityora_meta: '',
        priorityora_query: '',
        hash_active: '0',
        hash_type: '',
        hash_meta: '',
        hash_query: ''
      });
      setErrors({});
    }
  }, [open]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2,
        background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: 'white'
      }}>
        <AddIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Create New Collection</Typography>
      </Box>
      
      <Box sx={{ p: 3 }}>
        <CollectionForm 
          data={collectionData} 
          onChange={handleChange} 
          errors={errors} 
        />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, bgcolor: 'background.default' }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
        >
          {loading ? 'Creating...' : 'Create Collection'}
        </Button>
      </Box>
    </Dialog>
  );
};

// Edit Collection Dialog
const EditCollectionDialog = ({
  open,
  onClose,
  collection,
  onChange,
  onSave,
  errors,
  loading
}) => {
  if (!collection) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2,
        background: (theme) => `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
        color: 'white'
      }}>
        <EditIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Edit Collection: {collection.collectionname}</Typography>
      </Box>
      
      <Box sx={{ p: 3 }}>
        <CollectionForm 
          data={collection} 
          onChange={onChange} 
          errors={errors} 
        />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, bgcolor: 'background.default' }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onSave}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Dialog>
  );
};

// Add Field Dialog
const AddFieldDialog = ({
  open,
  onClose,
  collectionName,
  onFieldCreated
}) => {
  const [fieldData, setFieldData] = useState({
    descr: '',
    fieldname: '',
    collectionname: collectionName,
    isindex: '0',
    priority_src: '',
    priority_meta: '',
    priorityora_src: '',
    priorityora_meta: '',
    hash_src: '',
    hash_meta: '',
    issIndex: '0'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFieldData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const validateField = () => {
    if (!fieldData.fieldname.trim()) {
      setError('Field name is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSave = async () => {
    if (!validateField()) return;
    
    try {
      setLoading(true);
      await kdb.run({
        module: 'etlEditor',
        name: 'createCollectionField',
        data: fieldData
      });
      setLoading(false);
      onClose();
      onFieldCreated();
    } catch (error) {
      console.error('Error creating field:', error);
      setError('Failed to create field. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setFieldData({
        descr: '',
        fieldname: '',
        collectionname: collectionName,
        isindex: '0',
        priority_src: '',
        priority_meta: '',
        priorityora_src: '',
        priorityora_meta: '',
        hash_src: '',
        hash_meta: '',
        issIndex: '0'
      });
      setError('');
    } else {
      setFieldData((prev) => ({
        ...prev,
        collectionname: collectionName
      }));
    }
  }, [open, collectionName]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2,
        background: (theme) => `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
        color: 'white'
      }}>
        <AddIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Add Field to Collection: {collectionName}</Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ p: 3 }}>
        <FieldForm 
          data={fieldData} 
          onChange={handleChange} 
          collectionName={collectionName}
        />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, bgcolor: 'background.default' }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={handleSave}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
        >
          {loading ? 'Creating...' : 'Add Field'}
        </Button>
      </Box>
    </Dialog>
  );
};

// Fields Drawer Component
const FieldsDrawer = ({
  open,
  onClose,
  collectionName
}) => {
  const theme = useTheme();
  const [fields, setFields] = useState([]);
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [fieldsSearchTerm, setFieldsSearchTerm] = useState('');
  const [filteredFields, setFilteredFields] = useState([]);
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [isUpdatingField, setIsUpdatingField] = useState(false);
  const [addFieldDialogOpen, setAddFieldDialogOpen] = useState(false);
  const [expandedField, setExpandedField] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchFields = useCallback(async () => {
    if (!collectionName) return;
    setFieldsLoading(true);
    try {
      const response = await kdb.run({
        module: 'etlEditor',
        name: 'getCollectionFieldsByName',
        data: { collectionname: collectionName }
      });
      setFields(response.fields || []);
      setFieldsLoading(false);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setFieldsLoading(false);
      setSnackbar({
        open: true,
        message: 'Failed to load fields',
        severity: 'error'
      });
    }
  }, [collectionName]);

  useEffect(() => {
    if (open) {
      fetchFields();
      setFieldsSearchTerm('');
      setFilteredFields([]);
    }
  }, [open, fetchFields]);

  const handleFieldsSearch = useCallback((term, data) => {
    let result = data;
    const lowerTerm = term.toLowerCase();
    if (term.trim()) {
      result = data.filter((field) => {
        return (
          (field.fieldname && field.fieldname.toLowerCase().includes(lowerTerm)) ||
          (field.descr && field.descr.toLowerCase().includes(lowerTerm))
        );
      });
    }
    return result;
  }, []);

  const debouncedFieldSearch = useMemo(
    () =>
      debounce((val, data) => {
        const res = handleFieldsSearch(val, data);
        setFilteredFields(res);
      }, 300),
    [handleFieldsSearch]
  );

  useEffect(() => {
    if (fields.length === 0) return;
    debouncedFieldSearch(fieldsSearchTerm, fields);
  }, [fieldsSearchTerm, fields, debouncedFieldSearch]);

  const handleEditField = (field, event) => {
    event.stopPropagation();
    setCurrentField({ ...field });
    setEditFieldDialogOpen(true);
  };

  const handleDeleteField = async (fieldId, event) => {
    event.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this field?')) return;
    try {
      setFieldsLoading(true);
      await kdb.run({
        module: 'etlEditor',
        name: 'deleteCollectionField',
        data: { id: fieldId }
      });
      setSnackbar({
        open: true,
        message: 'Field deleted successfully',
        severity: 'success'
      });
      await fetchFields();
    } catch (error) {
      console.error('Error deleting field:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete field',
        severity: 'error'
      });
    } finally {
      setFieldsLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setCurrentField((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveField = async () => {
    if (!currentField || !currentField.fieldname.trim()) {
      setSnackbar({
        open: true,
        message: 'Field name cannot be empty',
        severity: 'error'
      });
      return;
    }
    
    setIsUpdatingField(true);
    try {
      await kdb.run({
        module: 'etlEditor',
        name: 'updateCollectionField',
        data: currentField
      });
      setIsUpdatingField(false);
      setEditFieldDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Field updated successfully',
        severity: 'success'
      });
      await fetchFields();
    } catch (error) {
      console.error('Error updating field:', error);
      setIsUpdatingField(false);
      setSnackbar({
        open: true,
        message: 'Failed to update field',
        severity: 'error'
      });
    }
  };

  const handleFieldCreated = async () => {
    setAddFieldDialogOpen(false);
    setSnackbar({
      open: true,
      message: 'Field created successfully',
      severity: 'success'
    });
    await fetchFields();
  };

  const handleViewFieldDetails = (field) => {
    setExpandedField(expandedField === field.id ? null : field.id);
  };

  const displayedFields = fieldsSearchTerm.trim() === '' ? fields : filteredFields;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 600 }, maxWidth: '100%' }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          sx={{
            p: 2,
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={onClose} edge="start">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1 }}>
              Fields for {collectionName}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setAddFieldDialogOpen(true)}
            size="small"
          >
            Add Field
          </Button>
        </Box>

        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <TextField
            placeholder="Search fields..."
            fullWidth
            value={fieldsSearchTerm}
            onChange={(e) => setFieldsSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: fieldsSearchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={() => setFieldsSearchTerm('')}
                    edge="end"
                    size="small"
                  >
                    <CancelIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {fieldsLoading ? (
            <Box sx={{ p: 2 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  height={60}
                  sx={{ mb: 1, borderRadius: 1 }}
                />
              ))}
            </Box>
          ) : displayedFields.length === 0 ? (
            <Box
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'text.secondary'
              }}
            >
              {fieldsSearchTerm ? (
                <>
                  <SearchIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6">No matching fields found</Typography>
                  <Typography variant="body2">
                    Try a different search term or clear the search
                  </Typography>
                </>
              ) : (
                <>
                  <FieldsIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6">No fields available</Typography>
                  <Typography variant="body2">
                    Add fields to this collection to get started
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setAddFieldDialogOpen(true)}
                    sx={{ mt: 2 }}
                  >
                    Add First Field
                  </Button>
                </>
              )}
            </Box>
          ) : (
            <Box sx={{ mb: 2 }}>
              {displayedFields.map((field) => (
                <FieldListItem 
                  key={field.id}
                  field={field}
                  expandedField={expandedField}
                  onExpand={handleViewFieldDetails}
                  onEdit={handleEditField}
                  onDelete={handleDeleteField}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <Dialog
        open={editFieldDialogOpen}
        onClose={() => setEditFieldDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2,
          background: (theme) => `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
          color: 'white'
        }}>
          <EditIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Edit Field: {currentField?.fieldname}</Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {currentField && (
            <FieldForm 
              data={currentField} 
              onChange={handleFieldChange} 
              collectionName={collectionName}
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, bgcolor: 'background.default' }}>
          <Button 
            onClick={() => setEditFieldDialogOpen(false)} 
            disabled={isUpdatingField}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveField}
            disabled={isUpdatingField}
            startIcon={isUpdatingField ? <CircularProgress size={20} /> : <CheckCircleIcon />}
          >
            {isUpdatingField ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Dialog>

      <AddFieldDialog
        open={addFieldDialogOpen}
        onClose={() => setAddFieldDialogOpen(false)}
        collectionName={collectionName}
        onFieldCreated={handleFieldCreated}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Drawer>
  );
};


// Part 4: Main Component
// =============================================

const CollectionsManager = () => {
  const theme = useTheme();
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCollection, setCurrentCollection] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [fieldsDrawerOpen, setFieldsDrawerOpen] = useState(false);
  const [selectedCollectionName, setSelectedCollectionName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Filter states
  const [onlyActivePrio, setOnlyActivePrio] = useState(false);
  const [onlyActivePrioOra, setOnlyActivePrioOra] = useState(false);
  const [onlyActiveHash, setOnlyActiveHash] = useState(false);
  
  // Fetch collections
  const fetchCollections = useCallback(async () => {
    try {
      setTableLoading(true);
      const response = await kdb.run({
        module: 'etlEditor',
        name: 'getCollections',
        data: {}
      });
      setCollections(response.collections || []);
      setTableLoading(false);
    } catch (error) {
      console.error('Error fetching collections:', error);
      setTableLoading(false);
      setSnackbar({
        open: true,
        message: 'Error loading collections',
        severity: 'error'
      });
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // Filtering and search
  const handleFilter = useCallback(
    (term, data) => {
      let filtered = [...data];
      
      // Text search
      if (term.trim()) {
        const lowerTerm = term.toLowerCase();
        filtered = filtered.filter((c) =>
          (c.collectionname && c.collectionname.toLowerCase().includes(lowerTerm))
        );
      }
      
      // Active filters
      if (onlyActivePrio) {
        filtered = filtered.filter((c) => c.priority_active === '1');
      }
      if (onlyActivePrioOra) {
        filtered = filtered.filter((c) => c.priorityora_active === '1');
      }
      if (onlyActiveHash) {
        filtered = filtered.filter((c) => c.hash_active === '1');
      }
      
      return filtered;
    },
    [onlyActivePrio, onlyActivePrioOra, onlyActiveHash]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((val, data) => {
        const filtered = handleFilter(val, data);
        setFilteredCollections(filtered);
        setPage(0);
      }, 300),
    [handleFilter]
  );

  useEffect(() => {
    if (collections.length > 0) {
      debouncedSearch(searchTerm, collections);
    } else {
      setFilteredCollections([]);
    }
    
    // Update filter active indicator
    setFilterActive(onlyActivePrio || onlyActivePrioOra || onlyActiveHash);
  }, [
    searchTerm, 
    collections, 
    onlyActivePrio, 
    onlyActivePrioOra, 
    onlyActiveHash, 
    debouncedSearch
  ]);

  // Collection CRUD operations
  const handleViewFields = (collectionName) => {
    setSelectedCollectionName(collectionName);
    setFieldsDrawerOpen(true);
  };

  const validateForm = useCallback((data) => {
    const newErrors = {};
    if (!data.collectionname || !data.collectionname.trim()) {
      newErrors.collectionname = 'Collection name is required';
    }
    if (data.priority_type && data.priority_type.length > 5) {
      newErrors.priority_type = 'Maximum 5 characters allowed';
    }
    if (data.priorityora_type && data.priorityora_type.length > 5) {
      newErrors.priorityora_type = 'Maximum 5 characters allowed';
    }
    if (data.hash_type && data.hash_type.length > 5) {
      newErrors.hash_type = 'Maximum 5 characters allowed';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleEditCollection = (collection) => {
    setCurrentCollection({ ...collection });
    setEditDialogOpen(true);
  };

  const handleSaveCollection = async () => {
    if (!currentCollection) return;
    
    const isValid = validateForm(currentCollection);
    if (!isValid) return;
    
    try {
      setIsLoading(true);
      await kdb.run({
        module: 'etlEditor',
        name: 'setCollection',
        data: currentCollection
      });
      setIsLoading(false);
      setEditDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Collection updated successfully',
        severity: 'success'
      });
      fetchCollections();
    } catch (error) {
      console.error('Error updating collection:', error);
      setIsLoading(false);
      setSnackbar({
        open: true,
        message: 'Failed to update collection',
        severity: 'error'
      });
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;
    
    try {
      setTableLoading(true);
      await kdb.run({
        module: 'etlEditor',
        name: 'deleteCollection',
        data: { id }
      });
      setSnackbar({
        open: true,
        message: 'Collection deleted successfully',
        severity: 'success'
      });
      await fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete collection',
        severity: 'error'
      });
    } finally {
      setTableLoading(false);
    }
  };

  const handleDuplicateCollection = async (collection) => {
    try {
      setIsLoading(true);
      const newCollectionData = {
        ...collection,
        collectionname: `${collection.collectionname}_copy`
      };
      delete newCollectionData.id;

      await kdb.run({
        module: 'etlEditor',
        name: 'createCollection',
        data: newCollectionData
      });
      
      setSnackbar({
        open: true,
        message: 'Collection duplicated successfully',
        severity: 'success'
      });
      setIsLoading(false);
      fetchCollections();
    } catch (error) {
      console.error('Error duplicating collection:', error);
      setIsLoading(false);
      setSnackbar({
        open: true,
        message: 'Failed to duplicate collection',
        severity: 'error'
      });
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentCollection((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCollectionCreated = async () => {
    await fetchCollections();
    setAddDialogOpen(false);
    setSnackbar({
      open: true,
      message: 'Collection created successfully',
      severity: 'success'
    });
  };

  // Context menu
  const handleOpenMenu = (event, collection) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCollection(collection);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedCollection(null);
  };

  // Filter menu
  const handleOpenFilterMenu = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };

  const handleClearFilters = () => {
    setOnlyActivePrio(false);
    setOnlyActivePrioOra(false);
    setOnlyActiveHash(false);
    setSearchTerm('');
    handleCloseFilterMenu();
  };

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get paginated data
  const paginatedData = useMemo(() => {
    const dataToUse = filteredCollections.length > 0 ? filteredCollections : collections;
    return dataToUse.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredCollections, collections, page, rowsPerPage]);

  // Render collection items based on view mode
  const renderCollections = () => {
    if (tableLoading) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading collections...
          </Typography>
        </Box>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <EmptyState 
          isFiltered={searchTerm || filterActive}
          onClearFilters={handleClearFilters}
          onCreateNew={() => setAddDialogOpen(true)}
        />
      );
    }

    if (viewMode === 'grid') {
      return (
        <Grid container spacing={2}>
          {paginatedData.map((collection) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={collection.id}>
              <CollectionCardItem 
                collection={collection}
                onEdit={handleEditCollection}
                onViewFields={handleViewFields}
                onOpenMenu={handleOpenMenu}
              />
            </Grid>
          ))}
        </Grid>
      );
    } else {
      return (
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {paginatedData.map((collection, index) => (
            <CollectionListItem 
              key={collection.id}
              collection={collection}
              index={index}
              total={paginatedData.length}
              onEdit={handleEditCollection}
              onViewFields={handleViewFields}
              onOpenMenu={handleOpenMenu}
            />
          ))}
        </Paper>
      );
    }
  };

  return (
    <Box 
      sx={{ 
        p: { xs: 2, md: 3 }, 
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh'
      }}
    >
      {/* Header with search and actions */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: { xs: 1, sm: 0 }, flexGrow: 0 }}>
            Collections Manager
          </Typography>
          
          <Box sx={{ display: 'flex', ml: { xs: 0, sm: 'auto' }, width: { xs: '100%', sm: 'auto' } }}>
            <Button 
              variant="outlined"
              color={filterActive ? "primary" : "inherit"}
              startIcon={<FilterListIcon />}
              onClick={handleOpenFilterMenu}
              sx={{ mr: 1 }}
            >
              {filterActive ? "Filters On" : "Filters"}
            </Button>
            
            <ButtonGroup variant="outlined" sx={{ mr: 1 }}>
              <Button 
                color={viewMode === 'grid' ? 'primary' : 'inherit'}
                onClick={() => setViewMode('grid')}
              >
                <ViewModuleIcon />
              </Button>
              <Button 
                color={viewMode === 'list' ? 'primary' : 'inherit'}
                onClick={() => setViewMode('list')}
              >
                <ViewListIcon />
              </Button>
            </ButtonGroup>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
            >
              New Collection
            </Button>
          </Box>
        </Box>
        
        <StyledSearchBar>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="standard"
            fullWidth
            InputProps={{
              disableUnderline: true,
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm('')}
                  >
                    <CancelIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </StyledSearchBar>
      </Paper>
      
      {/* Collections display */}
      {renderCollections()}
      
      {/* Pagination */}
      {paginatedData.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <TablePagination
            component="div"
            count={filteredCollections.length || collections.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[12, 24, 36, 48]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
      
      {/* Dialogs and menus */}
      <AddCollectionDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onCreated={handleCollectionCreated}
      />

      <EditCollectionDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        collection={currentCollection}
        onChange={handleInputChange}
        onSave={handleSaveCollection}
        errors={errors}
        loading={isLoading}
      />

      <FieldsDrawer
        open={fieldsDrawerOpen}
        onClose={() => setFieldsDrawerOpen(false)}
        collectionName={selectedCollectionName}
      />
      
      {/* Collection actions menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => {
          handleEditCollection(selectedCollection);
          handleCloseMenu();
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Collection
        </MenuItem>
        <MenuItem onClick={() => {
          handleViewFields(selectedCollection.collectionname);
          handleCloseMenu();
        }}>
          <FieldsIcon fontSize="small" sx={{ mr: 1 }} />
          Manage Fields
        </MenuItem>
        <MenuItem onClick={() => {
          handleDuplicateCollection(selectedCollection);
          handleCloseMenu();
        }}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => {
            handleDeleteCollection(selectedCollection.id);
            handleCloseMenu();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Collection
        </MenuItem>
      </Menu>
      
      {/* Filters menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleCloseFilterMenu}
      >
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={onlyActivePrio}
                onChange={(e) => setOnlyActivePrio(e.target.checked)}
                color="primary"
              />
            }
            label="Priority Active"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={onlyActivePrioOra}
                onChange={(e) => setOnlyActivePrioOra(e.target.checked)}
                color="secondary"
              />
            }
            label="Priority ORA Active"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={onlyActiveHash}
                onChange={(e) => setOnlyActiveHash(e.target.checked)}
                color="info"
              />
            }
            label="Hash Active"
          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClearFilters}>
          <Typography color="primary">Clear All Filters</Typography>
        </MenuItem>
      </Menu>
      
      {/* Snackbar notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          variant="filled" 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CollectionsManager;