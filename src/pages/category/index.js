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
import {repGetCategory, reqUpdateCategory, reqAddCategory} from '../../api'
import './index.less'
import AddCategory from './addCategory'
import EditorCategory from './editorCategory'

export default class Category extends Component {
    state = {
        flag: true,//是否loading中标志位
        category: [],//一级商品分类数据
        subCategory: [],//二级分类数据
        fl: true, //判断当前是一级分类还是二级分类的标志位
        showModalVisible: 0,//添加分类和编辑分类对话框显隐标志位 0:都不显示 1:显示添加的 2:显示编辑的
        loading: false,
    }

    
    subTitle = ''; //查看分类时的二级导航
    editorState = {}; //从编辑分类组件接收到的数据
    addData = {parentId: '0', categoryName: ''}; //从添加分类组件接收到的数据
    arrCategory = []; //传递给添加组件的数据

    //处理将要传给子组件(添加组件)的数据
    processingData = (s) => {
        if(s===1) {
            let obj = {name: "一级分类", parentId: "0", _id: 'zzzzz'}
            this.arrCategory = [obj,...this.state.category]
        } else {
            let t = this.arrCategory.find((item,i)=>{
                return item.name === s.name
            });
            let k = this.arrCategory.indexOf(t);
            if(k>0) {
                [this.arrCategory[k],this.arrCategory[0]] = [this.arrCategory[0],this.arrCategory[k]];
            }
        }
    }

    //生命周期 挂载完成
    async componentDidMount() {
        await this.getCategoryData('0');
        this.processingData(1);
    }

    //获取商品分类数据
    getCategoryData = async (parentId) => {
        this.setState({flag:true}) //登录状态
        let res = await repGetCategory({parentId});//请求获取商品分类数据
        if(res&&res.status === 200){
            let {data} = res.data
            if(parentId === '0') {
                this.setState({category:data, fl:true});
            } else {
                this.setState({fl:false, subCategory:data});
            }
            this.setState({flag:false}) //登录状态
        } else {
            message.error('获取商品分类数据失败!')
        }
    }

    //点击查看子项的回调函数
    showSubCategory = (state) => {
        this.setState({flag:false, fl: false});
        this.subTitle = state.name; //分类时二级导航
        this.processingData(state);
        this.getCategoryData(state._id); //请求子分类数据
    }

    //查看子项后返回一级菜单的回调函数
    reqCategoryData = async () => {
        this.processingData(1);
        this.setState({fl:true})
    }

    //添加按钮的回调
    clickAdd = () => {
        this.setState({showModalVisible:1}) 
    }

    //添加分类:ok回调
    addHandleOk = async () => {
        if(this.addData.parentId && this.addData.categoryName) {
            this.setState({loading: true});
            let res = await reqAddCategory(this.addData);
            if(res && res.status === 200 && res.data.status === 0 ) {
                message.success('添加分类成功!');
                this.getCategoryData(this.addData.parentId);
                if(this.addData.parentId === '0') {
                    this.getCategoryData('0');
                }
            } else {
                message.error('添加分类失败!')
            }
            this.setState({showModalVisible: 0, loading: false});
        } else {
            if(!this.addData.parentId) {
                message.error('添加的分类不能为空!')
            } else {
                message.error('添加的分类名称不能为空!')
            }

            
        }
    }

    //编辑分类:ok回调
    editorHandleOk = async () => {
        let {editorState, arrCategory} = this;
        if(editorState.name && editorState._id) {
            this.setState({loading: true})
            let res = await reqUpdateCategory({
                categoryId: editorState._id,
                categoryName: editorState.name
            })
            if(res){
                let {data} = res;
                if(data.status === 0) {
                    if(this.state.fl){
                        this.getCategoryData('0');
                    } else {
                        this.getCategoryData(arrCategory[0]._id);
                    }
                    message.success('分类名称修改成功!')
                    editorState = {};
                } else {
                    message.error('分类名称修改失败!')
                }
            } else {
                message.error('分类名称修改失败!')
            }
            this.setState({showModalVisible: 0, loading: false})
        } else {
            message.error('修改的分类名称不能为空!')
        }
    }

    //分类对话框取消回调
    HandleCancel = () => { this.setState({showModalVisible:0}) }

    //点击编辑对话框回调
    showEditeModal = (state) => {
        this.editorState = state;
        this.setState({showModalVisible:2}) 
    }

    //接收编辑分类的数据
    getEditorState = (state) => {
        this.editorState = state;
    }
    //接收添加分类的数据
    getAddState = (state) => {
        this.addData = state;
    }

    
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
                        <LinkButton onClick={this.showEditeModal.bind(this,state)}>修改分类</LinkButton>
                    </div>
                    {this.state.fl?<LinkButton onClick={this.showSubCategory.bind(this,state)}>查看子分类</LinkButton>:null}
                </Fragment>
            ),
            width: 300, //设置当前列宽度
        }
    ];   

    render() {

        let { flag, category, subCategory, fl, showModalVisible,loading  } = this.state
        let { columns, editorState, getEditorState, arrCategory, getAddState } = this;

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

                <Modal title="添加分类" visible={showModalVisible===1?true:false} 
                    onCancel={this.HandleCancel}
                    footer={[
                        <Button key="back" onClick={this.HandleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.addHandleOk}>
                            OK
                        </Button>
                    ]}
                >
                    <AddCategory addState={arrCategory} getAddState={getAddState}/>
                </Modal>
                
                <Modal title="编辑分类" 
                    visible={showModalVisible===2?true:false} 
                    onCancel={this.HandleCancel}
                    footer={[
                        <Button key="back" onClick={this.HandleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.editorHandleOk}>
                            OK
                        </Button>
                    ]}>
                    <EditorCategory state={editorState} getEditorState={getEditorState}/>
                </Modal>
            </div>
        )
    }
}
