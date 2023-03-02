import Taro from "@tarojs/taro";

const showLoading = (title:string='加载中') => Taro.showLoading({title: title,mask:true})
const getCloudFilePath=(url:string)=>url.split('tmp/',2)[1]
const getCos=(url:string)=>{
    let res = url;
    if (url.indexOf('cloud://') === 0) {
        let first = url.indexOf('.');
        let end = url.indexOf('/', first);
        res = 'https://' + url.slice(first + 1, end) + '.tcb.qcloud.la/' + url.slice(end + 1, url.length)
    }
    return res
}

export {showLoading,getCloudFilePath,getCos}
