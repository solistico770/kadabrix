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
  Snackbar
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import kdb from '../../../kadabrix/kadabrix';
import { supabaseUrl } from "../../../kadabrix/kdbConfig";
import { useDropzone } from 'react-dropzone';

const ImagePreview = ({ id }) => {
  const [error, setError] = useState(false);
  return (
    <Box className="w-16 h-16 flex items-center justify-center">
      {!error ? (
        <img
          src={`${supabaseUrl}/storage/v1/object/public/cats/${id}.jpg?cacheBuster=${Math.random()}`}
          alt="Category"
          className="max-w-full max-h-full object-contain"
          onError={() => setError(true)}
        />
      ) : (
        <ImageIcon className="text-gray-300" style={{ fontSize: 30 }} />
      )}
    </Box>
  );
};

const ImageUploader = ({ id, refresh, size = 'small' }) => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(
    `${supabaseUrl}/storage/v1/object/public/cats/${id}.jpg?cacheBuster=${Math.random()}`
  );
  const [error, setError] = useState(false);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        await kdb.run({
          "module": "editCatalogCats",
          "name": "upload",
          "data": { id, base64: e.target.result }
        });
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
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*', multiple: false });
  const previewSize = size === 'large' ? 'w-48 h-48' : 'w-24 h-24';

  return (
    <Box {...getRootProps()} className={`relative ${previewSize} border rounded overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer`}>
      <input {...getInputProps()} />
      {loading ? (
        <CircularProgress size={30} />
      ) : (
        <>
          {!error ? (
            <img
              src={previewUrl}
              alt="Category thumbnail"
              className="max-w-full max-h-full object-contain"
              onError={() => setError(true)}
            />
          ) : (
            <ImageIcon className="text-gray-300" style={{ fontSize: 40 }} />
          )}
          {isDragActive && (
            <Box className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Typography color="white">שחרר כאן</Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

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
        <Button onClick={handleClose} color="primary">ביטול</Button>
        <Button onClick={handleConfirm} color="error" variant="contained" startIcon={<DeleteIcon />}>מחק</Button>
      </DialogActions>
    </Dialog>
  );
};

const AddCategoryDialog = ({ open, handleClose, handleAdd, categories }) => {
  const [name, setName] = useState("");
  const [father, setFather] = useState("0");
  const [priority, setPriority] = useState(10);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*', multiple: false });

  const handleSubmit = async () => {
    if (!name) return;
    setLoading(true);
    try {
      await handleAdd({ name, father, priority, file });
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
          />
          <TextField
            select
            label="קטגוריית אב"
            value={father}
            onChange={(e) => setFather(e.target.value)}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="0">קטגוריה ראשית</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </TextField>
          <TextField
            label="קדימות"
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            fullWidth
          />
          <Box {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>שחרר את התמונה כאן...</p>
            ) : (
              <p>גרור ושחרר תמונה, או לחץ לבחירה</p>
            )}
            {preview && <img src={preview} alt="Preview" className="mt-2 max-h-48 mx-auto" />}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>ביטול</Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading || !name}>
          {loading ? <CircularProgress size={20} /> : 'הוסף'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const EditCategoryModal = ({ open, onClose, category, categories, onSave }) => {
  


  const [name, setName] = useState(category.name || "");
  const [father, setFather] = useState(category.father || "0");
  const [priority, setPriority] = useState(category.priority || 0);
  const [active, setActive] = useState(category.active || false);
  const [query, setQuery] = useState(category.query || "");
  const [loading, setLoading] = useState(false);

  
  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({ name, father, priority, active, query });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth dir="rtl">
      <DialogTitle>עריכת קטגוריה !{name}! </DialogTitle>
      <DialogContent>
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <TextField
            label="שם הקטגוריה"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            select
            label="קטגוריית אב"
            value={father}
            onChange={(e) => setFather(e.target.value)}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="0">קטגוריה ראשית</option>
            {categories.filter(cat => cat.id !== category.id).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </TextField>
          <TextField
            label="קדימות"
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            fullWidth
          />
          <FormControlLabel
            control={<Switch checked={active} onChange={(e) => setActive(e.target.checked)} />}
            label="פעיל"
          />
          <TextField
            label="שאילתא"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
          <Box>
            <Typography variant="subtitle1">תמונה</Typography>
            <ImageUploader id={category.id} refresh={onSave} size="large" />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button onClick={handleSave} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'שמור'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CatalogCategoriesEditor = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
  const [expandedCategories, setExpandedCategories] = useState({});

  function buildTree(items, fatherId, level = 0) {
    return items
      .filter(item => item.father === fatherId || (item.father === null && fatherId === "0"))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .map(item => ({
        ...item,
        level,
        children: buildTree(items, item.id, level + 1)
      }));
  }

  function flattenTree(tree) {
    let result = [];
    for (const node of tree) {
      result.push(node);
      if (node.children && node.children.length > 0 && expandedCategories[node.id]) {
        result = result.concat(flattenTree(node.children));
      }
    }
    return result;
  }

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await kdb.run({ "module": "editCatalogCats", "name": "getCats" });
      const processedData = data.map(cat => ({
        id: String(cat.id),
        name: cat.name || "",
        father: cat.father ? String(cat.father) : "0",
        active: cat.active === 1,
        priority: cat.priority || 0,
        query: cat.query || ""
      }));
      setCategories(processedData);
      setError(null);
    } catch (err) {
      const errorMsg = err.message || "שגיאה בטעינת הקטגוריות";
      setError(errorMsg);
      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async ({ name, father, priority, file }) => {
    try {
      const categoryData = {
        name,
        father: father === "0" ? 0 : parseInt(father, 10),
        priority: parseInt(priority, 10) || 0,
        active: 1
      };
      const newCategory = await kdb.run({
        "module": "editCatalogCats",
        "name": "addCat",
        "data": categoryData
      });
      if (file) {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              await kdb.run({
                "module": "editCatalogCats",
                "name": "upload",
                "data": { id: newCategory.id, base64: e.target.result }
              });
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          reader.readAsDataURL(file);
        });
      }
      await fetchCategories();
      showNotification("הקטגוריה נוספה בהצלחה", "success");
      return newCategory;
    } catch (err) {
      setError(err.message || "שגיאה בהוספת קטגוריה");
      showNotification("שגיאה בהוספת קטגוריה", "error");
      throw err;
    }
  };

  const handleEditCategory = async (updatedData) => {
    try {
      const updates = {};
      if (updatedData.name !== editCategory.name) updates.name = updatedData.name;
      if (updatedData.father !== editCategory.father) updates.father = updatedData.father === "0" ? 0 : parseInt(updatedData.father, 10);
      if (updatedData.priority !== editCategory.priority) updates.priority = parseInt(updatedData.priority, 10);
      if (updatedData.active !== editCategory.active) updates.active = updatedData.active ? 1 : 0;
      if (updatedData.query !== editCategory.query) updates.query = updatedData.query;

      if (Object.keys(updates).length === 0) return;

      for (const [field, value] of Object.entries(updates)) {
        await kdb.run({
          "module": "editCatalogCats",
          "name": "setValue",
          "data": { editField: field, idValue: editCategory.id, newValue: value }
        });
      }
      await fetchCategories();
      showNotification("הקטגוריה עודכנה בהצלחה", "success");
    } catch (err) {
      setError(err.message || "שגיאה בעדכון קטגוריה");
      showNotification("שגיאה בעדכון קטגוריה", "error");
      throw err;
    }
  };

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

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ open: true, message, type });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const treeData = buildTree(categories, "0");
  const flattenedData = flattenTree(treeData);
  const filteredCategories = searchQuery
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cat.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : flattenedData;

  return (
    <Box dir="rtl" className="p-6 max-w-7xl mx-auto">
      <Box className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Typography variant="h4" component="h1" className="font-bold">
          ניהול קטגוריות קטלוג
        </Typography>
        <Box className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <TextField
            placeholder="חיפוש לפי שם או מזהה"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            className="flex-grow"
            InputProps={{ startAdornment: <SearchIcon className="ml-2 text-gray-400" /> }}
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

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} className="overflow-hidden">
        {loading && categories.length === 0 ? (
          <Box className="p-8 flex justify-center">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer className="max-h-[70vh] overflow-x-auto">
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell width="20%">שם הקטגוריה</TableCell>
                  <TableCell width="10%">מזהה</TableCell>
                  <TableCell width="15%">קטגוריית אב</TableCell>
                  <TableCell className="hidden sm:table-cell" width="10%">קדימות</TableCell>
                  <TableCell width="10%">סטטוס</TableCell>
                  <TableCell className="hidden sm:table-cell" width="15%">שאילתא</TableCell>
                  <TableCell width="10%">תמונה</TableCell>
                  <TableCell width="10%" align="center">פעולות</TableCell>
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
                    <TableRow key={category.id} hover className={category.level > 0 ? "bg-gray-50" : ""}>
                      <TableCell>
                        <Box className="flex items-center">
                          <span style={{ marginLeft: `${category.level * 20}px` }}></span>
                          {category.children && category.children.length > 0 && (
                            <IconButton size="small" onClick={() => toggleCategoryExpand(category.id)}>
                              {expandedCategories[category.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          )}
                          <Typography>{category.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{category.id}</TableCell>
                      <TableCell>{category.father === "0" ? "קטגוריה ראשית" : categories.find(cat => cat.id === category.father)?.name || "לא ידוע"}</TableCell>
                      <TableCell className="hidden sm:table-cell">{category.priority}</TableCell>
                      <TableCell>
                        <Chip
                          icon={category.active ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          label={category.active ? "פעיל" : "לא פעיל"}
                          color={category.active ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Tooltip title={category.query || ""}>
                          <Typography className="truncate max-w-[200px]">{category.query || ""}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <ImagePreview id={category.id} />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="ערוך">
                          <IconButton onClick={() => { setEditCategory(category); setEditDialogOpen(true); }}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="מחק">
                          <IconButton color="error" onClick={() => { setSelectedCategory(category); setDeleteDialogOpen(true); }}>
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
      
      {editDialogOpen&&(

            <EditCategoryModal 
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            category={editCategory || {}}
            categories={categories}
            onSave={handleEditCategory}
            />


      )}
      
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.type} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CatalogCategoriesEditor;