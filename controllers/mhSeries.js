/*
 * @description 漫画某系列章节
 */
const mh = require('../spider/mh');

module.exports = function *(){
    let result={};
    let list=[];
    const name=this.params.name;
    result = yield mh.series(name);
    result = JSON.parse(result);

    if(Number(result.code)) throw Error('err');

    list = result.data;

    this.render({
        list: list,
        title: name
    },'mhSeries');
    //this.body=list;
};
