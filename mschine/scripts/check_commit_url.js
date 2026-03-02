const https=require('https');
const url='https://i.imgur.com/wrb7z76.jpg';
https.get(url,res=>{
  console.log('status',res.statusCode);
  res.on('data',()=>{});
  res.on('end',()=>{});
}).on('error',e=>console.error('err',e));
