// quick utility to verify reachability of URLs
const https = require('https');
const urls=[
 'https://i.imgur.com/wrb7z76.jpg',
 'https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/ethereum/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540/info.json',
 'https://i.imgur.com/wrb7z76.jpg',
 'https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/smartchain/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540/info.json',
 'https://i.imgur.com/wrb7z76.jpg',
 'https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/ethereum/assets/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11/info.json',
 'https://i.imgur.com/wrb7z76.jpg',
 'https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/smartchain/assets/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11/info.json'
];

function check(u){
  return new Promise(r=>{
    https.get(u,res=>{
      console.log(u,'->',res.statusCode,'len',res.headers['content-length']);
      res.resume(); r();
    }).on('error',e=>{console.log(u,'ERROR',e.message); r();});
  });
}

(async()=>{
  for(const u of urls) await check(u);
})();
