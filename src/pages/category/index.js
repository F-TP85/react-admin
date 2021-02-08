// 商品分类
import React, { Component,Fragment } from 'react'
import {
    Card,
    Table,
    Button,
    message,
    Modal
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
        fl: true, //判断当前是一级分类还是二级分类的标志位
        showModalVisible: 0,//添加分类和编辑分类对话框显隐标志位 0:都不显示 1:显示添加的 2:显示编辑的
        
    }

    //查看分类时的二级导航
    subTitle = ''

    //生命周期 挂载完成
    componentDidMount() {
        this.getCategoryData('0')
    }

    //获取商品分类数据
    getCategoryData = async (parentId) => {
        let res = await repGetCategory({parentId});//请求获取商品分类数据
        this.setState({flag:false}) //登录状态
        if(res&&res.status === 200){
            let {data} = res.data
            //  console.log(data)
            if(parentId === '0') {
                this.setState({fl:true})
                this.setState({category:data})
            } else {
                this.setState({fl:false})
                this.setState({subCategory:data})
            }
        } else {
            message.error('获取商品分类数据失败!')
        }
    }

    //点击查看子项的回调函数
    showSubCategory = (state) => {
        this.setState({flag:false})
        this.setState({fl:false})
        this.subTitle = state.name
        this.getCategoryData(state._id)
    }

    //查看子项后返回一级菜单的回调函数
    reqCategoryData = () => {
        this.setState({fl:true})
    }

    //添加按钮的回调
    clickAdd = () => { this.setState({showModalVisible:1}) }

    //添加分类ok回调
    addHandleOk = () => {}

    //编辑分类ok回调
    editorHandleOk = () => {}

    //分类对话框取消回调
    HandleCancel = () => { this.setState({showModalVisible:0}) }

    //点击编辑对话框回调
    showEditeModal = () => { this.setState({showModalVisible:2}) }

    
    //table表格的配置项
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
                        <LinkButton onClick={this.showEditeModal}>修改分类</LinkButton>
                    </div>
                    {this.state.fl?<LinkButton onClick={this.showSubCategory.bind(this,state)}>查看子分类</LinkButton>:null}
                </Fragment>
            ),
            width: 300, //设置当前列宽度
        }
    ];   

    render() {

        let { flag, category, subCategory, fl, showModalVisible  } = this.state
        let { columns } = this;

        //根据fl状态判断展示怎么样的导航
        let title = fl?(<span className='span_color'>一级分类列表</span>)
        :(
            <div className='sub_title'>
                <span className='span_color' onClick={this.reqCategoryData}>一级分类列表</span>
                <span className='span_margin'><ArrowRightOutlined /></span>
                <span>{this.subTitle}</span>
            </div>
        )

        let extra = (<Button type="primary" icon={<PlusOutlined />} onClick={this.clickAdd}>添加</Button>);
          
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

                <Modal title="添加分类" visible={showModalVisible===1?true:false} onOk={this.addHandleOk} onCancel={this.HandleCancel}>
                    <p>添加分类........</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
                
                <Modal title="编辑分类" visible={showModalVisible===2?true:false} onOk={this.editorHandleOk} onCancel={this.HandleCancel}>
                    <p>编辑分类........</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </div>
        )
    }
}
