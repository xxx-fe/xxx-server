/*
 * @description cache 缓存控制
 * @auth subying
 */
const redis = require("redis");
var client = redis.createClient();
var errFlag = false;
var redisMap = new Map();

client.on("error", function(err) {
    console.log("Redis Error " + err);
    client.quit();
    errFlag = true;
});

function connectSever(){
	return new Promise(function(resolve, reject) {
	  client.on("connect",()=>{
	    resolve();
	  });
	});
}

connectSever();

var cacheCtrl = {
	set: (key,value)=>{

        return new Promise(function(resolve, reject) {
            if(errFlag){
                redisMap.set(key,value);
                resolve();
            }else{
                client.set(key,value,(err,reply)=>{
                resolve(reply);
                //reject
                });
            }
		});

	},
	get: (key)=>{
		return new Promise(function(resolve, reject) {
            if(errFlag){
                resolve(redisMap.get(key));
            }else{
        		  client.get(key,(err,reply)=>{
        		    resolve(reply);
        		    //reject
        		  });
            }
		});
	},
	hset: (key,value)=>{
		return new Promise(function(resolve, reject) {
            if(errFlag){
                redisMap.set(key,value);
                resolve();
            }else{
    		  client.hset(key,value,(err,reply)=>{
    		    resolve(reply);
    		    //reject
    		  });
            }
    	});
	},
	hget: (key)=>{
    		return new Promise(function(resolve, reject) {
                if(errFlag){
                    resolve(redisMap.get(key));
                }else{
                    client.hget(key,(err,reply)=>{
                        resolve(reply);
                        //reject
                    });
                }
    		});
	},
	expire: (key,secs)=>{
        if(errFlag){
            //
            if(this.timer[key]){
                clearTimeout(this.timer[key]);
                this.timer[key] = null;
            }

            this.timer[key] = setTimeout(function(){
                redisMap.set(key,null);
            },secs*1000);
        }else{
	        client.expire(key,secs);
        }
	},
    timer: {}
}
/*

client.on("connect",()=>{
	// 设置一个字符串类型的值，返回值：OK
	  client.set("test", "Hello World test", function(err, reply) {
	    console.log(reply.toString());
	  });

	  // 获取一个字符串类型的值，返回字：value
	  client.get("test", function(err, reply) {
	    console.log(reply.toString());
	  });
});
*/

module.exports = cacheCtrl;
