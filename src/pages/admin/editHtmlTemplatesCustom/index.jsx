import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import { useNavigate, useLocation } from 'react-router-dom';
import kdb from '../../../kadabrix/kadabrix';
import {
  Select,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Add as AddIcon, Save as SaveIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Import Ace editor modes and theme
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';

const editHtmlTemplatesCustom = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [emailHtml, setEmailHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSourceView, setIsSourceView] = useState(true); // Default to source view with Ace
  const navigate = useNavigate();
  const location = useLocation();

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await kdb.run({
        module: 'editHtmlTemplatesCustom',
        name: 'getAllTemplates',
        data: {},
      });
      setTemplates(data?.templates || []);
    } catch (error) {
      showNotification('Failed to fetch templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = async (id) => {
  
    try {
      setLoading(true);
      const data = await kdb.run({
        module: 'editHtmlTemplatesCustom',
        name: 'getTemplateById',
        data: { id },
      });
      setSelectedTemplate(data?.template || null);
      setTemplateName(data?.template?.name || '');
      setEmailHtml(data?.template?.emailHtml || '');
    } catch (error) {
      showNotification('Failed to load template', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      showNotification('Please enter a template name', 'warning');
      return;
    }

    try {
      setLoading(true);
      await kdb.run({
        module: 'editHtmlTemplatesCustom',
        name: 'saveTemplate',
        data: {
          id: selectedTemplate?.id,
          name: templateName,
          emailHtml,
        },
      });
      showNotification('Template saved successfully');
      await fetchTemplates();
    } catch (error) {
      showNotification('Failed to save template', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    if (id) {
      handleSelectTemplate(id);
    }
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <Select
          value={selectedTemplate?.id || ''}
          onChange={(e) => handleSelectTemplate(e.target.value)}
          sx={{ flexGrow: 1 }}
          disabled={loading}
        >
          <MenuItem value="">Select a template</MenuItem>
          {templates.map((template) => (
            <MenuItem key={template.id} value={template.id}>
              {template.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleSelectTemplate('')}
          disabled={loading}
        >
          Add New
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Template Name"
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
        sx={{ mb: 3 }}
        disabled={loading}
      />

      <FormControlLabel
        control={
          <Switch
            checked={isSourceView}
            onChange={(e) => setIsSourceView(e.target.checked)}
            disabled={loading}
          />
        }
        label={isSourceView ? "Edit Source Code" : "Preview"}
      />

      {isSourceView ? (
        <Box sx={{ mb: 3, minHeight: '400px' }}>
          <AceEditor
            mode="html"
            theme="monokai"
            value={emailHtml}
            onChange={setEmailHtml}
            name="ace-editor"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
            width="100%"
            height="500px"
            readOnly={loading}
          />
        </Box>
      ) : (
        <Box
          sx={{ mb: 3, minHeight: '400px', border: '1px solid #ccc', p: 2, overflow: 'auto' }}
          dangerouslySetInnerHTML={{ __html: emailHtml }}
        />
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={loading || !templateName.trim()}
        >
          Save
        </Button>
        {selectedTemplate && (
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            disabled={loading}
          >
            Delete
          </Button>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this template?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => {/* Add delete logic here */}} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default editHtmlTemplatesCustom;