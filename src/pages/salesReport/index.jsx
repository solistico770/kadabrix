import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import React, { useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import kdb from '../../kadabrix/kadabrix';
import GetPart from "./GetPart";
import GetCust from "./GetCust";
import GetCustType from "./GetCustType";
import GetDateGroup from "./GetDateGroup";
import GetFamily from "./GetFamily";
import GetAgent from "./GetAgent";
import GetDate from "./GetDate";
import GroupBy from "./GroupBy";

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
  
  const [groupAgent, setGroupAgent] = useState(false);
  const [groupCustType,setGroupCustType] = useState(false);
  const [groupCust, setGroupCust] = useState(false);
  const [groupFamily, setGroupFamily] = useState(false);
  const [groupPart, setGroupPart] = useState(false);
  
  const [fromDate, setFromDate] = useState(moment().startOf('month'));
  const [toDate, setToDate] = useState(moment().endOf('month'));

  const [getAgent, setGetAgent] = useState(null);
  const [getCustType, setGetCustType] = useState(null);
  const [getCust, setGetCust] = useState(null);
  const [getFamily, setGetFamily] = useState(null);
  const [getPart, setGetPart] = useState(null);



  const [formData, setFormData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dateGroup, setDateGroup] = useState("month");

  
  
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
              groupAgent:groupAgent,
              groupCustType:groupCustType,
              groupCust:groupCust,
              groupFamily:groupFamily,
              groupPart:groupPart,
              fromDate:fromDate.unix(),
              toDate:toDate.unix(),
              dateGroup:dateGroup
         },
      });
      setLoading(false);
      setFormData(response);
      setTabValue(1);
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


let allStat={

  groupAgent,
  groupCustType,
  groupCust,
  dateGroup,
}

  return (
<Container >

<Tabs aria-label="basic tabs example" value={tabValue} onChange={(event, newValue)=>{setTabValue(newValue);}} >
    <Tab label="חיפוש"/>
    <Tab label="תוצאות"/>
</Tabs>

  

<div   style={{ display: 0 === tabValue ? 'block' : 'none' }}   >

  <Container component="main" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <GetPart state={getPart} setter={setGetPart} />
            <GroupBy  state={groupPart} setter={setGroupPart} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <GetFamily state={getFamily} setter={setGetFamily} />
            <GroupBy  state={groupFamily} setter={setGroupFamily} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <GetCust state={getCust} setter={setGetCust} />
            <GroupBy  state={groupCust} setter={setGroupCust} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <GetCustType state={getCustType} setter={setGetCustType} />
            <GroupBy  state={groupCustType} setter={setGroupCustType} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <GetAgent state={getAgent} setter={setGetAgent} />
            <GroupBy var="groupAgent" state={groupAgent} setter={setGroupAgent} />
          </Paper>
        </Grid>

        
        
        <Grid item xs={12} md={12}>
          <Paper sx={{ padding: 2 }}>
            <GetDate 
              fromDate={fromDate} setFromDate={setFromDate}  
              toDate={toDate} setToDate={setToDate}  
             />
             <GetDateGroup state={dateGroup} setter={setDateGroup}/>
          </Paper>
          
        </Grid>

        


        <Grid item xs={12}>
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <ButtonGroup variant="outlined" aria-label="Basic button group">
              <Button onClick={fetchData}
                sx={{ bgcolor: 'green',color:"white"}}
              >הצג תוצאות</Button>
              
            </ButtonGroup>
          </Paper>
        </Grid>
      </Grid>

     {( loading ? <CircularProgress /> : '')}

    </Container>

  

</div>
<div   style={{ display: 1 === tabValue ? 'block' : 'none' }}   >


  <Container component="section">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                
                {columns.map((column) => (
                  <TableCell key={column}>{column}</TableCell>
                ))}
                {(columns.indexOf(("agent")!=-1)) ? (
                    
                    <TableCell key={column}> סוכן </TableCell>

                ) : '' }

                {(columns.indexOf(("cust")!=-1)) ? (

                    <TableCell key={column}> לקוח </TableCell>

                ) : '' }



                {(columns.indexOf(("family")!=-1)) ? (
                    
                    <TableCell key={column}> משפחה </TableCell>

                ) : '' }
                

                {(columns.indexOf(("part")!=-1)) ? (
                    
                    <TableCell key={column}> מוצר </TableCell>

                ) : '' }
             
<TableCell >  סה"כ </TableCell>
<TableCell >  כמות </TableCell>

                

              </TableRow>
            </TableHead>
            <TableBody>

              {formData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>

{(columns.indexOf(("cust")!=-1)) ? (

<TableCell key={column}> {row["custName"]} {row["custDes"]} </TableCell>

) : '' }



{(columns.indexOf(("family")!=-1)) ? (

<TableCell key={column}> {row["familyName"]} {row["familyDes"]} </TableCell>

) : '' }


{(columns.indexOf(("part")!=-1)) ? (

<TableCell key={column}> {row["partName"]} {row["partDes"]}  </TableCell>

) : '' }


                  
                  <TableCell>   
                    <ProgressBar percent={(row['TOTAL']/largetsTotal).toFixed(2)*100} />
                </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>


</div>






</Container >



  );
};

export default Users;

