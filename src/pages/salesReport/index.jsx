import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import kdb from '../../kadabrix/kadabrix';
import GetPart from "./GetPart";
import GetCust from "./GetCust";
import GetAgent from "./GetAgent";
import GetDate from "./GetDate";
import GroupBy from "./GroupBy";


const Users = () => {
  
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState([]);

  
  const fetchData = async () => {
    try {
      const response = await kdb.run({
        module: 'salesReport',
        name: 'getReport',
        data: { search: formState },
      });

      setFormData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      
    }
  };

  const columns = formData.length > 0 ? Object.keys(formData[0]) : [];

  return (
<Container >
  
{JSON.stringify(formState)}


<li/>
<Container component="section" >
  <GetPart state={formState} setter={setFormState}/>
  <GroupBy var="groupPart" state={formState} setter={setFormState}/>
</Container>

<br/>
<Container component="section" >
  <GetCust state={formState} setter={setFormState}/>
  <GroupBy var="groupCust" state={formState} setter={setFormState}/>
</Container>

<Container component="section" >
  <GetAgent state={formState} setter={setFormState}/>
  <GroupBy var="groupAgent" state={formState} setter={setFormState}/>
</Container>


<Container component="section" >
    
 <GetDate state={formState} setter={setFormState} />

</Container>

<Container component="section" >
  <ButtonGroup variant="outlined" aria-label="Basic button group">
    <Button onClick={fetchData}>הפעל</Button>
    <Button>נקה</Button>
  </ButtonGroup>
</Container>
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


    </Container >



  );
};

export default Users;
