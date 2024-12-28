import React, { useState, useEffect, useCallback, useMemo } from 'react';
import kdb from '../../kadabrix/kadabrix';
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  CircularProgress,
  TablePagination,
  FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from 'lodash';

const AddCollectionDialog = ({
  open,
  onClose,
  onCreated
}) => {
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

  const handleSwitchChange = (field) => (e) => {
    setCollectionData((prev) => ({
      ...prev,
      [field]: e.target.checked ? '1' : '0'
    }));
  };

  const handleTextChange = (field) => (e) => {
    setCollectionData((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSave = async () => {
    if (!collectionData.collectionname.trim()) {
      alert('Collection name cannot be empty');
      return;
    }
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
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Collection</DialogTitle>
      <DialogContent dividers>
        <div className="space-y-4">
          <TextField
            label="Collection Name"
            value={collectionData.collectionname}
            onChange={handleTextChange('collectionname')}
            fullWidth
          />
          <div className="p-4 border rounded-md space-y-2">
            <Typography variant="subtitle1">Priority Settings</Typography>
            <div className="flex items-center gap-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={collectionData.priority_active === '1'}
                    onChange={handleSwitchChange('priority_active')}
                  />
                }
                label="Priority Active"
              />
              <TextField
                label="Type"
                value={collectionData.priority_type}
                onChange={handleTextChange('priority_type')}
                size="small"
                inputProps={{ maxLength: 5 }}
              />
            </div>
            <TextField
              label="Meta"
              value={collectionData.priority_meta}
              onChange={handleTextChange('priority_meta')}
              size="small"
              fullWidth
            />
            <TextField
              label="Query"
              value={collectionData.priority_query}
              onChange={handleTextChange('priority_query')}
              size="small"
              fullWidth
              multiline
              rows={3}
            />
          </div>

          <div className="p-4 border rounded-md space-y-2">
            <Typography variant="subtitle1">Priority ORA Settings</Typography>
            <div className="flex items-center gap-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={collectionData.priorityora_active === '1'}
                    onChange={handleSwitchChange('priorityora_active')}
                  />
                }
                label="Priority ORA Active"
              />
              <TextField
                label="Type"
                value={collectionData.priorityora_type}
                onChange={handleTextChange('priorityora_type')}
                size="small"
                inputProps={{ maxLength: 5 }}
              />
            </div>
            <TextField
              label="Meta"
              value={collectionData.priorityora_meta}
              onChange={handleTextChange('priorityora_meta')}
              size="small"
              fullWidth
            />
            <TextField
              label="Query"
              value={collectionData.priorityora_query}
              onChange={handleTextChange('priorityora_query')}
              size="small"
              fullWidth
              multiline
              rows={3}
            />
          </div>

          <div className="p-4 border rounded-md space-y-2">
            <Typography variant="subtitle1">Hash Settings</Typography>
            <div className="flex items-center gap-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={collectionData.hash_active === '1'}
                    onChange={handleSwitchChange('hash_active')}
                  />
                }
                label="Hash Active"
              />
              <TextField
                label="Type"
                value={collectionData.hash_type}
                onChange={handleTextChange('hash_type')}
                size="small"
                inputProps={{ maxLength: 5 }}
              />
            </div>
            <TextField
              label="Meta"
              value={collectionData.hash_meta}
              onChange={handleTextChange('hash_meta')}
              size="small"
              fullWidth
            />
            <TextField
              label="Query"
              value={collectionData.hash_query}
              onChange={handleTextChange('hash_query')}
              size="small"
              fullWidth
              multiline
              rows={3}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Add Collection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditCollectionDialog = ({
  open,
  onClose,
  collection,
  onChange,
  onSave,
  errors,
  loading
}) => {
  const handleSwitchChange = (field) => (e) => {
    onChange(field, e.target.checked ? '1' : '0');
  };

  const handleTextChange = (field) => (e) => {
    onChange(field, e.target.value);
  };

  if (!collection) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit Collection: {collection.collectionname || ''}
      </DialogTitle>
      <DialogContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <Typography variant="h6" className="mb-4">Priority Settings</Typography>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Switch
                checked={collection.priority_active === '1'}
                onChange={handleSwitchChange('priority_active')}
              />
              <span className="ml-2">Active</span>
            </div>
            <TextField
              label="Type"
              value={collection.priority_type || ''}
              onChange={handleTextChange('priority_type')}
              error={!!errors.priority_type}
              helperText={errors.priority_type}
              inputProps={{ maxLength: 5 }}
              size="small"
            />
          </div>
          <TextField
            label="Meta"
            value={collection.priority_meta || ''}
            onChange={handleTextChange('priority_meta')}
            fullWidth
            className="mt-4"
            size="small"
          />
          <TextField
            label="Query"
            value={collection.priority_query || ''}
            onChange={handleTextChange('priority_query')}
            fullWidth
            multiline
            rows={4}
            className="mt-4"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <Typography variant="h6" className="mb-4">Priority ORA Settings</Typography>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Switch
                checked={collection.priorityora_active === '1'}
                onChange={handleSwitchChange('priorityora_active')}
              />
              <span className="ml-2">Active</span>
            </div>
            <TextField
              label="Type"
              value={collection.priorityora_type || ''}
              onChange={handleTextChange('priorityora_type')}
              error={!!errors.priorityora_type}
              helperText={errors.priorityora_type}
              inputProps={{ maxLength: 5 }}
              size="small"
            />
          </div>
          <TextField
            label="Meta"
            value={collection.priorityora_meta || ''}
            onChange={handleTextChange('priorityora_meta')}
            fullWidth
            className="mt-4"
            size="small"
          />
          <TextField
            label="Query"
            value={collection.priorityora_query || ''}
            onChange={handleTextChange('priorityora_query')}
            fullWidth
            multiline
            rows={4}
            className="mt-4"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <Typography variant="h6" className="mb-4">Hash Settings</Typography>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Switch
                checked={collection.hash_active === '1'}
                onChange={handleSwitchChange('hash_active')}
              />
              <span className="ml-2">Active</span>
            </div>
            <TextField
              label="Type"
              value={collection.hash_type || ''}
              onChange={handleTextChange('hash_type')}
              error={!!errors.hash_type}
              helperText={errors.hash_type}
              inputProps={{ maxLength: 5 }}
              size="small"
            />
          </div>
          <TextField
            label="Meta"
            value={collection.hash_meta || ''}
            onChange={handleTextChange('hash_meta')}
            fullWidth
            className="mt-4"
            size="small"
          />
          <TextField
            label="Query"
            value={collection.hash_query || ''}
            onChange={handleTextChange('hash_query')}
            fullWidth
            multiline
            rows={4}
            className="mt-4"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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

  const handleTextChange = (field) => (e) => {
    setFieldData((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSaveField = async () => {
    if (!fieldData.fieldname.trim()) {
      alert('Field name cannot be empty');
      return;
    }
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
    } else {
      setFieldData((prev) => ({
        ...prev,
        collectionname: collectionName
      }));
    }
  }, [open, collectionName]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Field to {collectionName}</DialogTitle>
      <DialogContent dividers>
        <div className="space-y-3">
          <TextField
            label="Field Name"
            value={fieldData.fieldname}
            onChange={handleTextChange('fieldname')}
            fullWidth
          />
          <TextField
            label="Description"
            value={fieldData.descr}
            onChange={handleTextChange('descr')}
            fullWidth
          />
          <TextField
            label="Priority Src"
            value={fieldData.priority_src}
            onChange={handleTextChange('priority_src')}
            fullWidth
          />
          <TextField
            label="Priority Meta"
            value={fieldData.priority_meta}
            onChange={handleTextChange('priority_meta')}
            fullWidth
          />
          <TextField
            label="ORA Src"
            value={fieldData.priorityora_src}
            onChange={handleTextChange('priorityora_src')}
            fullWidth
          />
          <TextField
            label="ORA Meta"
            value={fieldData.priorityora_meta}
            onChange={handleTextChange('priorityora_meta')}
            fullWidth
          />
          <TextField
            label="Hash Src"
            value={fieldData.hash_src}
            onChange={handleTextChange('hash_src')}
            fullWidth
          />
          <TextField
            label="Hash Meta"
            value={fieldData.hash_meta}
            onChange={handleTextChange('hash_meta')}
            fullWidth
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          onClick={handleSaveField}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Add Field'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const FieldsDialog = ({
  open,
  onClose,
  collectionName
}) => {
  const [fields, setFields] = useState([]);
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [fieldsSearchTerm, setFieldsSearchTerm] = useState('');
  const [filteredFields, setFilteredFields] = useState([]);
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [isUpdatingField, setIsUpdatingField] = useState(false);
  const [addFieldDialogOpen, setAddFieldDialogOpen] = useState(false);

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

  const handleEditField = (field) => {
    setCurrentField({ ...field });
    setEditFieldDialogOpen(true);
  };

  const handleCloseFieldEditDialog = () => {
    setEditFieldDialogOpen(false);
    setCurrentField(null);
  };

  const handleSaveField = async () => {
    if (!currentField) return;
    setIsUpdatingField(true);
    try {
      await kdb.run({
        module: 'etlEditor',
        name: 'updateCollectionField',
        data: currentField
      });
      setIsUpdatingField(false);
      setEditFieldDialogOpen(false);
      await fetchFields();
    } catch (error) {
      console.error('Error updating field:', error);
      setIsUpdatingField(false);
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (!window.confirm('Are you sure you want to delete this field?')) return;
    try {
      setFieldsLoading(true);
      await kdb.run({
        module: 'etlEditor',
        name: 'deleteCollectionField',
        data: { id: fieldId }
      });
      await fetchFields();
    } catch (error) {
      console.error('Error deleting field:', error);
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

  const handleFieldCreated = async () => {
    setAddFieldDialogOpen(false);
    await fetchFields();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Collection Fields: {collectionName}</DialogTitle>
      <DialogContent>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center bg-gray-100 rounded-md p-2 flex-grow mr-2">
            <SearchIcon className="text-gray-400 mr-2" />
            <TextField
              fullWidth
              variant="standard"
              placeholder="Search fields by name or description..."
              value={fieldsSearchTerm}
              onChange={(e) => setFieldsSearchTerm(e.target.value)}
              InputProps={{
                disableUnderline: true
              }}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAddFieldDialogOpen(true)}
          >
            Add Field
          </Button>
        </div>

        {fieldsLoading ? (
          <div className="py-4 flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Field Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Priority Src</TableCell>
                  <TableCell>ORA Src</TableCell>
                  <TableCell>Hash Src</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredFields.length === 0 && fieldsSearchTerm.trim() === '')
                  ? fields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell>{field.fieldname}</TableCell>
                        <TableCell>{field.descr}</TableCell>
                        <TableCell>{field.priority_src}</TableCell>
                        <TableCell>{field.priorityora_src}</TableCell>
                        <TableCell>{field.hash_src}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => handleEditField(field)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteField(field.id)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  : filteredFields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell>{field.fieldname}</TableCell>
                        <TableCell>{field.descr}</TableCell>
                        <TableCell>{field.priority_src}</TableCell>
                        <TableCell>{field.priorityora_src}</TableCell>
                        <TableCell>{field.hash_src}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => handleEditField(field)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteField(field.id)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>

      <Dialog
        open={editFieldDialogOpen}
        onClose={handleCloseFieldEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Field</DialogTitle>
        <DialogContent>
          {currentField && (
            <div className="space-y-4">
              <TextField
                label="Field Name"
                value={currentField.fieldname || ''}
                onChange={(e) => handleFieldChange('fieldname', e.target.value)}
                fullWidth
              />
              <TextField
                label="Description"
                value={currentField.descr || ''}
                onChange={(e) => handleFieldChange('descr', e.target.value)}
                fullWidth
              />
              <TextField
                label="Priority Src"
                value={currentField.priority_src || ''}
                onChange={(e) => handleFieldChange('priority_src', e.target.value)}
                fullWidth
              />
              <TextField
                label="Priority Meta"
                value={currentField.priority_meta || ''}
                onChange={(e) => handleFieldChange('priority_meta', e.target.value)}
                fullWidth
              />
              <TextField
                label="ORA Src"
                value={currentField.priorityora_src || ''}
                onChange={(e) => handleFieldChange('priorityora_src', e.target.value)}
                fullWidth
              />
              <TextField
                label="ORA Meta"
                value={currentField.priorityora_meta || ''}
                onChange={(e) => handleFieldChange('priorityora_meta', e.target.value)}
                fullWidth
              />
              <TextField
                label="Hash Src"
                value={currentField.hash_src || ''}
                onChange={(e) => handleFieldChange('hash_src', e.target.value)}
                fullWidth
              />
              <TextField
                label="Hash Meta"
                value={currentField.hash_meta || ''}
                onChange={(e) => handleFieldChange('hash_meta', e.target.value)}
                fullWidth
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFieldEditDialog} disabled={isUpdatingField}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveField}
            variant="contained"
            color="primary"
            disabled={isUpdatingField}
          >
            {isUpdatingField ? <CircularProgress size={22} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <AddFieldDialog
        open={addFieldDialogOpen}
        onClose={() => setAddFieldDialogOpen(false)}
        collectionName={collectionName}
        onFieldCreated={handleFieldCreated}
      />
    </Dialog>
  );
};

const CollectionsManager = () => {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCollection, setCurrentCollection] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [fieldsDialogOpen, setFieldsDialogOpen] = useState(false);
  const [selectedCollectionName, setSelectedCollectionName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [onlyActivePrio, setOnlyActivePrio] = useState(false);
  const [onlyActivePrioOra, setOnlyActivePrioOra] = useState(false);
  const [onlyActiveHash, setOnlyActiveHash] = useState(false);

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
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleFilter = useCallback(
    (term, data) => {
      let filtered = data;
      if (term.trim()) {
        const lowerTerm = term.toLowerCase();
        filtered = filtered.filter((c) =>
          Object.entries(c).some(([_, value]) => {
            if (value === null) return false;
            return value.toString().toLowerCase().includes(lowerTerm);
          })
        );
      }
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
    debouncedSearch(searchTerm, collections);
  }, [searchTerm, collections, onlyActivePrio, onlyActivePrioOra, onlyActiveHash, debouncedSearch]);

  const validateForm = useCallback((data) => {
    const newErrors = {};
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
      fetchCollections();
    } catch (error) {
      console.error('Error updating collection:', error);
      setIsLoading(false);
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
      await fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
    } finally {
      setTableLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentCollection((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedData = useMemo(() => {
    return filteredCollections.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredCollections, page, rowsPerPage]);

  const handleViewFields = (collectionName) => {
    setSelectedCollectionName(collectionName);
    setFieldsDialogOpen(true);
  };

  const handleCollectionCreated = async () => {
    await fetchCollections();
    setAddDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center bg-white rounded-lg shadow-sm border p-2 mb-2 md:mb-0 md:mr-2 flex-grow">
          <SearchIcon className="text-gray-400 mr-2" />
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search in all fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              disableUnderline: true
            }}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddDialogOpen(true)}
        >
          Add New Collection
        </Button>
      </div>

      <div className="flex gap-4">
        <FormControlLabel
          control={
            <Switch
              checked={onlyActivePrio}
              onChange={(e) => setOnlyActivePrio(e.target.checked)}
            />
          }
          label="Only Priority Active"
        />
        <FormControlLabel
          control={
            <Switch
              checked={onlyActivePrioOra}
              onChange={(e) => setOnlyActivePrioOra(e.target.checked)}
            />
          }
          label="Only Priority ORA Active"
        />
        <FormControlLabel
          control={
            <Switch
              checked={onlyActiveHash}
              onChange={(e) => setOnlyActiveHash(e.target.checked)}
            />
          }
          label="Only Hash Active"
        />
      </div>

      <TableContainer component={Paper}>
        {tableLoading ? (
          <div className="py-6 flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Collection Name</TableCell>
                <TableCell align="center">Priority</TableCell>
                <TableCell align="center">Priority ORA</TableCell>
                <TableCell align="center">Hash</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>{collection.collectionname}</TableCell>
                  <TableCell align="center">
                    <div className="flex flex-col items-center">
                      <Switch
                        size="small"
                        checked={collection.priority_active === '1'}
                        disabled
                      />
                      <Typography variant="caption">
                        {collection.priority_type || '-'}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex flex-col items-center">
                      <Switch
                        size="small"
                        checked={collection.priorityora_active === '1'}
                        disabled
                      />
                      <Typography variant="caption">
                        {collection.priorityora_type || '-'}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex flex-col items-center">
                      <Switch
                        size="small"
                        checked={collection.hash_active === '1'}
                        disabled
                      />
                      <Typography variant="caption">
                        {collection.hash_type || '-'}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex flex-row items-center gap-2">
                      <IconButton
                        onClick={() => handleEditCollection(collection)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewFields(collection.collectionname)}
                      >
                        Fields
                      </Button>
                      <IconButton
                        onClick={() => handleDeleteCollection(collection.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredCollections.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 20, 50]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

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

      <FieldsDialog
        open={fieldsDialogOpen}
        onClose={() => setFieldsDialogOpen(false)}
        collectionName={selectedCollectionName}
      />
    </div>
  );
};

export default CollectionsManager;
