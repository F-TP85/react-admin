import axios from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd';

export const reqLogin = (params={}) =>  axios('/api/login',params,'post') //登录接口

export const reqGetWeb = (adcode,extensions='base') => {//获取天气信息接口
    return new Promise((resolve,resject)=>{
        let url = `https://restapi.amap.com/v3/weather/weatherInfo?key=fe640901c2c6fb4a4c24d3c948e904e0&city=${adcode}&extensions=${extensions}`
        jsonp(url,{},(err,data)=>{
            if(!err && data) {
                resolve(data)
            } else {
                message.error('获取天气信息失败!')
            }
        })
    })
}