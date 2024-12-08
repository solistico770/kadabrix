import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Box, Typography, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import kdb from '../../kadabrix/kadabrix';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/ext-language_tools";
import ace from "ace-builds";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";
import Modal from '@mui/material/Modal';
import JsonModal from './JsonModal';



const Users = () => {

  ace.config.loadModule("ace/ext/language_tools", function () {
    var customCompleter = {
        getCompletions: function (editor, session, pos, prefix, callback) {
            const completions = [
                { caption: "function", value: "function", meta: "keyword" },
                { caption: "console.log", value: "console.log()", meta: "method" },
            ];
            callback(null, completions);
        },
    };
    ace.require("ace/ext/language_tools").addCompleter(customCompleter);
});


  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(null);
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorItem, setEditorItem] = useState({});
  const [editorText, setEditorText] = useState("");

  const [lines, setLines] = useState([]);
  const [linesSearch, setLinesSearch] = useState([]); 
  const [searchType, setSearchType] = useState();
  const [searchName, setSearchName ]  = useState();
  const [searchModule, setSearchModule] = useState();
  const [searchAll, setSearchAll] = useState();

  const searchInLines = (searchCriteria, searchAll, lines) => {
    const lowerCaseSearchAll = searchAll ? searchAll.toLowerCase() : null;
    const lowerCaseCriteria = Object.fromEntries(
        Object.entries(searchCriteria).map(([key, value]) => [key, value ? value.toLowerCase() : ''])
    );

    return lines.filter((line) => {
        // If searchAll is specified, check that at least one field contains it (case-insensitive)
        if (lowerCaseSearchAll) {
            const matchAll = Object.values(line).some((field) =>
                typeof field === 'string' && field.toLowerCase().includes(lowerCaseSearchAll)
            );
            if (!matchAll) return false;
        }

        // Otherwise, match based on specific fields in searchCriteria
        return Object.keys(lowerCaseCriteria).every((key) => {
            const criteria = lowerCaseCriteria[key];
            return !criteria || (line[key] && line[key].toLowerCase().includes(criteria));
        });
    });
};


  
  useEffect(()=>{

    let filtered  = searchInLines({
        "type":searchType,
        "name":searchName,
        "module":searchModule,

    },searchAll,lines)

    setLinesSearch(filtered);

    
  }
  ,[lines,searchType,searchName,searchModule,searchAll])


  const fetchApp = async () => {
    try {
      const data = await kdb.run({
        "module": "codeEditor",
        "name": "getRecords"
      });

      setLines(data);
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    fetchApp();
  }, []);

  
const handleisEditorOpen = () => {
  setIsEditorOpen(false);
}

const openEditor = (record)=>{

  setEditorItem(record);
  setEditorText(record.data)
  setIsEditorOpen(true);
}

const doSave = async (record)=>{

  const data = await kdb.run({
    "module": "codeEditor",
    "name": "saveRecord",
    "data":editorItem
  });

  fetchApp();
  //setIsEditorOpen(false);


}

const doDelete = async ()=>{
  const data = await kdb.run({
    "module": "codeEditor",
    "name": "delRecord",
    "data":{
      id:editorItem.id
    }
  });
}


const addRecord = async (record)=>{
  const data = await kdb.run({
    "module": "codeEditor",
    "name": "addRecord",
    "data":{
        type:searchType,
        name:searchName,
        module:searchModule,
    }
  });
  fetchApp();
}





  return (
    <div dir="ltr">
<JsonModal jsonData={linesSearch} onImport={fetchApp} />

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 8,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        Code Editor
      </Typography>
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}

<Modal
  open={isEditorOpen}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box
    sx={{
      backgroundColor: '#fff', // Desired background color
      borderRadius: '8px',
      boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
      padding: '16px',
      width: '95%',
      height: '95%', // Set the height to 95%
      maxWidth: '95vw', // Ensure it doesn't exceed the viewport width
      maxHeight: '95vh', // Ensure it doesn't exceed the viewport height
      margin: 'auto',
      overflow: 'auto', // Enable scrolling if content overflows
      position: 'absolute', // Positioning for centering
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)', // Center the modal
    }}
  >
    <Box>
      <Button onClick={() => setIsEditorOpen(false)}>Close</Button>
      <Button onClick={() => doSave()}>Save</Button>
      <Button onClick={() => doDelete()}>Delete</Button>
    </Box>
    <Box>
      <TextField
        label="Type"
        value={editorItem.type}
        onChange={(e) => { setEditorItem({ ...editorItem, type: e.target.value }); }}
      />
      <TextField
        label="Module"
        value={editorItem.module}
        onChange={(e) => { setEditorItem({ ...editorItem, module: e.target.value }); }}
      />
      <TextField
        label="Name"
        value={editorItem.name}
        onChange={(e) => { setEditorItem({ ...editorItem, name: e.target.value }); }}
      />
      <TextField
        label="Config"
        multiline
        maxRows={isFocused ? 10 : 1} // Expand to 4 rows on focus, collapse to 1 line otherwise
        onFocus={() => setIsFocused(true)} // Expand when focused
        onBlur={() => setIsFocused(false)} // Collapse when unfocused
        inputProps={{ style: { direction: 'ltr' } }}

        value={editorItem.config}
        onChange={(e) => { setEditorItem({ ...editorItem, config: e.target.value }); }}
      />
    </Box>
    <Box>
    <AceEditor
  mode="javascript"
  theme="monokai"
  width="100%"
  height={window.innerHeight + "px"}
  value={editorItem.data}
  onChange={(newValue) => setEditorItem({ ...editorItem, data: newValue })}
  name="UNIQUE_ID_OF_DIV"
  editorProps={{ $blockScrolling: true }}
  setOptions={{
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
    fontSize: '40px'

  }}
  commands={[
    {
      name: "search",
      bindKey: { win: "Ctrl-F", mac: "Command-F" },
      exec: (editor) => {
        editor.execCommand("find");
      },
    },
  ]}
/>

    </Box>
  </Box>
</Modal>



      <TableContainer component={Paper}>
        <Table>
          <TableHead>
          
          <TableRow>
              <TableCell><TextField onChange={(e)=>{setSearchType(e.target.value)}}/></TableCell>
              <TableCell><TextField onChange={(e)=>{setSearchModule(e.target.value)}}/></TableCell>
              <TableCell><TextField onChange={(e)=>{setSearchName(e.target.value)}}/></TableCell>
              <TableCell><TextField onChange={(e)=>{setSearchAll(e.target.value)}}/> </TableCell>
              <TableCell>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<span>+</span>} 
        onClick={() => addRecord()}
        sx={{ mb: 2 }}
      >
        Add Row
      </Button>
</TableCell>
        </TableRow>
          


            <TableRow>
              <TableCell>סוג</TableCell>
              <TableCell>מודול</TableCell>
              <TableCell>שם</TableCell>
              <TableCell>DI</TableCell>
              <TableCell>קוד</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {linesSearch.map((line) => (
              <TableRow key={line.email}>
                
                <TableCell>{line.type}</TableCell>
                <TableCell>{line.module}</TableCell>
                <TableCell>{line.name}</TableCell>
                <TableCell>{line.description}</TableCell>
                <TableCell><Button onClick={()=>{

                    openEditor(line);

                }}>ערוך</Button></TableCell>
                </TableRow>
            ))}
          </TableBody>

          
        </Table>
      </TableContainer>
    </Box>
    </div>
  );
};

export default Users;
