import React, { useContext, useEffect, useState} from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button ,ButtonGroup} from '@mui/material';
import kdb from '../../kadabrix/kadabrix';


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

  return (
    <div>

        

<Container style={{ marginTop: '20px', width: 'auto' }}>
      <Typography variant="h5" color="textPrimary" gutterBottom>
        כרטסת
      </Typography>
      <Typography variant="body1">

      להלן כרטסת תנועות לפי שנים 
      <br />
      הדף בבניה ונתונים נוספים כגון חוב פתוח יתווספו בהמשך 
      
      </Typography>
</Container>


      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        {years.map((year) => (
          <Button key={year} onClick={() => setSelectedYear(year)}>
            {year} 
          </Button>
        ))}
      </ButtonGroup>


<Typography variant="body2">
 


 <Typography variant="body2">
  שנה: {selectedYear} &nbsp;&nbsp;&nbsp;
  {filteredData.length>0 ? (
    <span>
    
    

    
יתרת פתיחה : {filteredData[0].balance-filteredData[0].price} 
&nbsp;&nbsp;&nbsp;
יתרת סגירה : {filteredData[filteredData.length-1].balance} 
 
   


   
    </span>
  ) : (
    <span> ==  </span>
  )}
</Typography>



</Typography>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>מספר תנועה</TableCell>
              <TableCell align="right">שם מסמך</TableCell>
              <TableCell align="right">זכות</TableCell>
              <TableCell align="right">חובה</TableCell>
              <TableCell align="right">יתרה</TableCell>
              

              <TableCell align="right">תאריך ערך</TableCell>
              <TableCell align="right">פרטים</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.transId}
                </TableCell>
                <TableCell align="right">{row.docName}</TableCell>
                <TableCell align="right">{row.C}</TableCell>
                <TableCell align="right">{row.D}</TableCell>
                <TableCell align="right">{row.balance}</TableCell>
                <TableCell align="right">{getDate(row.valueDate)}</TableCell>
                <TableCell align="right">{row.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> 
      </TableContainer>
    </div>
  );
}

export default Page;