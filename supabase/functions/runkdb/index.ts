import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as postgres from 'https://deno.land/x/postgres@v0.17.0/mod.ts'




const supabaseServiceClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)


async function getConfig() {
  
   
      let config = {};

     
        // Fetch data from kadabrix_config
        const { data: configData, error: configError } = await supabaseServiceClient
          .from('kadabrix_config')
          .select('*');

        if (configError) {
          throw new Error('Error fetching kadabrix_config: ' + configError.message);
        }

        // Populate config with default values
        configData.forEach(item => {
          config[item.name] = item.value;
        });

        // Fetch data from kadabix_config_custom collections
        const { data: customConfigData, error: customConfigError } = await supabaseServiceClient
          .from('kadabrix_config_custom')
          .select('*');

        if (customConfigError) {

          throw new Error('Error fetching kadabix_config_custom: ' + customConfigError.message);
        }

        // Override default values with custom values
        customConfigData.forEach(item => {
          config[item.name] = item.value;
        });

        return (config);
}
 


async function getController(module,name,req) {
    
const { data, error } = await supabaseServiceClient
.from('kadabrix_app')
.select('*')
.eq('name', name)
.eq('type', 'CONTROLLER')
.eq('module', module)

 if (data.length==0) {throw new Error(`no such controller : ${module}->${name}`) }

 const appRecord = data[0];
 const serviceConf = JSON.parse(appRecord.config);
 var kdbService = {};
 
 const kdb = getClient(req.headers.get('Authorization'));
 async function check_role(role){

  const res = await kdb.rpc("check_role",{p_desired_role:role})
  if (res.data!=true) throw new Error(`not authorized`) 
 }



 async function runSql(query_text,noSelect = false){
  

  if (noSelect) {
    
    
    const res = await kdb.rpc("execute_user_queryns",{query_text:query_text})
    if (res.error) throw  new Error(JSON.stringify(res.error));
    


  } else {

    const res = await kdb.rpc("execute_user_query",{query_text:query_text})
    if (res.error) throw  new Error(JSON.stringify(res.error));

    if ( res.data ) {
  
        const fres = res.data.map((line)=>line.result)
        return fres
  
    } else {
  
      return res.data;
  
    }



  }

  
 }



 async function runSqlAdmin(query_text,noSelect = false){
  

  if (noSelect) {
    
    
    const res = await supabaseServiceClient.rpc("execute_user_queryns",{query_text:query_text})
    if (res.error) throw  new Error(JSON.stringify(res.error));
    


  } else {

    const res = await supabaseServiceClient.rpc("execute_user_query",{query_text:query_text})
    if (res.error) throw  new Error(JSON.stringify(res.error));

    if ( res.data ) {
  
        const fres = res.data.map((line)=>line.result)
        return fres
  
    } else {
  
      return res.data;
  
    }



  }

  
 }


 

 for (let i=0;i<serviceConf.di.length;i++){

  const di = serviceConf.di[i];
  const diModule = di.module ? di.module : module ;
  const diName = di.name;
  const {appFunction,config} = await getService(diModule,diName,kdbService,kdb,supabaseServiceClient);
  

  

  
  eval(`
      
       kdbService.${diName} =  ${appFunction} ;
          
    `);



 }



 const appFunction = eval('('+ appRecord.data + ')');
 
 return {appFunction,config:appRecord.config};


}


async function getService(module,name,kdbService,kdb,supabaseServiceClient){
    
  const { data, error } = await supabaseServiceClient
  .from('kadabrix_app')
  .select('*')
  .eq('name', name)
  .eq('type', 'SERVICE')
  .eq('module', module)
  
   if (data.length==0) { throw new Error(`no such service : ${module}->${name}`) }
  
   const appRecord = data[0];


 const serviceConf = JSON.parse(appRecord.config);

 for (let i=0;i<serviceConf.di.length;i++){

  const di = serviceConf.di[i];
  const diModule = di.module ? di.module : module ;
  const diName = di.name;
  const {appFunction,config} = await getService(diModule,diName,kdbService,kdb,supabaseServiceClient);
  
  eval(`
      
       kdbService.${diName} =  ${appFunction} ;
          
    `);



 }


   const appFunction = '('+ appRecord.data + ')';
   
   return {appFunction,config:appRecord.config};
  
  
  }
  
  

  
  
 function getClient(authHeader){

return   createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )
  

}



async function  manageFunction(req){
const corsHeaders =  { 
  
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'


  }

  


try {  


   

  const reqData = await req.json()
  const {appFunction,config} = await getController(reqData.module,reqData.name,req);
  const funcRet = await appFunction(reqData.data);
 
  return new Response(JSON.stringify({"status":"ok",data:funcRet}), { headers: corsHeaders})
 
} catch(err) {

  return new Response(JSON.stringify({"status":"error", data:err.message}), 
  
  { headers: corsHeaders })
  

}

}

Deno.serve(manageFunction);
