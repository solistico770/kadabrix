import DataTableScreen from '../../../kadabrix/dataTable/index.jsx';
import eventBus from "../../../kadabrix/event.js"
import { User } from 'lucide-react'; // דוגמה לאייקון, תוכל לשנות לפי הצורך
import kdb from '../../../kadabrix/kadabrix.js';
import openDialog from "./detailsBar/index.jsx"


  // Select a customer
  const handleSelect = async (cust) => {
    debugger;
    try {
      await kdb.run({
        module: 'repSelectCust',
        name: 'updateSelectedCustomer',
        data: { custName: cust.custName },
      });
      eventBus.emit("toast", { 
        title: "לקוח נבחר", 
        text: `${cust.custName} ${cust.custDes}` 
      });
      eventBus.emit("navigate", config.defaultScreen);
    } catch (error) {
      console.error('Failed to select customer:', error);
      eventBus.emit("toast", { title: "שגיאה", text: "אירעה שגיאה בבחירת הלקוח" });
    } finally {

    }
  };


const config = 

{
  "screenName": "capi",
  "apiName": {
    "module": "test",
    "name": "capi"
  },
  "fields": [

   
   
    {
      fieldName: "selectCust",
      title: "בחר לקוח", // כותרת לעמודה
      order: 0, // מיקום ראשון בטבלה
      dVisible: true, // מוצג בטבלה
      dOrder: false, // לא ניתן למיון
      dSearchable: false, // לא ניתן לחיפוש
      onclick: (row) => {

        
        handleSelect(row)

      }, // פונקציה שתופעל בלחיצה
      text: (
        <button className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-all duration-300">
          <User size={20} />
        </button>
      ) // רכיב הכפתור עם אייקון
    },
    {
      fieldName: "details",
      title: "פרטים נוספים", // כותרת לעמודה
      order: 0, // מיקום ראשון בטבלה
      dVisible: true, // מוצג בטבלה
      dOrder: false, // לא ניתן למיון
      dSearchable: false, // לא ניתן לחיפוש
      onclick: (row) => openDialog(row.cust), // פונקציה שתופעל בלחיצה
      text: (
        <button className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-all duration-300">
          <User size={20} />
        </button>
      ) // רכיב הכפתור עם אייקון
    },
    
    {
      "fieldName": "custDes",
      "src": "custDes",
      "order": 1,
      "dVisible": true,
      "dOrder": true,
      "dSearchable": true,
      "title": "תיאור לקוח",
      "type": "text"
      
    },
    {
      "fieldName": "custName",
      "src": "custName",
      "order": 2,
      "dVisible": true,
      "dOrder": true,
      "dSearchable": true,
      "title": "מספר לקוח",
      "type": "number"
    },
    {
      "fieldName": "address",
      "src": "address",
      "order": 3,
      "dVisible": true,
      "dOrder": true,
      "dSearchable": true,
      "title": "כתובת",
      "type": "text"
    },
    {
      "fieldName": "city",
      "src": "city",
      "order": 4,
      "dVisible": true,
      "dOrder": true,
      "dSearchable": true,
      "title": "עיר",
      "type": "text"
    },
    {
      "fieldName": "phone",
      "src": "phone",
      "order": 5,
      "dVisible": true,
      "dOrder": true,
      "dSearchable": true,
      "title": "טלפון",
      "type": "text"
    },
    {
      "fieldName": "ctypeDes",
      "src": "ctypeDes",
      "order": 6,
      "dVisible": true,
      "dOrder": true,
      "dSearchable": true,
      "title": "סוג לקוח",
      "type": "text"
    },
    {
      "fieldName": "taxNum",
      "src": "taxNum",
      "order": 7,
      "dVisible": true,
      "dOrder": false,
      "dSearchable": false,
      "title": "מספר מס",
      "type": "number"
    },
    {
      "fieldName": "balance",
      "src": "balance",
      "order": 8,
      "dVisible": true,
      "dOrder": true,
      "dSearchable": false,
      "title": "יתרה",
      "type": "number"
    },
    {
      "fieldName": "obligo",
      "src": "obligo",
      "order": 9,
      "dVisible": true,
      "dOrder": true,
      "dSearchable": false,
      "title": "אובליגו",
      "type": "number"
    },
    {
      "fieldName": "maxObligo",
      "src": "maxObligo",
      "order": 10,
      "dVisible": true,
      "dOrder": true,
      "dSearchable": false,
      "title": "מקסימום אובליגו",
      "type": "number"
    }
    
  ]
}





function App() {
  return (
    <DataTableScreen config={config} />
  );
}

export default App