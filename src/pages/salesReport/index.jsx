import { createTheme, ThemeProvider } from '@mui/material/styles';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { flushSync } from 'react-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import React, { useState ,useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import kdb from '../../kadabrix/kadabrix';

import GetSelectedCust from "./getSelectedCust";
import GetSelectedPart from "./GetSelectedPart";
import GetSelectedAgent from "./GetSelectedAgent";
import GetSelectedFamily from "./GetSelectedFamily";
import GetSelectedDocName from "./GetSelectedDocName";
import GetSelectedDate from "./GetSelectedDate";


import GetPart from "./GetPart";
import GetCust from "./GetCust";
import GetCustType from "./GetCustType";
import GetDateGroup from "./GetDateGroup";
import GetFamily from "./GetFamily";
import GetAgent from "./GetAgent";
import GetDate from "./GetDate";
import GroupBy from "./GroupBy";
import GroupByBlock from "./groupByBlock";

import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment';
import 'moment-timezone';
import { Container, Grid, Paper, Button } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff', // Adjust primary color
      contrastText: '#ffffff', // Text color on primary
      dark: '#0056b3', // Darker shade for hover
      light: '#66b2ff', // Lighter shade for active
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#0056b3', // Darker hover background
            color: '#ffffff',
          },
          '&:active': {
            backgroundColor: '#66b2ff', // Lighter active background
            color: '#ffffff',
          },
        },
      },
    },
  },
});







const ProgressBar = ({ percent }) => {
  return (
    <Box display="flex" alignItems="center" width="100%">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" value={percent} />
      </Box>
    </Box>
  );
};

//** */

