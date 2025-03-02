import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import kdb from '../../../kadabrix/kadabrix';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";
import ace from "ace-builds";
import JsonImportModal from './JsonImportModal';

// Material UI imports
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Snackbar,
  Divider,
  Tooltip,
  InputAdornment,
  Stack,
  Tabs,
  Tab,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

// Import icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CodeEditor = () => {
  const navigate = useNavigate();

  // Configure Ace editor completions
  ace.config.loadModule("ace/ext/language_tools", function () {
    const customCompleter = {
      getCompletions: function (editor, session, pos, prefix, callback) {
        const completions = [
          { caption: "function", value: "function", meta: "keyword" },
          { caption: "console.log", value: "console.log()", meta: "method" },
          { caption: "return", value: "return", meta: "keyword" },
          { caption: "if", value: "if (condition) {\n\t\n}", meta: "keyword" },
          { caption: "else", value: "else {\n\t\n}", meta: "keyword" },
          { caption: "for", value: "for (let i = 0; i < array.length; i++) {\n\t\n}", meta: "loop" },
          { caption: "forEach", value: "forEach((item) => {\n\t\n})", meta: "method" },
          { caption: "map", value: "map((item) => {\n\t\n})", meta: "method" },
          { caption: "filter", value: "filter((item) => {\n\t\n})", meta: "method" },
          { caption: "async", value: "async", meta: "keyword" },
          { caption: "await", value: "await", meta: "keyword" },
          { caption: "Promise", value: "Promise", meta: "class" },
          { caption: "try/catch", value: "try {\n\t\n} catch (error) {\n\t\n}", meta: "error handling" },
        ];
        callback(null, completions);
      },
    };
    ace.require("ace/ext/language_tools").addCompleter(customCompleter);
  });

  // State variables
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  const [filters, setFilters] = useState({
    type: '',
    module: '',
    name: '',
    searchAll: ''
  });

  // Editor dialog state
  const [editorDialog, setEditorDialog] = useState({
    open: false,
    currentRecord: null,
    activeTab: 0
  });
  
  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    recordId: null
  });

  // Fetch records from backend
  const fetchRecords = async () => {
    try {
      const data = await kdb.run({
        "module": "codeEditor",
        "name": "getRecords"
      });
      setRecords(data);
    } catch (err) {
      setError(`Error fetching records: ${err.message}`);
      showNotification(`Failed to load records: ${err.message}`, 'error');
    }
  };

  // Filter records based on search criteria
  useEffect(() => {
    const { type, module, name, searchAll } = filters;
    
    const lowerCaseSearchAll = searchAll ? searchAll.toLowerCase() : '';
    
    const filtered = records.filter(record => {
      // Check for the "search all" field first
      if (searchAll && !Object.values(record).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(lowerCaseSearchAll)
      )) {
        return false;
      }
      
      // Check for type, module, and name filters
      if (type && !record.type?.toLowerCase().includes(type.toLowerCase())) return false;
      if (module && !record.module?.toLowerCase().includes(module.toLowerCase())) return false;
      if (name && !record.name?.toLowerCase().includes(name.toLowerCase())) return false;
      
      return true;
    });
    
    setFilteredRecords(filtered);
  }, [records, filters]);

  // Initial load
  useEffect(() => {
    fetchRecords();
  }, []);

  // Open editor dialog with a record
  const openEditor = (record = null) => {
    setEditorDialog({
      open: true,
      currentRecord: record || {
        type: filters.type || '',
        module: filters.module || '',
        name: filters.name || '',
        data: '',
        config: '{}'
      },
      activeTab: 0
    });
  };

  // Close editor dialog
  const closeEditor = () => {
    setEditorDialog({
      ...editorDialog,
      open: false
    });
  };

  // Handle editor tab change
  const handleTabChange = (event, newValue) => {
    setEditorDialog({
      ...editorDialog,
      activeTab: newValue
    });
  };

  // Update record field
  const updateRecordField = (field, value) => {
    setEditorDialog({
      ...editorDialog,
      currentRecord: {
        ...editorDialog.currentRecord,
        [field]: value
      }
    });
  };

  // Save record
  const saveRecord = async () => {
    try {
      if (!editorDialog.currentRecord.id) {
        // Add new record
        await kdb.run({
          "module": "codeEditor",
          "name": "addRecord",
          "data": {
            "isDuplicate": false,
            "record": editorDialog.currentRecord
          }
        });
        showNotification('Record added successfully', 'success');
      } else {
        // Update existing record
        await kdb.run({
          "module": "codeEditor",
          "name": "saveRecord",
          "data": editorDialog.currentRecord
        });
        showNotification('Record saved successfully', 'success');
      }
      
      fetchRecords();
      closeEditor();
    } catch (err) {
      setError(`Error saving record: ${err.message}`);
      showNotification(`Failed to save record: ${err.message}`, 'error');
    }
  };

  // Delete record
  const deleteRecord = async () => {
    try {
      await kdb.run({
        "module": "codeEditor",
        "name": "delRecord",
        "data": {
          id: deleteDialog.recordId
        }
      });
      
      showNotification('Record deleted successfully', 'success');
      fetchRecords();
      setDeleteDialog({ open: false, recordId: null });
      
      if (editorDialog.open) {
        closeEditor();
      }
    } catch (err) {
      setError(`Error deleting record: ${err.message}`);
      showNotification(`Failed to delete record: ${err.message}`, 'error');
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (recordId) => {
    setDeleteDialog({
      open: true,
      recordId
    });
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      recordId: null
    });
  };

  // Show notification
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Close notification
  const closeNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      type: '',
      module: '',
      name: '',
      searchAll: ''
    });
  };

  // Handle successful import
  const handleImportSuccess = () => {
    fetchRecords();
    showNotification('Records imported successfully', 'success');
  };

  // Get unique values for dropdown filters
  const getUniqueValues = (field) => {
    const uniqueValues = [...new Set(records.map(record => record[field]))].filter(Boolean);
    return uniqueValues.sort();
  };

  return (
    <Box 
      sx={{ 
        backgroundColor: '#f5f5f7', 
        minHeight: '100vh',
        p: 3
      }}
    >
      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={closeNotification} severity={notification.severity} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Paper 
        sx={{ 
          p: 2, 
          mb: 4, 
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box display="flex" alignItems="center">
          <CodeIcon sx={{ fontSize: 32, mr: 2, color: '#5c6bc0' }} />
          <Typography variant="h5" fontWeight="bold" color="primary">
            Code Editor Manager
          </Typography>
        </Box>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/codeEditorCustom')}
            sx={{ mr: 2 }}
          >
            Custom Editor
          </Button>
          
          <JsonImportModal 
            jsonData={filteredRecords} 
            onImport={handleImportSuccess} 
          />
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openEditor()}
            sx={{ ml: 2 }}
          >
            Add New
          </Button>
        </Box>
      </Paper>

      {/* Filters */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight="medium">
            Search & Filter
          </Typography>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              fullWidth
              size="small"
              label="Type"
              variant="outlined"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {filters.type && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleFilterChange('type', '')}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              fullWidth
              size="small"
              label="Module"
              variant="outlined"
              value={filters.module}
              onChange={(e) => handleFilterChange('module', e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {filters.module && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleFilterChange('module', '')}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              fullWidth
              size="small"
              label="Name"
              variant="outlined"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {filters.name && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleFilterChange('name', '')}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4.5}>
            <TextField
              fullWidth
              size="small"
              label="Search"
              variant="outlined"
              value={filters.searchAll}
              onChange={(e) => handleFilterChange('searchAll', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Records table */}
      <Paper 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                <TableCell 
                  sx={{ 
                    backgroundColor: '#5c6bc0', 
                    color: 'white',
                    fontWeight: 'bold' 
                  }}
                >
                  Type
                </TableCell>
                <TableCell 
                  sx={{ 
                    backgroundColor: '#5c6bc0', 
                    color: 'white',
                    fontWeight: 'bold' 
                  }}
                >
                  Module
                </TableCell>
                <TableCell 
                  sx={{ 
                    backgroundColor: '#5c6bc0', 
                    color: 'white',
                    fontWeight: 'bold' 
                  }}
                >
                  Name
                </TableCell>
                <TableCell 
                  sx={{ 
                    backgroundColor: '#5c6bc0', 
                    color: 'white',
                    fontWeight: 'bold' 
                  }}
                >
                  Description
                </TableCell>
                <TableCell 
                  sx={{ 
                    backgroundColor: '#5c6bc0', 
                    color: 'white',
                    fontWeight: 'bold',
                    width: '120px',
                    textAlign: 'center'
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      No records found. Try adjusting your filters or add a new record.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow 
                    key={record.id} 
                    hover
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: '#f5f5f5',
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => openEditor(record)}
                  >
                    <TableCell>
                      <Chip 
                        label={record.type || 'N/A'} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{record.module || 'N/A'}</TableCell>
                    <TableCell>{record.name || 'N/A'}</TableCell>
                    <TableCell>{record.description || 'No description'}</TableCell>
                    <TableCell>
                      <Box display="flex" justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton 
                            color="primary" 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditor(record);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteDialog(record.id);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" bgcolor="#f0f0f0">
          <Typography variant="body2" color="text.secondary">
            {filteredRecords.length} of {records.length} records
          </Typography>
        </Box>
      </Paper>

      {/* Editor Dialog */}
      <Dialog 
        open={editorDialog.open} 
        onClose={closeEditor}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: { 
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            m: 1
          }
        }}
      >
        <DialogTitle sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center">
            <CodeIcon sx={{ mr: 1, color: '#5c6bc0' }} />
            <Typography variant="h6">
              {editorDialog.currentRecord?.id ? 'Edit' : 'Add New'} Code Record
            </Typography>
          </Box>
          <IconButton onClick={closeEditor} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs 
            value={editorDialog.activeTab} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Code" icon={<CodeIcon />} iconPosition="start" />
            <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start" />
          </Tabs>
        </Box>
        
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
          {editorDialog.activeTab === 0 && (
            <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
              <AceEditor
                mode="javascript"
                theme="tomorrow_night"
                name="code-editor"
                value={editorDialog.currentRecord?.data || ''}
                onChange={(value) => updateRecordField('data', value)}
                width="100%"
                height="100%"
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
              />
            </Box>
          )}
          
          {editorDialog.activeTab === 1 && (
            <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Type"
                    value={editorDialog.currentRecord?.type || ''}
                    onChange={(e) => updateRecordField('type', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Module"
                    value={editorDialog.currentRecord?.module || ''}
                    onChange={(e) => updateRecordField('module', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={editorDialog.currentRecord?.name || ''}
                    onChange={(e) => updateRecordField('name', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={editorDialog.currentRecord?.description || ''}
                    onChange={(e) => updateRecordField('description', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Configuration"
                    value={editorDialog.currentRecord?.config || '{}'}
                    onChange={(e) => updateRecordField('config', e.target.value)}
                    margin="normal"
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={closeEditor} variant="outlined" startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button 
            onClick={saveRecord} 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this record? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteRecord} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CodeEditor;