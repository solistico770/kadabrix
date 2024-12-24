import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as postgres from 'https://deno.land/x/postgres@v0.17.0/mod.ts'
import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";


const supabaseServiceClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)


 




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


 

 async function runSqlJ(query_text,jsonElement,noSelect = false){
  

  if (noSelect) {
    
    
    const res = await supabaseServiceClient.rpc("execute_user_queryjns",{query_text:query_text,params : jsonElement})
    if (res.error) throw  new Error(JSON.stringify(res.error));
    


  } else {

    const res = await supabaseServiceClient.rpc("execute_user_queryj",{query_text:query_text,params : jsonElement})
    if (res.error) throw  new Error(JSON.stringify(res.error));

    if ( res.data ) {
  
        const fres = res.data.map((line)=>line.result)
        return fres
  
    } else {
  
      return res.data;
  
    }



  }

  
 }

 
async function getConfig(userName){
 
  const result = await runSqlJ(`

SELECT kadabrix_config.*,
kadabrix_config_role.value as rvalue ,
kadabrix_config_user.value as uvalue 
FROM 
  kadabrix_config
  left join kadabrix_user_roles on kadabrix_user_roles.email =  $1::text   
  left join kadabrix_config_role on kadabrix_config.name = kadabrix_config_role.name 
      and kadabrix_config_role.role = kadabrix_user_roles.role
  left join kadabrix_config_user on kadabrix_config.name = kadabrix_config_user.name 
  and kadabrix_config_user.user  = $2::text
  



   `,[userName,userName])

let config={}
let configProtected={}
result.forEach(dataItem => {
  if (dataItem.protected) {
    configProtected[dataItem.name] = dataItem.value !== null 
          ? dataItem.value 
          : (dataItem.rvalue !== null 
              ? dataItem.rvalue 
              : dataItem.uvalue);
        }
  });


result.forEach(dataItem => {
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
