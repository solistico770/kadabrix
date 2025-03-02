import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

// Material UI imports
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Snackbar
} from '@mui/material';

// Import icons
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import InfoIcon from '@mui/icons-material/Info';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const JsonImportModal = ({ jsonData, onImport }) => {
  // State variables
  const [isOpen, setIsOpen] = useState(false);
  const [editorValue, setEditorValue] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importStats, setImportStats] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '' });

  // Update editor value when jsonData changes
  useEffect(() => {
    try {
      const formattedJson = JSON.stringify(jsonData || [], null, 2);
      setEditorValue(formattedJson);
    } catch (error) {
      console.error('Error formatting JSON data:', error);
      setEditorValue('[]');
    }
  }, [jsonData]);

  // Open modal
  const handleOpen = () => {
    setIsOpen(true);
    setError(null);
    setImportStats(null);
    setIsSubmitting(false);
  };

  // Close modal
  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing during submission
    setIsOpen(false);
    setError(null);
  };

  // Copy JSON to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(editorValue);
    showNotification('Copied to clipboard');
  };

  // Reset JSON to original data
  const resetJson = () => {
    try {
      setEditorValue(JSON.stringify(jsonData || [], null, 2));
      setError(null);
      showNotification('Reset to original data');
    } catch (error) {
      console.error('Error resetting JSON:', error);
    }
  };

  // Show notification
  const showNotification = (message) => {
    setNotification({
      open: true,
      message
    });
  };

  // Close notification
  const closeNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Handle JSON validation
  const validateJson = () => {
    try {
      JSON.parse(editorValue);
      setError(null);
      return true;
    } catch (error) {
      setError(`Invalid JSON: ${error.message}`);
      return false;
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        // Try to parse it to validate it's proper JSON
        JSON.parse(content);
        setEditorValue(content);
        setError(null);
        showNotification('File loaded successfully');
      } catch (error) {
        setError(`Invalid JSON file: ${error.message}`);
      }
    };
    reader.readAsText(file);
  };

  // Import JSON data
  const handleImport = async () => {
    if (!validateJson()) return;
    
    setIsSubmitting(true);
    setError(null);
    setImportStats(null);
    
    try {
      const parsedData = JSON.parse(editorValue);
      
      if (!Array.isArray(parsedData)) {
        throw new Error('Data must be an array of records');
      }
      
      let successCount = 0;
      let errorCount = 0;
      let errors = [];
      
      // Log the import settings for debugging
      console.log('Import settings:', { isDuplicate, recordCount: parsedData.length });
      
      for (let i = 0; i < parsedData.length; i++) {
        const item = parsedData[i];
        
        try {
          // Make sure we're explicitly passing the isDuplicate flag
          const result = await kdb.run({
            "module": "codeEditorCustom",
            "name": "addRecord",
            "data": {
              "isDuplicate": isDuplicate,
              "record": item
            }
          });
          
          console.log(`Record ${i} import result:`, result);
          successCount++;
        } catch (error) {
          console.error(`Error importing record ${i}:`, error);
          errorCount++;
          errors.push({
            index: i,
            record: item,
            error: error.message
          });
        }
      }
      
      setImportStats({
        total: parsedData.length,
        success: successCount,
        error: errorCount,
        errors,
        duplicateMode: isDuplicate
      });
      
      if (errorCount === 0) {
        onImport && onImport(parsedData, isDuplicate);
        showNotification('All records imported successfully');
      } else {
        showNotification(`Imported ${successCount} of ${parsedData.length} records`);
      }
    } catch (error) {
      console.error('Import operation failed:', error);
      setError(`Import failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download errors as JSON
  const downloadErrors = () => {
    if (!importStats?.errors?.length) return;
    
    const errorData = JSON.stringify(importStats.errors, null, 2);
    const blob = new Blob([errorData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'import-errors.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download current JSON
  const downloadJson = () => {
    try {
      // Validate JSON first
      JSON.parse(editorValue);
      
      const blob = new Blob([editorValue], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'code-editor-records.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      setError(`Cannot download: ${error.message}`);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        onClick={handleOpen}
      >
        Import/Export
      </Button>
      
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { 
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Box display="flex" alignItems="center">
            <CloudUploadIcon sx={{ mr: 1, color: '#5c6bc0' }} />
            <Typography variant="h6">
              JSON Import/Export
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" disabled={isSubmitting}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {importStats && (
            <Alert 
              severity={importStats.error === 0 ? "success" : "warning"} 
              sx={{ mb: 2 }}
              action={
                importStats.error > 0 ? (
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={downloadErrors}
                  >
                    Download Errors
                  </Button>
                ) : null
              }
            >
              <Typography variant="subtitle2">
                {importStats.error === 0
                  ? 'All records imported successfully!'
                  : `Imported ${importStats.success} of ${importStats.total} records with ${importStats.error} errors`}
              </Typography>
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                component="label"
                size="small"
                sx={{ mr: 1 }}
              >
                Upload File
                <input
                  type="file"
                  accept=".json"
                  hidden
                  onChange={handleFileUpload}
                />
              </Button>
              <Tooltip title="Reset to original data">
                <IconButton onClick={resetJson} size="small" sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy to clipboard">
                <IconButton onClick={copyToClipboard} size="small" sx={{ mr: 1 }}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download JSON">
                <IconButton onClick={downloadJson} size="small">
                  <FileDownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Button
              variant="text"
              onClick={validateJson}
              startIcon={<PlayArrowIcon />}
              size="small"
            >
              Validate
            </Button>
          </Box>
          
          <Box sx={{ height: '350px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', mb: 3 }}>
            <AceEditor
              mode="json"
              theme="github"
              value={editorValue}
              onChange={setEditorValue}
              name="json-editor"
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
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, backgroundColor: isDuplicate ? '#f0f7ff' : '#fff' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isDuplicate}
                  onChange={(e) => setIsDuplicate(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" fontWeight="medium">
                    Allow Duplicates
                  </Typography>
                  <Tooltip title="When enabled, the system will create new records even if they have the same type/module/name as existing records. When disabled, existing records with the same identifiers will be updated.">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 4 }}>
              Current mode: <strong>{isDuplicate ? 'Create duplicates' : 'Update existing records'}</strong>
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            variant="contained"
            onClick={handleImport}
            startIcon={<CloudUploadIcon />}
            disabled={isSubmitting}
            color="primary"
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Importing...
              </>
            ) : 'Import'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={closeNotification}
        message={notification.message}
      />
    </>
  );
};

export default JsonImportModal;