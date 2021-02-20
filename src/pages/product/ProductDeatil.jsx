import React, { Component } from 'react'
import { Card, List, message } from 'antd'
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";

import { reqCategory } from '../../api/index'

export default class ProductDeatil extends Component {

    state = {
        cName1: '',
        cName2: '',
    }

    async componentDidMount() {
        let res = await reqCategory({categoryId: this.props.location.state.categoryId});
        let data = this.markrState(res);
        if(data) {
            this.setState({cName2: data.name});
            let res2 = await reqCategory({categoryId: data.parentId});
            let data2 = this.markrState(res2);
            if(data2) {
                this.setState({cName1: data2.name});
            }
            
        }
    }

    //请求数据时 抽离相同部分的逻辑
    markrState = (res) => {
        if(res&&res.status === 200) {
            const {data} = res.data;
            if(!data)  {
                message.error(res.data.msg)
                return false
            };
            return data;
        } else {
            message.error('请求获取分类名称失败!');
            return false;
        }
    }


    render() {
        const {name, desc, price, detail, imgs } = this.props.location.state;
        const { cName1, cName2 } = this.state;
        const title = (
            <span>
                <ArrowLeftOutlined className='ArrowLeftOutlined' onClick={()=> {this.props.history.goBack()}}/>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='_Card'>
                <List>
                    <List.Item>
                        <span className='List_Item'>商品名称:</span> 
                        {name}
                    </List.Item>

                    <List.Item>
                        <span className='List_Item'>商品描述:</span>
                        {desc}
                    </List.Item>

                    <List.Item className='List_Item_'>
                        <span className='List_Item'>商品价格:</span>
                        { price + '元' }
                    </List.Item>

                    <List.Item>
                        <span className='List_Item'>所属分类:</span>
                        { cName1? cName1 + ' >' : '' }  { cName2? cName2: '(错误:获取分类数据失败)' }
                    </List.Item>

                    <List.Item className='List_Item_'>
                        <span className='List_Item'>商品图片:</span> 
                        {   imgs.length?
                            imgs.map((item,i)=>{
                                return (
                                    <img className='List_Item_img' key={i} src={ '/api/upload/' + item} alt='图片加载失败'/>
                                )
                            })
                            : <LoadingOutlined />
                        }
                    </List.Item>

                    <List.Item className='List_Item_'>
                        <span className='List_Item'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </List.Item>
                </List>
            </Card>
        )
    }
}
