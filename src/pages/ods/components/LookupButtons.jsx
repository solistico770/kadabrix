// File: src/components/LookupButtons.jsx
import React from 'react';
import { Button } from '@mui/material';

const LookupButtons = ({ handleDialogOpen }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Button variant="outlined" onClick={() => handleDialogOpen('odsStatus')}>
        ניהול סטטוס ODS
      </Button>
      <Button variant="outlined" onClick={() => handleDialogOpen('pickStatus')}>
        ניהול סטטוס ליקוט
      </Button>
      <Button variant="outlined" onClick={() => handleDialogOpen('pickers')}>
        ניהול מלקטים
      </Button>
      <Button variant="outlined" onClick={() => handleDialogOpen('lines')}>
        ניהול קווים
      </Button>
      <Button variant="outlined" onClick={() => handleDialogOpen('vans')}>
        ניהול משאיות
      </Button>
      <Button variant="outlined" onClick={() => handleDialogOpen('drivers')}>
        ניהול נהגים
      </Button>
      <Button variant="outlined" onClick={() => handleDialogOpen('linesInstance')}>
        ניהול מופעי קווים
      </Button>
    </div>
  );
};

export default LookupButtons;