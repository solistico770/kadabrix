import { createClient } from "@supabase/supabase-js";
import {supabaseUrl,supabaseKey} from "./kdbConfig"

const kadabrix = createClient(supabaseUrl, supabaseKey);

kadabrix.run=async function(funcData){
    const ret = await kadabrix.functions.invoke('runkdb',{body:JSON.stringify(funcData)});
    if (ret.data.status=="ok") return ret.data.data
    else throw ret.data.data
}

export default kadabrix;
