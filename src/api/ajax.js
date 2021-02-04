// 封装axios
import axios from 'axios'
import { message } from 'antd';

export default async function axios_(url,params={},methods='get') {
    //请求拦截
    // axios.interceptors.request.use( (config) => {return config;},  (error) => {
    //     console.log(error)
    //     return Promise.reject(error);
    // });

    //响应拦截
    axios.interceptors.response.use(
        res => res,
        err => {
        console.log(err.response)
        if(err && err.response && err.response.status !== 200){
            message.error(err.response.status + '' + err.response.statusText);
        }
        return err
    })
    
    if(methods === 'get'){
        return await axios[methods](url,{params})
    } else {
        return await axios[methods](url,params)
    }
    
}