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

export const repGetCategory = (params={}) => axios('/api/manage/category/list',params) //请求商品分类接口

export const reqAddCategory = (params={}) => axios('/api/manage/category/add',params,'post') //添加商品分类接口

export const reqUpdateCategory = (params={}) => axios('/api/manage/category/update',params,'post') //更新商品分类接口

export const reqProduct = (params={}) => axios('/api/manage/product/list',params) //请求商品分类列表 

export const reqSearch = (params={}) => axios('/api/manage/product/search',params) //根据名称/描述搜索产品分页列表

export const reqCategory = (params={}) => axios('/api/manage/category/info',params) //根据分类ID获取分类

export const reqUpdateStatus = (params={}) => axios('/api/manage/product/updateStatus',params,'post') //对商品进行上架/下架处理

export const reqImgDelete = (params={}) => axios('/api/manage/img/delete',params,'post') //删除已上传的图片

export const reqAddProduct = (params={}) => axios('/api/manage/product/add' ,params,'post') //添加商品

export const reqUpdataProduct = (params={}) => axios('/api/manage/product/update' ,params,'post') //更新商品

export const reqRoleList = (params={}) => axios('/api/manage/role/list' ,params) //获取角色列表