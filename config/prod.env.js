'use strict'
// module.exports = {
//   NODE_ENV: '"production"'
// }


let buildtype=process.argv.slice(2)[0]
var obj={
  NODE_ENV: '"production"'
}
switch(buildtype){
  case 'trade'://生产
   process.env.srconfig='trade'
   obj.srconfig='"trade"'
   break;
  case 'testdev'://测试
  process.env.srconfig='testdev'
  obj.srconfig='"testdev"'
  break;
  default://默认开发
  process.env.srconfig=''
  obj.srconfig='""'
  break;
}

module.exports = obj;
