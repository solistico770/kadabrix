import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
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

const editHtmlTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [emailHtml, setEmailHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSourceView, setIsSourceView] = useState(false); // New state for toggling source view
  const navigate = useNavigate();
  const location = useLocation();


  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await kdb.run({
        module: 'editHtmlTemplates',
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
    if (!id) {
      navigate('/editHtmlTemplates'); // Clear the query parameter
      setSelectedTemplate(null);
      setTemplateName('');
      setEmailHtml('');
      return;
    } else {
      navigate(`/editHtmlTemplates?id=${id}`);
    }

    try {
      setLoading(true);
      const data = await kdb.run({
        module: 'editHtmlTemplates',
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
        module: 'editHtmlTemplates',
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
        label="Edit Source Code"
      />

      {isSourceView ? (
        <TextField
          fullWidth
          multiline
          rows={20}
          value={emailHtml}
          onChange={(e) => setEmailHtml(e.target.value)}
          variant="outlined"
          sx={{ mb: 3 }}
          disabled={loading}
          InputProps={{
            inputProps: { dir: 'ltr' },
          }}

        />
      ) : (
        <Box sx={{ mb: 3, minHeight: '400px' }}>
          <Editor
            apiKey="mk27ffhenqpul8cfabujsq0s1jxxohiz8n7fmafwp1iuyd30"
            value={emailHtml}
            disabled={loading}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'preview', 'importcss', 'searchreplace', 'autolink', 'autosave', 'save', 'directionality', 'code',
                'visualblocks', 'visualchars', 'fullscreen', 'image', 'link', 'media', 'template', 'codesample',
                'table', 'charmap', 'pagebreak', 'nonbreaking', 'anchor', 'insertdatetime', 'advlist', 'lists',
                'wordcount', 'help', 'charmap', 'quickbars', 'emoticons',
              ],
              toolbar:
                'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code | help | preview',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
            onEditorChange={setEmailHtml}
          />
        </Box>
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
    </Box>
  );
};

export default editHtmlTemplates;
