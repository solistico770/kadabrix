import React, { useContext, useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import kdb from '../../kadabrix/kadabrix';

const Page =  () => {
  const [invoices, setInvoices] = useState([]);


  const fetchInvoices = async () => {
    try {
      
     
      let fetchedInvoices = await kdb.run({
          "module": "invoices",
          "name": "getInvoices"
        });


      
      setInvoices(fetchedInvoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  fetchInvoices();

  // Function to handle button click
  const handleButtonClick = async (ivValue) => {
    
    let doc  = await query("getInvoice", { IV:ivValue });
    const downloadLink = document.createElement("a");
    downloadLink.href = 'data:application/octet-stream;base64,'+doc;;
    downloadLink.download = ivValue+".pdf";
    downloadLink.click();
    
    

  };

const handleCreditCardClick = async (ivValue) => {
    
    let doc  = await query("createLpPage", { IV:ivValue });
    const downloadLink = document.createElement("a");
    downloadLink.href = doc.Url;;
    downloadLink.click();  

  };
  


  const highlightStyle = {
    backgroundColor: 'yellow',
  };


  return (
    <Container style={{ marginTop: '20px', width: 'auto' }}>
      <Typography variant="h5" color="textPrimary" gutterBottom>
        לקוח יקר
      </Typography>
      <Typography variant="body1">

      להלן החשבוניות האחרונות שהופקו במערכת סוליסטיקו 
      <br />
      בצהוב מסומנות החשבוניות שמיועדות לתשלום 
      <br />

      </Typography>
      <TableContainer component={Paper} style={{ marginTop: '20px', overflowX: 'auto' }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">מספר חשבונית</TableCell>
              <TableCell align="right">תאריך תשלום</TableCell>
              <TableCell align="right">סהכ</TableCell>
              <TableCell align="right">חוב פתוח?</TableCell>
              <TableCell align="right">תאריך מסמך</TableCell>
              <TableCell align="right">הורדה</TableCell>
              <TableCell align="right">תשלום באשראי</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((row) => (
              <TableRow key={row.invID} style={row.isOpen === 1 ? highlightStyle : null}>
                <TableCell align="right">{row.docName}</TableCell>
                <TableCell align="right">{new Date(row.unixTime * 1000).toLocaleDateString()}</TableCell>
                <TableCell align="right">{row.grandTotal}</TableCell>
                <TableCell align="right">{row.isOpen ? 'Yes' : 'No'}</TableCell>
                <TableCell align="right">{new Date(row.unixTime * 1000).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  {row.hasPdf === 1 ? (
                    <Button onClick={() => handleButtonClick(row.IV)}>הורד חשבונית</Button>
                  ) : (
                    "חסר/טרם הופק"
                  )}
                </TableCell>
                <TableCell align="right">

                {row.isOpen === 1 ? (
                    <Button onClick={() => handleCreditCardClick(row.IV)}>תשלום באשראי</Button>
                  ) : (
                    "שולם "
                  )}

                   
                </TableCell>

                

              </TableRow>
            ))}
          </TableBody> 
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Page;