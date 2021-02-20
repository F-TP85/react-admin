import React, { Component } from "react";
import { Card, Select, Input, Button, Table, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import LinkButton from '../../components/link-button'
import {reqProduct, reqSearch, reqUpdateStatus} from '../../api/index'

const Option = Select.Option;

export default class ProductHome extends Component {
    state = {
        products: [], //商品的数组
        total: 0, //商品数据总条数
        loading: false, //是否正在加载中
        inputContent: '', //搜索输入框文本
        searchType: 'productName',
    };

    pageNum = 0; //当前页码
    pageSize = 0; //当前页显示条数
    flag = true; //显示默认的商品列表还是所搜的商品列表

    //程序初始化
    UNSAFE_componentWillMount() {
        this.init();
        this.getProduct();
    }

    //请求商品数据列表
    getProduct = async (pageNum = 1, pageSize = 5) => {
        this.setState({loading: true})
        this.pageNum = pageNum;
        this.pageSize = pageSize;
        const res = await reqProduct({pageNum, pageSize});
        this.markaState(res,'商品列表数据请求失败!')
        this.setState({loading: false})
    }

    //请求数据时 抽离相同部分的逻辑
    markaState = (res,str) => {
        if(res&&res.status === 200) {
            const {data} = res.data;
            this.setState({products:data.list, total: data.total});
        } else {
            message.error(str);
        }
    }

    //更新商品状态
    updataProduct = async (status,state) => {
        let obj = {};
        obj.status  = status === 1 ? 2 : 1;
        obj.productId = state._id;
        let msg = status === 1 ? '下架':'上架' ;

        let res = await reqUpdateStatus(obj);
        if(res&&res.status === 200 && res.data.status !== status) {
            message.success(state.name + ' ' + msg +'成功!')
        } else {
            message.error(state.name +' ' + msg +'失败!')
        }
        this.getProduct(this.pageNum,this.pageSize);
    }

    //初始化
    init = () => {
        // 初始化Table列的数组
        this.columns = [
            {
                title: "商品名称",
                dataIndex: "name"
            },
            {
                title: "商品描述",
                dataIndex: "desc"
            },
            {
                title: "价格",
                dataIndex: "price",
                render: (price) => '￥' + price, //指定显示的状态,不指定则直接显示 price (dataIndex: "price")
            },
            {
                title: "状态",
                dataIndex: "status",
                render: (status,state) => {
                    return (
                        <span>
                            <Button type="primary" style={{marginRight: 15}} onClick={this.updataProduct.bind(this,status,state)}>{ status === 1 ? '下架':'上架'}</Button>
                            <span>{ status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {

                title: "操作",
                dataIndex: "detail",
                //  第二个形参带有完整的整行数据
                render: (_,state) => {
                    return (
                        <span>
                            <LinkButton style={{marginRight: 15}} onClick={this.details.bind(this,state)}>详情</LinkButton>
                            <LinkButton onClick={this.changeProduct.bind(this,state)}>修改</LinkButton>
                        </span>
                    )
                }
            }
        ];
    };

    //详情: 跳转到详情页
    details = (state) => {
        this.props.history.push({pathname: '/admin/product/productDeatil',state})
    }

    //修改: 跳转到修改页
    changeProduct = (state) =>{
        this.props.history.push({pathname: '/admin/product/productAddUpdata',state})
    }

    //底部分页器分页时
    paginationChange = (pageNum, pageSize) => {
        this.pageNum = pageNum;
        this.pageSize = pageSize;
        if(this.flag) {
            this.getProduct(pageNum, pageSize)
        } else {
            this.searchProduct(1,pageNum, pageSize)
        }
    }

    //搜索按钮:点击事件
    searchProduct = (even,pageNum=1, pageSize=5) => {
        this.flag = false;
        let {inputContent, searchType} = this.state
        if(inputContent) {
            let params = {
                pageNum,
                pageSize,
                [searchType]: inputContent,
            } 
            this.getSearch(params)
        } else {
            message.error('搜索值不能为空!')
        }
        
    }
    //重置按钮
    resetState = () => {
        this.setState({inputContent: '', searchType: 'productName'});
        this.flag = true;
        this.getProduct();
    }

    //搜索请求方法
    getSearch = async (params) => {
        this.setState({loading: true})
        let res = await reqSearch(params);
        this.markaState(res,'获取数据失败!')
        this.setState({loading: false})
    }

    //input change事件 获取输入框文本
    InputChange = (e) => {
        this.setState({inputContent: e.target.value});
    }

    //下拉框change事件
    SelectChange = (val) => {
        this.setState({searchType: val});
    }

    render() {
        const { products, total, loading, inputContent, searchType } = this.state;
        const { columns, pageNum, pageSize, SelectChange, searchProduct, InputChange, resetState } = this;

        // Card 属性 左上角区域render设置
        const title = (
            <span>
                <Select style={{ width: "150px" }} onChange={SelectChange} value={searchType}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input placeholder="请输入关键字" value={inputContent} style={{ width: "200px", margin: 15 }} onChange={InputChange}/>
                <Button type="primary" onClick={searchProduct} style={{ margin: 15 }}>搜索</Button>
                <Button type="primary" onClick={resetState}>重置</Button>
            </span>
        );

        //右上角render区域设定
        const extra = (
            <Button type="primary" icon={<PlusOutlined />} onClick={()=>{this.props.history.push('/admin/product/productAddUpdata')}}>
                添加商品
            </Button>
        );

        return (
            <Card title={title} extra={extra}>
                <Table dataSource={products} loading={loading}
                columns={columns} rowKey='_id' 
                pagination={{
                    current: pageNum, 
                    pageSize, 
                    defaultCurrent: 5,
                    showQuickJumper: true, 
                    total,
                    onChange: this.paginationChange
                }} >

                </Table>
            </Card>
        );
    }
}
