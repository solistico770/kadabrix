import React, { useContext, useEffect, useState} from 'react';
import { Box,Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button ,ButtonGroup} from '@mui/material';
import kdb from '../../../kadabrix/kadabrix';


function Page({ data }) {

  const [invoices, setInvoices] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        

        let fetchedInvoices = await kdb.run({
            "module": "accIndex",
            "name": "getIndex"
          });

          
        function updateBalance(list){
          let sum = 0;
          let id = 0;
           list.forEach(function(item) {
             sum += item.price;
             id++;
             item.id = id;
             item.balance =  sum;
             item.C=(item.price>0)  ? item.price : 0  ;
             item.D=(item.price<0)  ? item.price : 0  ;
           });
           return list;
         }
         
         updateBalance(fetchedInvoices);


        setInvoices(fetchedInvoices);
        
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  


  useEffect(() => {
    const uniqueYears = new Set();
    invoices.forEach((row) => {
      const date = new Date(row.valueDate * 1000);
      uniqueYears.add(date.getFullYear());      
    });
    
    let yearsArray = Array.from(uniqueYears);


    setYears(yearsArray);
    setSelectedYear(yearsArray[yearsArray.length-1]);
    
  }, [invoices]);

  

  useEffect(() => {

    const filtered = invoices.filter((row) => {
      const date = new Date(row.valueDate * 1000);
      return date.getFullYear() === selectedYear;
    });
    setFilteredData(filtered);
  }, [invoices,selectedYear]);


const getDate = (unixTIme) =>  {

  
  const date = new Date(unixTIme * 1000); // Convert Unix timestamp to milliseconds
  // Get the various components of the date
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month is 0-indexed, so we add 1
  const day = date.getDate();
  return `${day}/${month}/${year}`

}
const screenHeight=window.innerHeight
const totalD = filteredData.reduce((sum, row) => sum + row.D, 0);
const totalC = filteredData.reduce((sum, row) => sum + row.C, 0);

  return (
    <div>

        
<Container style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" color="primary" gutterBottom style={{ fontWeight: 'bold', textAlign: 'center' }}>
        כרטסת לקוח
      </Typography>
      <Typography variant="body1" style={{ textAlign: 'center' }}>
        {/* Add any subtext or description here */}
      </Typography>
    </Container>

      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        {years.map((year) => (
          <Button 
          sx={{
            backgroundColor: year === selectedYear ? 'green' : 'primary.main',
            '&:hover': {
              backgroundColor: year === selectedYear ? 'darkgreen' : 'primary.dark',
            },
            color: 'white',
          }}

          key={year} onClick={() => setSelectedYear(year)}>
            {year} 
          </Button>
        ))}
      </ButtonGroup>


<Typography variant="body2">
 


 <Typography variant="body2">
  {filteredData.length>0 ? (
    <span>
    
    

    <Container>
<Box
        sx={{
          direction:'ltr',
          marginTop: '20px',
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          fontSize: '1.2rem', // Larger font size
          fontWeight: 'bold', // Bold text
        }}
      >




<Typography variant="body1" component="span" sx={{ margin: '10px' }}>
שנה: {selectedYear}
</Typography>
   
        <Typography variant="body1" component="span" style={{ margin: '10px' }}>
          יתרת פתיחה: {'\u200E'}{filteredData[0].balance - filteredData[0].price}
        </Typography>
        
        <Typography variant="body1" component="span" style={{ margin: '10px'  }}>
          יתרת סגירה: {'\u200E'}{filteredData[filteredData.length - 1].balance}
        </Typography>

      </Box>
      

</Container> 


   
    </span>
  ) : (
    <span> ==  </span>
  )}
</Typography>



</Typography>

      <TableContainer style={{ maxHeight: screenHeight }} component={Paper}>
        <Table stickyHeader   
        aria-label="simple table">
          <TableHead  sx={{
              backgroundColor: '#3f51b5',
              '& .MuiTableCell-root': { backgroundColor: '#3f51b5' ,color: '#ffffff', fontWeight: 'bold' },
            }}>
            <TableRow style={{ backgroundColor: '#3f51b5' }}>
            <TableCell align="right">תאריך </TableCell>
              <TableCell>מספר תנועה</TableCell>
              <TableCell align="right">שם מסמך</TableCell>
              <TableCell align="right">זכות</TableCell>
              <TableCell align="right">חובה</TableCell>
              <TableCell align="right">יתרה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row,index) => (
              <TableRow 
              style={{
                backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#e0e0e0', // Alternate row colors
              }}
              
              key={row.id}>
                <TableCell align="right">{getDate(row.valueDate)}</TableCell>
                <TableCell component="th" scope="row">
                  {row.transId}
                </TableCell>
                
                <TableCell align="right">{row.docName}</TableCell>
                <TableCell style={{ direction: 'ltr' }} align="right">{row.C}</TableCell>
                <TableCell style={{ direction: 'ltr' }}  align="right">{row.D}</TableCell>
                <TableCell style={{ direction: 'ltr' }}  align="right">{row.balance}</TableCell>
              </TableRow>
            ))}


<TableRow >
                <TableCell component="th" scope="row">
                </TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"> סה"כ</TableCell>
                <TableCell sx={{ direction: 'ltr' }} align="right">{'\u200E'}{totalC}</TableCell>
                <TableCell sx={{ direction: 'ltr' }} align="right">{'\u200E'}{totalD}</TableCell>
                <TableCell sx={{ direction: 'ltr' }} align="right"></TableCell>
              </TableRow>


          </TableBody>
        </Table> 
      </TableContainer>
    </div>
  );
}

export default Page;