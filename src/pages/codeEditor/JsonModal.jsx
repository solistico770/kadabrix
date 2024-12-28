import kdb from '../../kadabrix/kadabrix';
import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';

const JsonModal = ({ jsonData, onImport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editorValue, setEditorValue] = useState(JSON.stringify(jsonData, null, 2));
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {    

    setEditorValue(JSON.stringify(jsonData, null, 2))

  }    , [jsonData]);


  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleImport = async () => {
    const parsedData = JSON.parse(editorValue);
    for (let i = 0; i < parsedData.length; i++) {
        const item = parsedData[i];

        await kdb.run({
            "module": "codeEditor",
            "name": "addRecord",
            "data":{
                isDuplicate:isDuplicate,
                record:item
            }
          });


    }

    onImport && onImport(parsedData, isDuplicate);
    handleClose();
  };

  const handleSwitchChange = (event) => setIsDuplicate(event.target.checked);

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        JSON 
      </Button>
      <Modal open={isOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit JSON Data
          </Typography>
          <AceEditor
            mode="json"
            theme="github"
            value={editorValue}
            onChange={(value) => setEditorValue(value)}
            name="json-editor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="300px"
          />
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Switch checked={isDuplicate} onChange={handleSwitchChange} />
              <Typography variant="body2" component="span">
                Duplicate
              </Typography>
            </Box>
            <Box>
              <Button onClick={handleClose} sx={{ mr: 2 }}>
                Close
              </Button>
              <Button variant="contained" onClick={handleImport}>
                Import
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default JsonModal;
