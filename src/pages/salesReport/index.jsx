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
  const [doRefresh, setDoRefresh] = useState(false);
  useEffect(()=>{

    if (doRefresh){
      // fetchData();
    }

  },[doRefresh]);



  const [groupAgent, setGroupAgent] = useState(false);
  const [groupCustType,setGroupCustType] = useState(false);
  const [groupCust, setGroupCust] = useState(false);
  const [groupFamily, setGroupFamily] = useState(false);
  const [groupPart, setGroupPart] = useState(false);
  const [groupDocname, setGroupDocname] = useState(false);
  
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
  const [dateGroup, setDateGroup] = useState("none");
/*

  useEffect(() => {

      fetchData();

  
  }, [groupAgent,groupCust,groupPart,groupFamily,getAgent,getCustType,getCust,getFamily,getPart,fromDate,toDate]);

  */
  
  
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
              groupDocname:groupDocname,
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

  
  let totalV = formData.reduce((max, entry) => {
    return entry.TOTAL+max
  },0).toFixed(0);

  let totalA = formData.reduce((max, entry) => {
    return entry.TOTALQ+ max;
  },0).toFixed(0);



let allStat={

  groupAgent,
  groupCustType,
  groupCust,
  dateGroup,
}

  return (
<Container >
    !!!!!!!!!!123
  <Container component="main" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
       
        
        <Grid item xs={12} md={12}>
        <Paper sx={{ padding: 2 }}>
        <GetPart state={getPart} setter={setGetPart} />
        <GroupBy  state={groupPart} setter={setGroupPart} />
        <GetFamily state={getFamily} setter={setGetFamily} />
        <GroupBy  state={groupFamily} setter={setGroupFamily} />
        <GetCust state={getCust} setter={setGetCust} />
        <GroupBy  state={groupCust} setter={setGroupCust} />
        <GetAgent state={getAgent} setter={setGetAgent} />
        <GroupBy var="groupAgent" state={groupAgent} setter={setGroupAgent} />
        
      <Box>
        קבץ לפי מסמך 
        <GroupBy var="groupDocname" state={groupDocname} setter={setGroupDocname} />
      </Box>

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

  



  <Container component="section">
  
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                
              {(columns.indexOf("dateGroup")!=-1) ? (
                    
                    <TableCell key="תאריך"> תאריך </TableCell>

                ) : '' }

              {(columns.indexOf("docName")!=-1) ? (
                    
                    <TableCell key="סוכן"> מסמך </TableCell>

                ) : '' }

                
                {(columns.indexOf("agentName")!=-1) ? (
                    
                    <TableCell key="סוכן"> סוכן </TableCell>

                ) : '' }

                {(columns.indexOf("cust")!=-1) ? (

                    <TableCell key="לקוח"> לקוח </TableCell>

                ) : '' }



                {(columns.indexOf("familyName")!=-1) ? (
                    
                    <TableCell key="משפחה"> משפחה </TableCell>

                ) : '' }
                

                {(columns.indexOf("part")!=-1) ? (
                    
                    <TableCell key="מוצר"> מוצר </TableCell>

                ) : '' }
             
<TableCell >  סה"כ </TableCell>
<TableCell >  כמות </TableCell>

                

              </TableRow>
  </TableHead>

<TableBody>    

{(formData.lengt>1)?(

<TableRow>

    
{(columns.indexOf("dateGroup")!=-1) ? (
    
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



  
          {(columns.indexOf("dateGroup")!=-1) ? (
                
                <TableCell key="תאריך"> {row["dateGroup"]} </TableCell>

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

<TableCell > {row["familyName"]} {row["familyDes"]} </TableCell>

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
                   {row['TOTAL'].toFixed(2)}
</TableCell>
<TableCell>   
                   {row['TOTALQ'].toFixed(2)}
</TableCell>


                  
                  <TableCell>   
                    <ProgressBar percent={(row['TOTAL']/largetsTotal).toFixed(2)*100} />
                </TableCell>

                </TableRow>
              ))}
            </TableBody>


     


          </Table>
        </TableContainer>
      </Container>





</Container >



  );
};

export default Users;