const Users = () => {
  const [doRefresh, setDoRefresh] = useState(false);
  useEffect(()=>{

    if (doRefresh){
      // fetchData();
    }

  },[doRefresh]);



  const [groupBy, setGroupBy] = useState([]);
  const [docType, setDocType] = useState('invoiceMap');
  const [fromDate, setFromDate] = useState(moment().startOf('month'));
  const [toDate, setToDate] = useState(moment().endOf('month'));

  const [getAgent, setGetAgent] = useState(null);
  const [getCustType, setGetCustType] = useState(null);
  const [getCust, setGetCust] = useState(null);
  const [getFamily, setGetFamily] = useState(null);
  const [getPart, setGetPart] = useState(null);
  const [getDocName, setGetDocName] = useState(null);
  const [getDate, setGetDate] = useState(null);
  

  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateGroup, setDateGroup] = useState("month");
  const [orderBy, setOrderBy] = useState("TOTAL");
  const [orderByD, setOrderByD] = useState(false);

  const sortData = (data) => {
    if (!data || data.length === 0 || !orderBy) {
      return data; // Return original data if conditions are not met
    }
  
    // Sort the data array by the key specified in orderBy
    const sortedData = [...data].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return orderByD ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return orderByD ? 1 : -1;
      }
      return 0; // If equal, no change
    });
  
    return sortedData;
  };
  
  
  
  useEffect(()=>{
    setFormData(sortData(formData));
  },[orderBy,orderByD])



  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await kdb.run({
        module: 'salesReport',
        name: 'getReport',
        data: { 
              docType:docType,    
              getAgent:getAgent,
              getCustType:getCustType,
              getCust:getCust,
              getDocName:getDocName,
              getDate:getDate,
              getFamily:getFamily,
              getPart:getPart,
              groupBy:groupBy,
              fromDate:fromDate.unix(),
              toDate:toDate.unix(),
              dateGroup:dateGroup
         },
      });
      setLoading(false);
      setFormData(sortData(response));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = formData.length > 0 ? Object.keys(formData[0]) : [];
  
  let largetsTotal = formData.reduce((max, entry) => {
    return entry.TOTAL > max ? entry.TOTAL : max;
  },0);

  
  let totalV = Number(formData.reduce((max, entry) => {
    return entry.TOTAL+max
  },0).toFixed(0)).toLocaleString();

  let totalA = Number(formData.reduce((max, entry) => {
    return entry.TOTALQ+ max;
  },0).toFixed(0)).toLocaleString();

  const doOrderBy = (col)=>{

    if (col==orderBy) {

      setOrderByD(!orderByD);

    } else {

      setOrderBy(col)
    }

  }

  return (
<ThemeProvider theme={theme}>
  <Container> 
        <Box sx={{ py: 2 }}>
            <ButtonGroup fullWidth variant="outlined" aria-label="Basic button group">




            <Button 
                sx={{ bgcolor: docType === 'invoicesMap' ? 'blue' : 'default' , color: docType === 'invoicseMap' ? 'white' : 'default'}}
                onClick={() => setDocType('invoicesMap')}

              >
              חשבוניות                 
            </Button>

            
            <Button 
                sx={{ bgcolor: docType === 'ordersMap' ? 'blue' : 'default' , color: docType === 'ordersMap' ? 'white' : 'default'}}
                onClick={() => setDocType('ordersMap')}

              >
              הזמנות                 
            </Button>

            
            <Button 
                sx={{ bgcolor: docType === 'shipDocMap' ? 'blue' : 'default' , color: docType === 'shipDocMap' ? 'white' : 'default'}}
                onClick={() => setDocType('shipDocMap')}

              >
              ת.משלוח                 
            </Button>

            
            <Button 
                sx={{ bgcolor: docType === 'proposalMap' ? 'blue' : 'default' , color: docType === 'proposalMap' ? 'white' : 'default'}}
                onClick={() => setDocType('proposalMap')}

              >
              הצעות מחיר                 
            </Button>




              
            </ButtonGroup>
    </Box>
    
    <Box>
      <GetDate 
      fromDate={fromDate} setFromDate={setFromDate}  
      toDate={toDate} setToDate={setToDate}  
      />
    </Box>

    <Box>
    
       <GroupByBlock state={groupBy} setter={setGroupBy}/>

       {(groupBy.indexOf("date")!=-1) ? (<GetDateGroup state={dateGroup} setter={setDateGroup}/>) : ''}
    </Box>
    <Box>

        <GetPart/>

    </Box>
    <Box>
      <GetSelectedCust state={getCust} setter={setGetCust} />
      <GetSelectedPart state={getPart} setter={setGetPart} />
      <GetSelectedAgent state={getAgent} setter={setGetAgent} />
      <GetSelectedFamily state={getFamily} setter={setGetFamily} />
      <GetSelectedDocName state={getDocName} setter={setGetDocName} />
      <GetSelectedDate state={getDate} setter={setGetDate} />
      
    </Box>

    <Box sx={{ py: 2 }}>
            <ButtonGroup variant="outlined" aria-label="Basic button group">
              <Button onClick={fetchData}
                sx={{ bgcolor: 'green',color:"white"}}
              >הצג תוצאות</Button>
              
            </ButtonGroup>
    </Box>


     {( loading ? <CircularProgress /> : '')}

{formData.length==0?'':(
  <Container component="section">
  
        <TableContainer component={Paper}>
          <Table dir="rtl">
            <TableHead>
              <TableRow >
                
              {(columns.indexOf("groupDate_day")!=-1) ? (
                    
                    <TableCell key="תאריך" onClick={()=>{doOrderBy("groupDate_day")}}> 
                    <SwapVertIcon 
                            sx={{ color: orderBy === 'groupDate' ? 'blue' : 'lightgray' }}
                    />
                     תאריך </TableCell>

                ) : '' }

              {(columns.indexOf("groupDate_week")!=-1) ? (
                    
                    <TableCell key="תאריך" onClick={()=>{doOrderBy("groupDate_week")}}> 
                    <SwapVertIcon 
                            sx={{ color: orderBy === 'groupDate' ? 'blue' : 'lightgray' }}
                    />
                     תאריך </TableCell>

                ) : '' }


{(columns.indexOf("groupDate_month")!=-1) ? (
                    
                    <TableCell key="תאריך" onClick={()=>{doOrderBy("groupDate_month")}}> 
                    <SwapVertIcon 
                            sx={{ color: orderBy === 'groupDate' ? 'blue' : 'lightgray' }}
                    />
                     תאריך </TableCell>

                ) : '' }



{(columns.indexOf("groupDate_year")!=-1) ? (
                    
                    <TableCell key="תאריך" onClick={()=>{doOrderBy("groupDate_year")}}> 
                    <SwapVertIcon 
                            sx={{ color: orderBy === 'groupDate' ? 'blue' : 'lightgray' }}
                    />
                     תאריך </TableCell>

                ) : '' }


              {(columns.indexOf("docName")!=-1) ? (
                    
                    <TableCell key="מסמך" onClick={()=>{doOrderBy("docName")}}> 
                     <SwapVertIcon 
                            sx={{ color: orderBy === 'docName' ? 'blue' : 'lightgray' }}
                    />
                    מסמך </TableCell>
                    

                ) : '' }

                
                {(columns.indexOf("agentName")!=-1) ? (
                    
                    <TableCell key="סוכן" onClick={()=>{doOrderBy("agentDes")}}> 
                      <SwapVertIcon 
                            sx={{ color: orderBy === 'agentDes' ? 'blue' : 'lightgray' }}
                    />

                    סוכן </TableCell>

                ) : '' }

                {(columns.indexOf("cust")!=-1) ? (

                    <TableCell key="לקוח" onClick={()=>{doOrderBy("custDes")}}> 
                      <SwapVertIcon 
                            sx={{ color: orderBy === 'custDes' ? 'blue' : 'lightgray' }}
                    />
                    לקוח </TableCell>

                ) : '' }



                {(columns.indexOf("familyName")!=-1) ? (
                    
                    <TableCell key="משפחה" onClick={()=>{doOrderBy("familyName")}}> 
                      <SwapVertIcon 
                            sx={{ color: orderBy === 'familyName' ? 'blue' : 'lightgray' }}
                    />

                    משפחה </TableCell>

                ) : '' }
                

                {(columns.indexOf("part")!=-1) ? (
                    
                    <TableCell key="מוצר" onClick={()=>{doOrderBy("partDes")}}> 
                      <SwapVertIcon 
                            sx={{ color: orderBy === 'partDes' ? 'blue' : 'lightgray' }}
                    />
                    מוצר </TableCell>

                ) : '' }
             
<TableCell onClick={()=>{doOrderBy("TOTAL")}}  > 
<SwapVertIcon 
                            sx={{ color: orderBy === 'TOTAL' ? 'blue' : 'lightgray' }}
                    />
   סה"כ </TableCell>
<TableCell onClick={()=>{doOrderBy("TOTALQ")}} >  
<SwapVertIcon 
                            sx={{ color: orderBy === 'TOTALQ' ? 'blue' : 'lightgray' }}
                    />
  כמות </TableCell>

  <TableCell> </TableCell>

              </TableRow>
  </TableHead>

<TableBody>    

{(formData.length>1)?(

<TableRow>

    
{ ((columns.indexOf("groupDate_day")!=-1)
   ||(columns.indexOf("groupDate_weel")!=-1)
   ||(columns.indexOf("groupDate_month")!=-1)
   ||(columns.indexOf("groupDate_year")!=-1)
  
  ) ? (
    
    <TableCell key="תאריך"> תאריך </TableCell>

) : '' }               
              
{(columns.indexOf("docName")!=-1) ? (
      
      <TableCell key="מסמך">  </TableCell>

  ) : '' }

  
  {(columns.indexOf("agentName")!=-1) ? (
      
      <TableCell key="סוכן">  </TableCell>

  ) : '' }

  {(columns.indexOf("cust")!=-1) ? (

      <TableCell key="לקוח">  </TableCell>

  ) : '' }



  {(columns.indexOf("familyName")!=-1) ? (
      
      <TableCell key="משפחה">  </TableCell>

  ) : '' }
  

  {(columns.indexOf("part")!=-1) ? (
      
      <TableCell key="מוצר">  </TableCell>

  ) : '' }

<TableCell > <b>{totalV}</b> </TableCell>
<TableCell > <b>{totalA} </b></TableCell>
<TableCell >          </TableCell>
  

</TableRow>

):''}


          

             {formData.map((row, rowIndex) => (
               <TableRow 
               
               key={rowIndex}>



  
  
{(columns.indexOf("groupDate_year")!=-1) ? (
                
                <TableCell 
                sx={{ cursor: 'pointer',direction:'ltr' }}
                onClick={()=>{

                const date = moment(row["groupDate_year"], "YYYY");
                const startOfDayUnix = date.startOf('year').unix();
                const endOfDayUnix = date.endOf('year').unix();

                  setGetDate({
                    "fromDate": startOfDayUnix,
                    "toDate": endOfDayUnix,
                    });
                }} 

                key="תאריך"> {row["groupDate_year"]} </TableCell>

            ) : '' }   




{(columns.indexOf("groupDate_day")!=-1) ? (
                
                <TableCell 
                sx={{ cursor: 'pointer',direction:'ltr' }}
                onClick={()=>{

                const date = moment(row["groupDate_day"], "DD/MM/YY");
                const startOfDayUnix = date.startOf('day').unix();
                const endOfDayUnix = date.endOf('day').unix();

                  setGetDate({
                    "fromDate": startOfDayUnix,
                    "toDate": endOfDayUnix,
                    });
                }} 

                key="תאריך"> {row["groupDate_day"]} </TableCell>

            ) : '' }   



          {(columns.indexOf("groupDate_week")!=-1) ? (
                
                <TableCell 
                sx={{ cursor: 'pointer',direction:'ltr' }}
                onClick={()=>{

                const date = moment(row["groupDate_week"], "YYYY-WW");
                const startOfDayUnix = date.startOf('week').unix();
                const endOfDayUnix = date.endOf('week').unix();

                  setGetDate({
                    "fromDate": startOfDayUnix,
                    "toDate": endOfDayUnix,
                    });
                }} 

                key="תאריך"> {row["groupDate_week"]} </TableCell>

            ) : '' }   



          {(columns.indexOf("groupDate_month")!=-1) ? (
                
                <TableCell 
                sx={{ cursor: 'pointer',direction:'ltr' }}
                onClick={()=>{

                const date = moment(row["groupDate_month"], "MM/YY");
                const startOfDayUnix = date.startOf('month').unix();
                const endOfDayUnix = date.endOf('month').unix();

                  setGetDate({
                    "fromDate": startOfDayUnix,
                    "toDate": endOfDayUnix,
                    });
                }} 

                key="תאריך"> {row["groupDate_month"]} </TableCell>

            ) : '' }   




{(columns.indexOf("docName")!=-1) ? (

<TableCell  

sx={{  cursor: 'pointer' , direction:'ltr' }}

onClick={()=>{



  setGetDocName({
    "docName": row["docName"],
    });
  
  
  


}} 



>{row["docName"]}</TableCell>

) : '' }




{(columns.indexOf("agentName")!=-1) ? (

<TableCell 

sx={{ cursor: 'pointer' ,direction:'rtl'}}
onClick={()=>{



  setGetAgent({
    "agent": row["agent"],
    "agentName": row["agentName"],
    "agentDes": row["agentDes"]
  });
  
  
  


}} >{row["agentName"]} {row["agentDes"]}</TableCell>

) : '' }



{(columns.indexOf("cust")!=-1) ? (

<TableCell 
sx={{ cursor: 'pointer' ,direction:'rtl'}}
onClick={()=>{



  setGetCust({
    "cust": row["cust"],
    "custName": row["custName"],
    "custDes": row["custDes"]
  });
  
  
  


}} >{row["custName"]} {row["custDes"]} </TableCell>

) : '' }




{(columns.indexOf("familyName")!=-1) ? (

<TableCell
sx={{ cursor: 'pointer',direction:'rtl' }}
onClick={()=>{
  setGetFamily({
    "family":row["family"],
    "familyName":row["familyName"],
    "familyDes":row["familyDes"]
})}}


> {row["familyName"]} {row["familyDes"]} </TableCell>

) : '' }


{(columns.indexOf("part")!=-1) ? (

<TableCell 
  sx={{ cursor: 'pointer' ,direction:'rtl'}}

onClick={()=>{

  setGetPart({
    "part":row["part"],
    "partName":row["partName"],
    "partDes":row["partDes"]
})

    

    

  

}}

> {row["partName"]} {row["partDes"]}  </TableCell>

) : '' }


<TableCell 
  sx={{ direction:'ltr'}}

>
     
                   {Number(row['TOTAL'].toFixed(2)).toLocaleString()}
</TableCell>
<TableCell
  sx={{ direction:'ltr'}}

>   
                   {Number(row['TOTALQ'].toFixed(2)).toLocaleString()}
</TableCell>


                  
                  <TableCell>   
                    <ProgressBar percent={(row['TOTAL']/largetsTotal).toFixed(2)*100} />
                </TableCell>

                </TableRow>
              ))}
            </TableBody>


     


          </Table>
        </TableContainer>
      </Container>)}

</Container>
</ThemeProvider>

  );
};

export default Users;

