import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://heuayknlgusdwimnjbgs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhldWF5a25sZ3VzZHdpbW5qYmdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzMjQ2ODAsImV4cCI6MjAzNDkwMDY4MH0.4Reqq1Cwh4F2BWunNplzjD5cZOHCzGp0111MoJ3mBvE";

const kadabrix = createClient(supabaseUrl, supabaseKey);

kadabrix.run=async function(funcData){

    const ret = await kadabrix.functions.invoke('runkdb',{body:JSON.stringify(funcData)});
    if (ret.data.status=="ok") return ret.data.data
    else throw ret.data.data
}


export default kadabrix;
