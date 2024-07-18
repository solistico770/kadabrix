import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseServiceClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)


async function getController(module,name){
    
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
 

 for (let i=0;i<serviceConf.di.length;i++){

  const di = serviceConf.di[i];
  const diModule = di.module ? di.module : module ;
  const diName = di.name;
  const {appFunction,config} = await getService(diModule,diName);
  
  
  

  
  eval(`
       
       kdbService.asy2=22;
       kdbService.asy3=${appFunction};



       kdbService.${diName} =  ${appFunction} ;
          
    `);



 }



 const appFunction = eval('('+ appRecord.data + ')');
 
 return {appFunction,config:appRecord.config};


}


async function getService(module,name){
    
  const { data, error } = await supabaseServiceClient
  .from('kadabrix_app')
  .select('*')
  .eq('name', name)
  .eq('type', 'SERVICE')
  .eq('module', module)
  
   if (data.length==0) { throw new Error(`no such service : ${module}->${name}`) }
  
   const appRecord = data[0];
   const appFunction = '('+ appRecord.data + ')';
   
   return {appFunction,config:appRecord.config};
  
  
  }
  
  

  
  
async function getClient(authHeader){

return   createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )
  

}



async function  manageFunction(req){


try {  

const reqData = await req.json()

  const kdb = getClient(req.headers.get('Authorization'));
  const {appFunction,config} = await getController(reqData.module,reqData.name);
  const funcRet = await appFunction(reqData.data);
 
  return new Response(JSON.stringify({"status":"ok",data:funcRet}), { headers: { 'Content-Type': 'application/json' } })
 
} catch(err) {

  return new Response(JSON.stringify({"status":"error", data:err.message}), { headers: { 'Content-Type': 'application/json' } })
  

}

}

Deno.serve(manageFunction);