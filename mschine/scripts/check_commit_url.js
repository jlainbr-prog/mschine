const https=require('https');
const url='ipfs://QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q';
https.get(url,res=>{
  console.log('status',res.statusCode);
  res.on('data',()=>{});
  res.on('end',()=>{});
}).on('error',e=>console.error('err',e));
