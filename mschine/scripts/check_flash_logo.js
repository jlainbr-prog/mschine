const https=require('https');
const urls=[
 'https://raw.githubusercontent.com/jlainbr-prog/mschine/main/mschine/blockchains/ethereum/assets/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11/logo.png',
 'https://raw.githubusercontent.com/jlainbr-prog/mschine/230a432/main/mschine/blockchains/ethereum/assets/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11/logo.png'
];
urls.forEach(u=>{
  https.get(u,res=>{
    console.log(u,'->',res.statusCode);
    res.resume();
  }).on('error',e=>console.error('err',e));
});
