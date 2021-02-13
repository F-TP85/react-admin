import React, { Component } from "react";
import { Card, Select, Input, Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import LinkButton from '../../components/link-button'
import {reqProduct} from '../../api/index'

const Option = Select.Option;

export default class ProductHome extends Component {
    state = {
        products: [
            {
                status: 1,
                imgs: ["image-1559402396338.jpg"],
                _id: "5ca9e05db49ef916541160cd",
                name: "联想ThinkPad 翼4809",
                desc: "年度重量级新品，X390、T490全新登场 更加轻薄机身设计9",
                price: 65999,
                pCategoryId: "5ca9d6c0b49ef916541160bb",
                categoryId: "5ca9db9fb49ef916541160cc",
                detail:
                    '<p><span style="color: rgb(228,57,60);background-color: rgb(255,255,255);font-size: 12px;">想你所需，超你所想！精致外观，轻薄便携带光驱，内置正版office杜绝盗版死机，全国联保两年！</span> 222</p>\n<p><span style="color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;">联想（Lenovo）扬天V110 15.6英寸家用轻薄便携商务办公手提笔记本电脑 定制【E2-9010/4G/128G固态】 2G独显 内置</span></p>\n<p><span style="color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;">99999</span></p>\n',
                __v: 0,
            },
            {
                status: 1,
                imgs: ["image-1559402448049.jpg", "image-1559402450480.jpg"],
                _id: "5ca9e414b49ef916541160ce",
                name: "华硕(ASUS) 飞行堡垒",
                desc:
                    "15.6英寸窄边框游戏笔记本电脑(i7-8750H 8G 256GSSD+1T GTX1050Ti 4G IPS)",
                price: 6799,
                pCategoryId: "5ca9d6c0b49ef916541160bb",
                categoryId: "5ca9db8ab49ef916541160cb",
                detail:
                    '<p><span style="color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;">华硕(ASUS) 飞行堡垒6 15.6英寸窄边框游戏笔记本电脑(i7-8750H 8G 256GSSD+1T GTX1050Ti 4G IPS)火陨红黑</span>&nbsp;</p>\n<p><span style="color: rgb(228,57,60);background-color: rgb(255,255,255);font-size: 12px;">【4.6-4.7号华硕集体放价，大牌够品质！】1T+256G高速存储组合！超窄边框视野无阻，强劲散热一键启动！</span>&nbsp;</p>\n',
                __v: 0,
            },
        ], //商品的数组
    };

    pageNum = 1;
    pageSize = 5;

    UNSAFE_componentWillMount() {
        this.init();
        this.getProduct();
    }

    getProduct = async () => {
        const {pageNum, pageSize} = this
        const res = await reqProduct({pageNum, pageSize})
        if(res&&res.status === 200) {
            const {data} = res.data
            console.log(data)
        }
        
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
                render: (status) => {
                    return (
                        <span>
                            <Button type="primary" style={{marginRight: 15}}>下架</Button>
                            <span>在售</span>
                        </span>
                    )
                }
            },
            {

                title: "操作",
                dataIndex: "detail",
                render: (status) => {
                    return (
                        <span>
                            <LinkButton style={{marginRight: 15}}>详情</LinkButton>
                            <LinkButton>修改</LinkButton>
                        </span>
                    )
                }
            }
        ];
    };

    render() {
        const { products } = this.state;
        const { columns } = this;

        // Card 属性
        const title = (
            <span>
                <Select value="1" style={{ width: "150px" }}>
                    <Option value="1">按名称搜索</Option>
                    <Option value="2">按描述搜索</Option>
                </Select>
                <Input
                    placeholder="请输入关键字"
                    style={{ width: "200px", margin: 15 }}
                />
                <Button type="primary">搜索</Button>
            </span>
        );
        const extra = (
            <Button type="primary" icon={<PlusOutlined />}>
                添加商品
            </Button>
        );

        const dataSource = [
            {
                key: "1",
                name: "胡彦斌",
                age: 32,
                address: "西湖区湖底公园1号",
            },
            {
                key: "2",
                name: "胡彦祖",
                age: 42,
                address: "西湖区湖底公园1号",
            },
        ];

        return (
            <Card title={title} extra={extra}>
                <Table dataSource={products} columns={columns} rowKey='_id' ></Table>
            </Card>
        );
    }
}
