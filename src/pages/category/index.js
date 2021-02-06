// 商品分类
import React, { Component,Fragment } from 'react'
import {
    Card,
    Table,
    Button,
    message
} from 'antd'
import { PlusOutlined,ArrowRightOutlined } from '@ant-design/icons';

import LinkButton from '../../components/link-button'
import {repGetCategory} from '../../api'
import './index.less'

export default class Category extends Component {
    state = {
        flag: true,//是否loading中标志位
        category: [],//一级商品分类数据
        subCategory: [],//二级分类数据
    }

    fl= true;//判断一级还是二级分类的标志位
    subTitle = ''

    componentDidMount() {
        this.getCategoryData('0')
    }

    //获取商品分类数据
    getCategoryData = async (parentId) => {
        let res = await repGetCategory({parentId});//请求获取商品分类数据
        this.setState({flag:false})
        if(res&&res.status === 200){
            let {data} = res.data
            //  console.log(data)
            if(parentId === '0') {
                this.fl =  true
                this.setState({category:data})
            } else {
                this.fl =  false
                this.setState({subCategory:data})
            }
        } else {
            message.error('获取商品分类数据失败!')
        }
    }

    //查看子项的回调函数
    showSubCategory = (state) => {
        this.setState({flag:true})
        this.subTitle = state.name
        this.getCategoryData(state._id)
        
    }

    columns = [
        {
            title: '分类名称',
            dataIndex: 'name',
        },
        {
            title: '操作',
            // stste: 当前行数据
            render: (state) => (
                <Fragment>
                    <div className='Tab_but'>
                        <LinkButton>修改分类</LinkButton>
                    </div>
                    {this.fl?<LinkButton onClick={this.showSubCategory.bind(this,state)}>查看子分类</LinkButton>:null}
                </Fragment>
            ),
            width: 300, //设置当前列宽度
        }
    ];   



    render() {
        let {flag,category,subCategory} = this.state
        let {fl,columns} = this
        let title = fl?(<span className='span_color'>一级分类列表</span>)
        :(
            <div className='sub_title'>
                <span className='span_color' onClick={this.getCategoryData.bind(this,'0')}>一级分类列表</span>
                <span className='span_margin'><ArrowRightOutlined /></span>
                <span>{this.subTitle}</span>
            </div>
        )
        let extra = (<Button type="primary" icon={<PlusOutlined />}>添加</Button>);
          
        return (
            <div className='margin_right'>
                <Card title={title} extra={extra}>
                    {/* dataSource:指定对应行要显示数据的属性名  columns:每一列的描述(表头)*/}
                    <Table 
                        dataSource={fl?category:subCategory} 
                        columns={columns} 
                        bordered
                        loading={flag}
                        rowKey='_id'
                        pagination={{pageSize:6,showQuickJumper:true}}
                        scroll
                    />
                </Card>
            </div>
        )
    }
}
