import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as postgres from 'https://deno.land/x/postgres@v0.17.0/mod.ts'


const getTransactionPoolerAddress = () => {

  return Deno.env.get("DB_POOLER");

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


 

 async function getConfig(userName) {
  const connection = await dbPool.connect();
  let configResult;

  try {
    const result = await connection.queryObject(
      `
      SELECT 
        COALESCE(kadabrix_config_custom.name, kadabrix_config.name) AS name,
        kadabrix_config.value AS config_value,
        kadabrix_config.protected,
        kadabrix_config_custom.value AS custom_value,
        kadabrix_config_role.value AS role_value,
        kadabrix_config_user.value AS user_value
      FROM 
        kadabrix_config_custom
      FULL OUTER JOIN kadabrix_config 
        ON kadabrix_config_custom.name = kadabrix_config.name
      LEFT JOIN kadabrix_user_roles 
        ON kadabrix_user_roles.email = $userName::text
      LEFT JOIN kadabrix_config_role 
        ON COALESCE(kadabrix_config_custom.name, kadabrix_config.name) = kadabrix_config_role.name
        AND kadabrix_config_role.role = kadabrix_user_roles.role
      LEFT JOIN kadabrix_config_user 
        ON COALESCE(kadabrix_config_custom.name, kadabrix_config.name) = kadabrix_config_user.name
        AND kadabrix_config_user.user = $userName::text
      `,
      {
        userName,
      }
    );
    configResult = result.rows;
  } finally {
    connection.release();
  }

  let config = {};
  let configProtected = {};

  configResult.forEach((dataItem) => {
    // Determine the final value based on priority: user > role > custom > config
    const finalValue =
      dataItem.user_value !== null
        ? dataItem.user_value
        : dataItem.role_value !== null
        ? dataItem.role_value
        : dataItem.custom_value !== null
        ? dataItem.custom_value
        : dataItem.config_value;

    // Separate into protected and non-protected configurations
    if (dataItem.protected) {
      configProtected[dataItem.name] = finalValue;
    } else {
      config[dataItem.name] = finalValue;
    }
  });

  return { config, configProtected };
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
