import { useEffect, useState } from "react";
import kdb from "../../kadabrix/kadabrix";

function App() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Fetch initial data
    getCountries();

    // Set up real-time subscription
    const channel = kdb
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'countries' }, payload => {
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
    const query = `SELECT * FROM countries`;
    const { data, error } = await kdb.rpc('execute_user_query', { query_text: query });
    if (error) {
      console.error('Error fetching countries:', error.message);
    } else {
      setCountries(data.map(item => item.result.val) || []);
    }
  }

  async function addCountry(name) {
    const query = `INSERT INTO countries (name) VALUES ('${name}') RETURNING *`;
    const { data, error } = await kdb.rpc('execute_user_query', { query_text: query });
    if (error) {
      console.error('Error adding country:', error.message);
    } else {
      getCountries(); // Refresh the list after adding
    }
  }

  async function removeCountry(id) {
    const query = `DELETE FROM countries WHERE id = ${id} RETURNING *`;
    const { data, error } = await kdb.rpc('execute_user_query', { query_text: query });
    if (error) {
      console.error('Error removing country:', error.message);
    } else {
      getCountries(); // Refresh the list after removing
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
