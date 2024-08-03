import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://djtxhconktrcxgcnlscl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdHhoY29ua3RyY3hnY25sc2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIzMzYxOTMsImV4cCI6MjAzNzkxMjE5M30.27XWFegmMBKNDUclvWjBDwPTQ3Xnhgeduzxm4v8plfI";

const kadabrix = createClient(supabaseUrl, supabaseKey);

kadabrix.run=async function(funcData){

    const ret = await kadabrix.functions.invoke('runkdb',{body:JSON.stringify(funcData)});
    if (ret.data.status=="ok") return ret.data.data
    else throw ret.data.data
}


export default kadabrix;
