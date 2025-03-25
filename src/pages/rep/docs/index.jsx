import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import { 
  TextField, Button, CircularProgress, Alert, Table, TableBody, 
  TableCell, TableHead, TableRow, Pagination, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, Typography 
} from '@mui/material';
import { Email as EmailIcon, PlayArrow as RunIcon, Visibility as ViewIcon } from '@mui/icons-material';

const DocumentManager = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Hebrew status mapping with styling
  const getStatusInfo = (status) => {
    switch (status) {
      case 0: return { text: 'ממתין ל-ERP', color: 'text-yellow-600' };
      case 1: return { text: 'תהליך הושלם', color: 'text-green-600' };
      case 2: return { text: 'שגיאה', color: 'text-red-600' };
      case 99: return { text: 'בתהליך ERP', color: 'text-blue-600' };
      default: return { text: 'לא ידוע', color: 'text-gray-600' };
    }
  };

  // Load documents
  const loadDocuments = async () => {
    setLoading(true);
    try {
      const result = await kdb.run({
        module: "kdb_docs",
        name: "fetchDocuments",
        data: { page, pageSize, search }
      });
      if (result.success) {
        setDocuments(result.rows);
        setTotal(result.total);
        setError(null);
      } else {
        setError(result.error || "טעינת מסמכים נכשלה");
      }
    } catch (err) {
      setError("שגיאה בטעינת המסמכים");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch full document
  const fetchFullDocument = async (docId) => {
    try {
      const result = await kdb.run({
        module: "kdb_docs",
        name: "fetchDocument",
        data: { docId }
      });
      if (result.success) {
        setSelectedDoc({ ...result.document, data: JSON.parse(result.document.data) });
        setDialogOpen(true);
        setError(null);
      } else {
        setError(result.error || "טעינת פרטי מסמך נכשלה");
      }
    } catch (err) {
      setError("שגיאה בטעינת פרטי המסמך");
      console.error(err);
    }
  };

  // Handle resend mail
  const handleResendMail = async (docId) => {
    try {
      const result = await kdb.run({
        module: "kdb_docs",
        name: "resendMail",
        data: { docId }
      });
      if (result.success) {
        setError(null);
        alert(result.message);
      } else {
        setError(result.error || "שליחת דוא\"ל נכשלה");
      }
    } catch (err) {
      setError("שגיאה בשליחת הדוא\"ל");
      console.error(err);
    }
  };

  // Handle run order
  const handleRunOrder = async (docId) => {
    try {
      const result = await kdb.run({
        module: "kdb_docs",
        name: "runOrder",
        data: { docId }
      });
      if (result.success) {
        setError(null);
        alert(result.message);
        loadDocuments();
      } else {
        setError(result.error || "הפעלת הזמנה נכשלה");
      }
    } catch (err) {
      setError("שגיאה בהפעלת ההזמנה");
      console.error(err);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDoc(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen" dir="rtl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 text-right">
        ניהול מסמכים
      </h1>

      {/* Error Display */}
      {error && (
        <Alert severity="error" className="mb-6 rounded-lg shadow-md">
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <div className="mb-6 flex justify-end">
        <TextField
          label="חיפוש מסמכים"
          value={search}
          onChange={handleSearchChange}
          variant="outlined"
          className="max-w-md bg-white rounded-lg shadow-sm"
          placeholder="חפש לפי תוכן..."
          InputProps={{ className: 'text-right' }}
          sx={{ '& .MuiInputBase-root': { direction: 'rtl' } }}
        />
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-200">
        {loading ? (
          <div className="flex justify-center p-6">
            <CircularProgress />
          </div>
        ) : documents.length === 0 ? (
          <p className="text-gray-500 italic p-6 text-right">לא נמצאו מסמכים</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell className="font-semibold text-gray-700 py-4">מזהה</TableCell>
                <TableCell className="font-semibold text-gray-700 py-4">סוג</TableCell>
                <TableCell className="font-semibold text-gray-700 py-4">מספר מסמך</TableCell>
                <TableCell className="font-semibold text-gray-700 py-4">זמן</TableCell>
                <TableCell className="font-semibold text-gray-700 py-4">סטטוס</TableCell>
                <TableCell className="font-semibold text-gray-700 py-4">שם לקוח</TableCell>
                <TableCell className="font-semibold text-gray-700 py-4">תיאור לקוח</TableCell>
                <TableCell className="font-semibold text-gray-700 py-4">כמות כוללת</TableCell>
                <TableCell className="font-semibold text-gray-700 py-4">סכום כולל</TableCell>
                <TableCell className="font-semibold text-gray-700 py-4">פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>{doc.id}</TableCell>
                  <TableCell>{doc.docType === 'order' ? 'הזמנה' : 'קבלה'}</TableCell>
                  <TableCell>{doc.docNumber}</TableCell>
                  <TableCell>{new Date(doc.time).toLocaleString('he-IL')}</TableCell>
                  <TableCell className={`${getStatusInfo(doc.status).color} font-medium`}>
                    {getStatusInfo(doc.status).text}
                  </TableCell>
                  <TableCell>{doc.custName || '-'}</TableCell>
                  <TableCell>{doc.custDes || '-'}</TableCell>
                  <TableCell>{doc.total.totalQ || '-'}</TableCell>
                  <TableCell>{doc.total.total || '-'}</TableCell>
                  <TableCell className="space-x-2 rtl:space-x-reverse">
                    <IconButton
                      onClick={() => fetchFullDocument(doc.id)}
                      title="צפה בפרטים"
                      color="primary"
                      className="hover:bg-blue-100"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleResendMail(doc.id)}
                      title='שלח דוא"ל מחדש' // Fixed: Using single quotes
                      color="primary"
                      className="hover:bg-blue-100"
                    >
                      <EmailIcon />
                    </IconButton>
                    {doc.docType === 'order' && (doc.status === 0 || doc.status === 2) && (
                      <IconButton
                        onClick={() => handleRunOrder(doc.id)}
                        title="הפעל הזמנה"
                        color="success"
                        className="hover:bg-green-100"
                      >
                        <RunIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {!loading && total > pageSize && (
        <div className="mt-6 flex justify-center">
          <Pagination
            count={Math.ceil(total / pageSize)}
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            color="primary"
            siblingCount={1}
            boundaryCount={1}
            className="bg-white rounded-lg shadow-sm p-2"
            dir="ltr"
          />
        </div>
      )}

      {/* Popup Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="md"
        PaperProps={{ className: "p-6 rounded-xl shadow-xl bg-white" }}
        dir="rtl"
      >
        <DialogTitle className="text-2xl font-bold text-gray-800 border-b pb-2">
          פרטי מסמך - {selectedDoc?.docType === 'order' ? 'הזמנה' : 'קבלה'} #{selectedDoc?.docNumber}
        </DialogTitle>
        <DialogContent className="mt-4">
          {selectedDoc && (
            <div className="space-y-4 text-right">
              <Typography className="text-gray-700">מזהה: {selectedDoc.id}</Typography>
              <Typography className="text-gray-700">
                זמן: {new Date(selectedDoc.time).toLocaleString('he-IL')}
              </Typography>
              <Typography className={`${getStatusInfo(selectedDoc.status).color} font-medium`}>
                סטטוס: {getStatusInfo(selectedDoc.status).text}
              </Typography>
              {selectedDoc.status === 2 && selectedDoc.return && (
                <Typography className="text-red-600 bg-red-50 p-2 rounded-lg">
                  פרטי שגיאה: {JSON.stringify(selectedDoc.return)}
                </Typography>
              )}
              {selectedDoc.docType === 'receipt' ? (
                <>
                  <Typography className="text-gray-700">שם לקוח: {selectedDoc.data.title?.custName || 'לא זמין'}</Typography>
                  <Typography className="text-gray-700">תיאור לקוח: {selectedDoc.data.title?.custDes || 'לא זמין'}</Typography>
                  <Typography className="text-gray-700">שורות: {selectedDoc.data.lines?.join(', ') || 'לא זמין'}</Typography>
                </>
              ) : (
                <>
                  <Typography className="text-gray-700">שם לקוח: {selectedDoc.data.title?.custName || 'לא זמין'}</Typography>
                  <Typography className="text-gray-700">תיאור לקוח: {selectedDoc.data.title?.custDes || 'לא זמין'}</Typography>
                  <div>
                    <Typography variant="h6" className="font-semibold mt-4 text-gray-800">פריטים:</Typography>
                    <Table size="small" className="mt-2 bg-gray-50 rounded-lg">
                      <TableHead>
                        <TableRow>
                          <TableCell className="font-medium text-gray-700">מספר חלק</TableCell>
                          <TableCell className="font-medium text-gray-700">שם</TableCell>
                          <TableCell className="font-medium text-gray-700">תיאור</TableCell>
                          <TableCell className="font-medium text-gray-700">כמות</TableCell>
                          <TableCell className="font-medium text-gray-700">מחיר</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedDoc.data.items?.map((item) => (
                          <TableRow key={item.index} className="hover:bg-gray-100">
                            <TableCell>{item.part}</TableCell>
                            <TableCell>{item.partName}</TableCell>
                            <TableCell>{item.partDes}</TableCell>
                            <TableCell>{item.quant}</TableCell>
                            <TableCell>{item.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <Typography variant="h6" className="font-semibold mt-4 text-gray-800">סיכום:</Typography>
                  <Typography className="text-gray-700">סכום כולל: {selectedDoc.data.total?.total || 'לא זמין'}</Typography>
                  <Typography className="text-gray-700">כמות כוללת: {selectedDoc.data.total?.totalQ || 'לא זמין'}</Typography>
                  <Typography className="text-gray-700">תקציב נותר: {selectedDoc.data.total?.remainingBudget || 'לא זמין'}</Typography>
                </>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions className="mt-4">
          <Button 
            onClick={handleCloseDialog} 
            variant="contained" 
            color="primary" 
            className="rounded-lg shadow-md hover:bg-blue-700"
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DocumentManager;