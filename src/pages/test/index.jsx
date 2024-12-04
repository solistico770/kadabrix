import "./index.css"
import eventBus from "../../kadabrix/event"
const App = () => {
const  emit = async ()=>{

  try {
    await eventBus.emit("prePlaceOrder", "demsg");
    console.log("Order placed successfully");
  } catch (error) {
    console.error(error.message);
  }


}




  return (
    <div className="app-container">
    

    <button onClick={emit}>Cat 1</button>


    </div>
  );
};

export default App;
