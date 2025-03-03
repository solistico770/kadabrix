import React, { useState, useEffect } from 'react';
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Alert, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
  FormControlLabel,
  CircularProgress,
  Chip,
  Collapse,
  Snackbar
} from '@mui/material';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import ImageIcon from '@mui/icons-material/Image';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';

import kdb from '../../../kadabrix/kadabrix';
import { supabaseUrl } from "../../../kadabrix/kdbConfig";

// ======= Inline Editable Field Component =======
const EditableField = ({ initialValue, idValue, editField, refresh, type = "text", options }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await kdb.run({
        "module": "editCatalogCats",
        "name": "setValue",
        "data": { 
          editField: editField,
          idValue: idValue,
          newValue: value
        }
      });
      
      refresh();
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    setEditing(false);
  };

  // Handle special types
  const renderEditField = () => {
    switch (type) {
      case "boolean":
        return (
          <FormControlLabel
            control={
              <Switch
                checked={value === true || value === 1 || value === "1"}
                onChange={(e) => setValue(e.target.checked)}
                color="primary"
              />
            }
            label={value ? "פעיל" : "לא פעיל"}
          />
        );
      case "select":
        return (
          <TextField
            select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            SelectProps={{
              native: true,
            }}
            variant="outlined"
            fullWidth
            size="small"
          >
            {options && options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        );
      case "number":
        return (
          <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="number"
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{ inputProps: { min: 0 } }}
          />
        );
      default:
        return (
          <TextField
            value={value || ""}
            onChange={(e) => setValue(e.target.value)}
            variant="outlined"
            fullWidth
            size="small"
            multiline={type === "textarea"}
            rows={type === "textarea" ? 3 : 1}
            autoFocus
          />
        );
    }
  };

  const renderDisplay = () => {
    if (type === "boolean") {
      const isActive = value === true || value === 1 || value === "1";
      return (
        <Chip
          icon={isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
          label={isActive ? "פעיל" : "לא פעיל"}
          color={isActive ? "success" : "default"}
          size="small"
          className="cursor-pointer"
        />
      );
    }
    
    if (value === null || value === undefined || value === "") {
      return <Typography color="text.secondary" className="italic">ריק</Typography>;
    }
    
    return <Typography>{value}</Typography>;
  };

  return (
    <Box className="min-w-20">
      {editing ? (
        <Box className="flex gap-2 items-center">
          {renderEditField()}
          <Box className="flex">
            <Tooltip title="שמור">
              <IconButton 
                color="primary" 
                onClick={handleSave} 
                size="small"
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : <SaveIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="בטל">
              <IconButton 
                color="default" 
                onClick={handleCancel} 
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ) : (
        <Box 
          onClick={() => setEditing(true)} 
          className="cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
        >
          {renderDisplay()}
        </Box>
      )}
    </Box>
  );
};

// ======= Image Uploader Component =======
const ImageUploader = ({ id, refresh }) => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(
    `${supabaseUrl}/storage/v1/object/public/cats/${id}.jpg?cacheBuster=${Math.random()}`
  );
  const [error, setError] = useState(false);

  const handleImageError = () => {
    setError(true);
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          await kdb.run({
            "module": "editCatalogCats",
            "name": "upload",
            "data": { 
              id: id, 
              base64: e.target.result 
            }
          });
          
          // Update the preview with a cache buster
          setPreviewUrl(`${supabaseUrl}/storage/v1/object/public/cats/${id}.jpg?cacheBuster=${Math.random()}`);
          setError(false);
          refresh();
        } catch (err) {
          console.error('Error uploading file:', err);
        } finally {
          setLoading(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error handling file:', err);
      setLoading(false);
    }
  };

  return (
    <Box className="flex flex-col items-center gap-2">
      <Box className="relative w-24 h-24 border rounded overflow-hidden flex items-center justify-center bg-gray-50">
        {loading ? (
          <CircularProgress size={30} />
        ) : (
          <>
            {!error ? (
              <img
                src={previewUrl}
                alt="Category thumbnail"
                className="max-w-full max-h-full object-contain"
                onError={handleImageError}
              />
            ) : (
              <ImageIcon className="text-gray-300" style={{ fontSize: 40 }} />
            )}
          </>
        )}
      </Box>
      
      <label htmlFor={`file-upload-${id}`} className="cursor-pointer">
        <input
          id={`file-upload-${id}`}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <Button
          variant="outlined"
          component="span"
          size="small"
          startIcon={<UploadIcon />}
          disabled={loading}
        >
          העלה תמונה
        </Button>
      </label>
    </Box>
  );
};

