import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';

const DetailsPopup = ({ open, budget, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>פרטים נוספים</DialogTitle>
      <DialogContent>
        <Typography><strong>חשבוניות:</strong> {budget.metaData?.inv || '-'}</Typography>
        <Typography><strong>שטרי משלוח:</strong> {budget.metaData?.ship || '-'}</Typography>
        <Typography><strong>הזמנות:</strong> {budget.metaData?.orders || '-'}</Typography>
        <Typography><strong>סה"כ שימוש:</strong> {budget.metaData?.total || '-'}</Typography>
        <Typography><strong>נותר:</strong> {budget.metaData?.remaining || '-'}</Typography>
        {budget.metaData?.reasons && (
          <div>
            <Typography><strong>סיבות:</strong></Typography>
            <ul>
              {budget.metaData.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">סגור</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsPopup;
