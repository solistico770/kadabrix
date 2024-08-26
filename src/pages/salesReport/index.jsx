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
import GetFamily from "./GetFamily";
import GetAgent from "./GetAgent";
import GetDate from "./GetDate";
import GroupBy from "./GroupBy";
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment';
import 'moment-timezone';
import { Container, Grid, Paper, Button } from '@mui/material';


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

  return (
<Container >

<Tabs aria-label="basic tabs example" value={tabValue} onChange={(event, newValue)=>{setTabValue(newValue);}} >
    <Tab label="חיפוש"/>
    <Tab label="תוצאות"/>
</Tabs>

  

{tabValue!=0?'':(<div>

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
          </Paper>
        </Grid>
    


        <Grid item xs={12}>
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <ButtonGroup variant="outlined" aria-label="Basic button group">
              <Button onClick={fetchData}>הצג תוצאות</Button>
              
            </ButtonGroup>
          </Paper>
        </Grid>
      </Grid>

     {( loading ? <CircularProgress /> : '')}

    </Container>

  

</div>)}
{tabValue!=1?'':(<div>


  <Container component="section">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={column}>{row[column]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>


</div>)}






</Container >



  );
};

export default Users;

