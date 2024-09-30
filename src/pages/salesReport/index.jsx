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
 
  const [fromDate, setFromDate] = useState(moment().startOf('month'));
  const [toDate, setToDate] = useState(moment().endOf('month'));

  const [getAgent, setGetAgent] = useState(null);
  const [getCustType, setGetCustType] = useState(null);
  const [getCust, setGetCust] = useState(null);
  const [getFamily, setGetFamily] = useState(null);
  const [getPart, setGetPart] = useState(null);

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
              getAgent:getAgent,
              getCustType:getCustType,
              getCust:getCust,
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
  <Container> 

  
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
      <GetSelectedCust state={getCust} setter={setGetCust} />
      <GetSelectedPart state={getPart} setter={setGetPart} />
      <GetSelectedAgent state={getAgent} setter={setGetAgent} />
      <GetSelectedFamily state={getFamily} setter={setGetFamily} />
    </Box>

    <Box>
    

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
          <Table>
            <TableHead>
              <TableRow >
                
              {(columns.indexOf("groupDate")!=-1) ? (
                    
                    <TableCell key="תאריך" onClick={()=>{doOrderBy("groupDate")}}> 
                    <SwapVertIcon 
                            style={{ color: orderBy === 'groupDate' ? 'blue' : 'lightgray' }}
                    />
                     תאריך </TableCell>

                ) : '' }


              {(columns.indexOf("docName")!=-1) ? (
                    
                    <TableCell key="מסמך" onClick={()=>{doOrderBy("docName")}}> 
                     <SwapVertIcon 
                            style={{ color: orderBy === 'docName' ? 'blue' : 'lightgray' }}
                    />
                    מסמך </TableCell>
                    

                ) : '' }

                
                {(columns.indexOf("agentName")!=-1) ? (
                    
                    <TableCell key="סוכן" onClick={()=>{doOrderBy("agentDes")}}> 
                      <SwapVertIcon 
                            style={{ color: orderBy === 'agentDes' ? 'blue' : 'lightgray' }}
                    />

                    סוכן </TableCell>

                ) : '' }

                {(columns.indexOf("cust")!=-1) ? (

                    <TableCell key="לקוח" onClick={()=>{doOrderBy("custDes")}}> 
                      <SwapVertIcon 
                            style={{ color: orderBy === 'custDes' ? 'blue' : 'lightgray' }}
                    />
                    לקוח </TableCell>

                ) : '' }



                {(columns.indexOf("familyName")!=-1) ? (
                    
                    <TableCell key="משפחה" onClick={()=>{doOrderBy("familyName")}}> 
                      <SwapVertIcon 
                            style={{ color: orderBy === 'familyName' ? 'blue' : 'lightgray' }}
                    />

                    משפחה </TableCell>

                ) : '' }
                

                {(columns.indexOf("part")!=-1) ? (
                    
                    <TableCell key="מוצר" onClick={()=>{doOrderBy("partDes")}}> 
                      <SwapVertIcon 
                            style={{ color: orderBy === 'partDes' ? 'blue' : 'lightgray' }}
                    />
                    מוצר </TableCell>

                ) : '' }
             
<TableCell onClick={()=>{doOrderBy("TOTAL")}}  > 
<SwapVertIcon 
                            style={{ color: orderBy === 'TOTAL' ? 'blue' : 'lightgray' }}
                    />
   סה"כ </TableCell>
<TableCell onClick={()=>{doOrderBy("TOTALQ")}} >  
<SwapVertIcon 
                            style={{ color: orderBy === 'TOTALQ' ? 'blue' : 'lightgray' }}
                    />
  כמות </TableCell>

  <TableCell> </TableCell>

              </TableRow>
  </TableHead>

<TableBody>    

{(formData.length>1)?(

<TableRow>

    
{(columns.indexOf("groupDate")!=-1) ? (
    
    <TableCell key="תאריך"> תאריך </TableCell>

) : '' }               
              
{(columns.indexOf("docName")!=-1) ? (
      
      <TableCell key="סוכן">  </TableCell>

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
               <TableRow key={rowIndex}>



  
          {(columns.indexOf("groupDate")!=-1) ? (
                
                <TableCell key="תאריך"> {row["groupDate"]} </TableCell>

            ) : '' }   

{(columns.indexOf("docName")!=-1) ? (

<TableCell  >{row["docName"]}</TableCell>

) : '' }




{(columns.indexOf("agentName")!=-1) ? (

<TableCell onClick={()=>{



  setGetAgent({
    "agent": row["agent"],
    "agentName": row["agentName"],
    "agentDes": row["agentDes"]
  });
  
  
  


}} >{row["agentName"]} {row["agentDes"]}</TableCell>

) : '' }



{(columns.indexOf("cust")!=-1) ? (

<TableCell onClick={()=>{



  setGetCust({
    "cust": row["cust"],
    "custName": row["custName"],
    "custDes": row["custDes"]
  });
  
  
  


}} >{row["custName"]} {row["custDes"]} </TableCell>

) : '' }




{(columns.indexOf("familyName")!=-1) ? (

<TableCell

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
  

onClick={()=>{

  setGetPart({
    "part":row["part"],
    "partName":row["partName"],
    "partDes":row["partDes"]
})

    

    

  

}}

> {row["partName"]} {row["partDes"]}  </TableCell>

) : '' }


<TableCell>   
                   {Number(row['TOTAL'].toFixed(2)).toLocaleString()}
</TableCell>
<TableCell>   
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

  );
};

export default Users;

