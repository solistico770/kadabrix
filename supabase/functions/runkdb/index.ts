import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as postgres from 'https://deno.land/x/postgres@v0.17.0/mod.ts'
import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";





const getTransactionPoolerAddress = () => {
  const TPtable = {
    "heuayknlgusdwimnjbgs": "aws-0-eu-west-1",
    "fbpmgiezamyfmlglkqcb": "aws-0-eu-central-1",
    "ndlnbrybztgnhlqkwxra": "aws-0-us-west-1",
  };

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!supabaseUrl) throw new Error("SUPABASE_URL is not set.");

  const projectRef = supabaseUrl.match(/https:\/\/(.+?)\.supabase\.co/)?.[1];
  if (!projectRef) throw new Error("Invalid SUPABASE_URL format.");

  const poolerAddress = TPtable[projectRef];
  if (!poolerAddress) throw new Error(`No TP found for ref: ${projectRef}`);

  return poolerAddress;
};

const getPooler = () => {
  const supabaseDbUrl = Deno.env.get("SUPABASE_DB_URL");
  if (!supabaseDbUrl) throw new Error("SUPABASE_DB_URL is not set.");

  const regex =
    /^postgres:\/\/([^:]+):([^@]+)@([^\.]+)\.([^\.]+)\.([^:\/]+):(\d+)\/([^?]+)/;
  const match = supabaseDbUrl.match(regex);
  if (!match) throw new Error("Invalid SUPABASE_DB_URL format.");

  const [, username, password, , deployment, , , database] = match;
  const tpAddress = getTransactionPoolerAddress();

  return `postgresql://${username}.${deployment}:${password}@${tpAddress}.pooler.supabase.com:6543/${database}`;
};


const dbPool = new postgres.Pool(getPooler(), 3, true)


const supabaseServiceClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)


async function getController(module,name,req) {
  const { data: customData, error: customError } = await supabaseServiceClient
  .from('kadabrix_app_custom')
  .select('*')
  .eq('name', name)
  .eq('type', 'CONTROLLER')
  .eq('module', module);

if (customError) {
  throw new Error(`Error querying kadabrix_app_custom: ${customError.message}`);
}

let appRecord;

if (customData && customData.length > 0) {
  // Use the record from kadabrix_app_custom if it exists
  appRecord = customData[0];
} else {
  // Fall back to kadabrix_app if no record is found in kadabrix_app_custom
  const { data, error } = await supabaseServiceClient
    .from('kadabrix_app')
    .select('*')
    .eq('name', name)
    .eq('type', 'CONTROLLER')
    .eq('module', module);

  if (error) {
    throw new Error(`Error querying kadabrix_app: ${error.message}`);
  }

  if (data.length === 0) {
    throw new Error(`No such controller: ${module}->${name}`);
  }

  appRecord = data[0];
}


 const serviceConf = JSON.parse(appRecord.config);
 var kdbService = {};
 
 const kdb = getClient(req.headers.get('Authorization'));
 let userData = await kdb.auth.getUser();
 kdb.userName = await userData?.data?.user?.email;
 const {config,configProtected} = await getConfig(kdb.userName ? kdb.userName : '');
 kdb.config = config;
 kdb.configProtected = configProtected;
 


 let rolesCache = null;
  async function get_roles(){
  if (rolesCache) return rolesCache.data;
  rolesCache =   await kdb.rpc("get_roles_by_email",{});
  return rolesCache.data;

 } 

 async function check_role(role){
  const roles = await get_roles();
  if (roles.includes(role)) return true;
  else throw new Error(`not authorized`);


 }


 let permissionsCache = null;
  async function get_permissions(){
  if (permissionsCache) return permissionsCache.data;
  permissionsCache =   await kdb.rpc("get_permissions_by_email",{});
  return permissionsCache.data;
 } 

 async function check_permission(permission){
  const permissions = await get_permissions();
  if (permissions.includes(permission)) return true;
  else throw new Error(`not authorized`);


 }


 

 
async function getConfig(userName){
 

  const connection = await dbPool.connect()
  let configResult;

  try {
    const result = await connection.queryObject(`
        
        
        
SELECT kadabrix_config.*,
kadabrix_config_role.value as rvalue ,
kadabrix_config_user.value as uvalue 
FROM 
  kadabrix_config
  left join kadabrix_user_roles on kadabrix_user_roles.email =  $userName::text   
  left join kadabrix_config_role on kadabrix_config.name = kadabrix_config_role.name 
      and kadabrix_config_role.role = kadabrix_user_roles.role
  left join kadabrix_config_user on kadabrix_config.name = kadabrix_config_user.name 
  and kadabrix_config_user.user  = $userName::text
  
      `,{
        userName:kdb.userName

      })
      configResult =  result.rows;
  } finally {
      connection.release()
  }

  
let config={}
let configProtected={}
configResult.forEach(dataItem => {
  if (dataItem.protected) {
    configProtected[dataItem.name] = dataItem.value !== null 
          ? dataItem.value 
          : (dataItem.rvalue !== null 
              ? dataItem.rvalue 
              : dataItem.uvalue);
        }
  });


  configResult.forEach(dataItem => {
  if (!dataItem.protected) {
      config[dataItem.name] = dataItem.value !== null 
          ? dataItem.value 
          : (dataItem.rvalue !== null 
              ? dataItem.rvalue 
              : dataItem.uvalue);
        }
  });
  
return {config,configProtected};


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
  const { data: customData, error: customError } = await supabaseServiceClient
  .from('kadabrix_app_custom')
  .select('*')
  .eq('name', name)
  .eq('type', 'SERVICE')
  .eq('module', module);

if (customError) {
  throw new Error(`Error querying kadabrix_app_custom: ${customError.message}`);
}

let appRecord;

if (customData && customData.length > 0) {
  // Use the record from kadabrix_app_custom if it exists
  appRecord = customData[0];
} else {
  // Fall back to kadabrix_app if no record is found in kadabrix_app_custom
  const { data, error } = await supabaseServiceClient
    .from('kadabrix_app')
    .select('*')
    .eq('name', name)
    .eq('type', 'SERVICE')
    .eq('module', module);

  if (error) {
    throw new Error(`Error querying kadabrix_app: ${error.message}`);
  }

  if (data.length === 0) {
    throw new Error(`No such service: ${module}->${name}`);
  }

  appRecord = data[0];
}


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

  return new Response(
    
    JSON.stringify({
      status: "error",
      data: err.message,
      trace: err.stack,
    })
    , 
  
  { headers: corsHeaders })
  

}

}

Deno.serve(manageFunction);
