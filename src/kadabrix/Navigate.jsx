import { useEffect } from 'react';
import eventBus from './event';
import { useNavigate } from 'react-router-dom';


const Navigate = (props) => {

    
  const navigate = useNavigate();


useEffect(() => {  
     
     const navi = eventBus.on("navigate", (payload) => {
        navigate(payload);
      });

    return () => {
        navi();
    }    
}, []);


  return (
    <> </>
  );

};


export default Navigate;
