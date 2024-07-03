import { useEffect, useState } from "react";
import kdb from  "../../kadabrix/kadabrix"

function App() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Fetch initial data
    getCountries();

    // Set up real-time subscription
    const channel = kdb
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'countries' 
        ,filter1: 'name=like.%123%'

    }, payload => {
        console.log('Change received!', payload);
        getCountries();
      })
      .subscribe();

    // Clean up subscription on unmount
    return () => {
      kdb.removeChannel(channel);
    };
  }, []);

  async function getCountries() {
    const { data, error } = await kdb.from("countries").select('*');
    if (error) {
      console.error('Error fetching countries:', error.message);
    } else {
      setCountries(data || []);
    }
  }

  async function addCountry(name) {
    const { data, error } = await kdb.from("countries").insert([{ name }]);
    if (error) {
      console.error('Error adding country:', error.message);
    }
  }

  async function removeCountry(id) {
    const { data, error } = await kdb.from("countries").delete().eq('id', id);
    if (error) {
      console.error('Error removing country:', error.message);
    }
  }

  return (
    <div>
      <ul>
        {countries.map((country) => (
          <li key={country.id}>
            {country.name}
            <button onClick={() => removeCountry(country.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addCountry(prompt('Enter country name:'))}>Add Country</button>
    </div>
  );
}

export default App;