// ======= Delete Confirmation Dialog =======
const DeleteConfirmDialog = ({ open, handleClose, handleConfirm, itemName }) => {
  return (
    <Dialog open={open} onClose={handleClose} dir="rtl">
      <DialogTitle>מחיקת קטגוריה</DialogTitle>
      <DialogContent>
        <DialogContentText>
          האם אתה בטוח שברצונך למחוק את הקטגוריה "{itemName}"? פעולה זו אינה ניתנת לביטול.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          ביטול
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" startIcon={<DeleteIcon />}>
          מחק
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ======= Add Category Dialog =======
const AddCategoryDialog = ({ open, handleClose, handleAdd, categories }) => {
  const [name, setName] = useState("");
  const [father, setFather] = useState("0");
  const [priority, setPriority] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name) return;
    
    setLoading(true);
    try {
      await handleAdd({
        name,
        father,
        priority
      });
      
      // Reset form
      setName("");
      setFather("0");
      setPriority(10);
      
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} dir="rtl" maxWidth="sm" fullWidth>
      <DialogTitle>הוספת קטגוריה חדשה</DialogTitle>
      <DialogContent>
        <Box className="flex flex-col gap-4 mt-2">
          <TextField
            label="שם הקטגוריה"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            autoFocus
          />
          
          <TextField
            select
            label="קטגוריית אב"
            value={father}
            onChange={(e) => setFather(e.target.value)}
            fullWidth
            SelectProps={{
              native: true,
            }}
          >
            <option value="0">קטגוריה ראשית</option>
            {categories
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </TextField>
          
          <TextField
            label="קדימות"
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            fullWidth
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          ביטול
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained" 
          disabled={!name || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
        >
          הוסף
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ======= Main Component =======
const CatalogCategoriesEditor = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
  const [expandedCategories, setExpandedCategories] = useState({});

  // Function to build tree from flat list
  function buildTree(items, fatherId, level = 0) {
    return items
      .filter(item => item.father === fatherId || (item.father === null && fatherId === "0"))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .map(item => ({
        ...item,
        level: level,
        children: buildTree(items, item.id, level + 1)
      }));
  }

  // Function to flatten tree into sorted list
  function flattenTree(tree) {
    let result = [];
    for (const node of tree) {
      result.push({
        id: node.id,
        name: node.name,
        query: node.query,
        priority: node.priority,
        active: node.active,
        father: node.father || "0",
        level: node.level,
        children: node.children
      });
      
      // Only add children if this category is expanded
      if (node.children && node.children.length > 0 && expandedCategories[node.id]) {
        result = result.concat(flattenTree(node.children));
      }
    }
    return result;
  }
  
  // Fetch categories from server
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await kdb.run({
        "module": "editCatalogCats",
        "name": "getCats"
      });
      
      // Add any missing properties to ensure consistent data structure
      const processedData = data.map(cat => ({
        ...cat,
        father: cat.father || "0",
        active: cat.active ?? true,
        priority: cat.priority || 0,
        query: cat.query || ""
      }));
      
      setCategories(processedData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "שגיאה בטעינת הקטגוריות");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle add category
  const handleAddCategory = async (categoryData) => {
    try {
      await kdb.run({
        "module": "editCatalogCats",
        "name": "addCat",
        "data": categoryData
      });
      
      await fetchCategories();
      showNotification("הקטגוריה נוספה בהצלחה", "success");
      return true;
    } catch (err) {
      setError(err.message || "שגיאה בהוספת קטגוריה");
      showNotification("שגיאה בהוספת קטגוריה", "error");
      throw err;
    }
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      await kdb.run({
        "module": "editCatalogCats",
        "name": "delCat",
        "data": { id: selectedCategory.id }
      });
      
      await fetchCategories();
      setDeleteDialogOpen(false);
      showNotification("הקטגוריה נמחקה בהצלחה", "success");
    } catch (err) {
      setError(err.message || "שגיאה במחיקת קטגוריה");
      showNotification("שגיאה במחיקת קטגוריה", "error");
    }
  };

  // Toggle category expansion
  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({
      open: true,
      message,
      type
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Build the category tree and flatten it for display
  const treeData = buildTree(categories, "0");
  const flattenedData = flattenTree(treeData);
  
  // Filter categories based on search query
  const filteredCategories = searchQuery
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.id.includes(searchQuery)
      )
    : flattenedData;
    
  return (
    <Box dir="rtl" className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <Box className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Typography variant="h4" component="h1" className="font-bold">
          ניהול קטגוריות קטלוג
        </Typography>
        
        <Box className="flex gap-2 w-full md:w-auto">
          <TextField
            placeholder="חיפוש לפי שם או מזהה"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            className="flex-grow"
            InputProps={{
              startAdornment: <SearchIcon className="ml-2 text-gray-400" />,
            }}
          />
          
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAddDialogOpen(true)}
            startIcon={<AddIcon />}
          >
            הוסף קטגוריה
          </Button>
        </Box>
      </Box>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* Main content */}
      <Paper elevation={2} className="overflow-hidden">
        {loading && categories.length === 0 ? (
          <Box className="p-8 flex justify-center">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell width="40%">שם הקטגוריה</TableCell>
                  <TableCell>מזהה</TableCell>
                  <TableCell>קטגוריית אב</TableCell>
                  <TableCell>קדימות</TableCell>
                  <TableCell>סטטוס</TableCell>
                  <TableCell>שאילתא</TableCell>
                  <TableCell>תמונה</TableCell>
                  <TableCell align="center">פעולות</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" className="py-8">
                      {searchQuery ? (
                        <Typography>לא נמצאו קטגוריות התואמות את החיפוש "{searchQuery}"</Typography>
                      ) : (
                        <Typography>לא נמצאו קטגוריות. לחץ על "הוסף קטגוריה" כדי להתחיל.</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow 
                      key={category.id}
                      hover
                      className={category.level > 0 ? "bg-gray-50" : ""}
                    >
                      <TableCell className="flex items-center">
                        {/* Indent and expand controls for hierarchical display */}
                        <Box className="flex items-center">
                          <span className="w-6" style={{ marginLeft: `${category.level * 20}px` }}></span>
                          
                          {category.children && category.children.length > 0 && (
                            <IconButton 
                              size="small" 
                              onClick={() => toggleCategoryExpand(category.id)}
                              className="mr-1"
                            >
                              {expandedCategories[category.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          )}
                          
                          <EditableField 
                            initialValue={category.name || ""} 
                            idValue={category.id} 
                            editField="name"
                            refresh={fetchCategories}
                          />
                        </Box>
                      </TableCell>
                      
                      <TableCell>{category.id}</TableCell>
                      
                      <TableCell>
                        <EditableField 
                          initialValue={category.father} 
                          idValue={category.id}
                          editField="father"
                          refresh={fetchCategories}
                          type="select"
                          options={[
                            { value: "0", label: "קטגוריה ראשית" },
                            ...categories
                              .filter(cat => cat.id !== category.id)
                              .map(cat => ({ 
                                value: cat.id, 
                                label: cat.name 
                              }))
                          ]}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <EditableField 
                          initialValue={category.priority} 
                          idValue={category.id}
                          editField="priority"
                          refresh={fetchCategories}
                          type="number"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <EditableField 
                          initialValue={category.active} 
                          idValue={category.id}
                          editField="active"
                          refresh={fetchCategories}
                          type="boolean"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <EditableField 
                          initialValue={category.query || ""} 
                          idValue={category.id}
                          editField="query"
                          refresh={fetchCategories}
                          type="textarea"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <ImageUploader 
                          id={category.id} 
                          refresh={fetchCategories} 
                        />
                      </TableCell>
                      
                      <TableCell align="center">
                        <Tooltip title="מחק קטגוריה">
                          <IconButton 
                            color="error"
                            onClick={() => {
                              setSelectedCategory(category);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Dialogs */}
      <DeleteConfirmDialog 
        open={deleteDialogOpen}
        handleClose={() => setDeleteDialogOpen(false)}
        handleConfirm={handleDeleteCategory}
        itemName={selectedCategory?.name || ""}
      />
      
      <AddCategoryDialog 
        open={addDialogOpen}
        handleClose={() => setAddDialogOpen(false)}
        handleAdd={handleAddCategory}
        categories={categories}
      />
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CatalogCategoriesEditor;