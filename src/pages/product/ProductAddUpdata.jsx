import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Button, message } from 'antd'
import { ArrowLeftOutlined, SyncOutlined } from "@ant-design/icons"

import { repGetCategory, reqCategory, reqAddProduct, reqUpdataProduct } from '../../api/index'
import  ProductUpload from './upload'
import RichTextEditor from './RichTextEditor'

export default class ProductAddUpdata extends Component {

    state = {
        options: [], //级联选择器的分类数组
        classNameStr: ''
    }

    isUpdata = false; //是否是更新商品(修改)
    desc = ''; //修改时的商品描述
    _id = '' ; //修改时的商品id
    categoryId = []; //商品的分类

    //创建表单ref
    myRefs = React.createRef();
    myUpdatRefs = React.createRef();
    myRichTextEditor = React.createRef()

    //Form表单的校验成功回调
    onFinish = async (val) => {
        const imgs = this.myUpdatRefs.current.getImgs(); //上传的图片name属性
        const textEditor = this.myRichTextEditor.current.getDetail(); //获取富文本编辑的内容

        let params = {};
        let res;
        
        params.name = val.name;
        params.desc = val.detail;
        params.price = val.price;
        params.detail = textEditor;
        params.imgs = imgs;
        
        if(this.categoryId.length === 1) {
            params.categoryId = this.categoryId[0];
            params.pCategoryId = '0';
        } else {
            params.categoryId = this.categoryId[1];
            params.pCategoryId = this.categoryId[0];
        }
        
        if(this.isUpdata) { //修改商品时
            params._id = this._id;
            res = await reqUpdataProduct(params);
        } else { //添加商品时
            res = await reqAddProduct(params);
        }

        if(res.status === 200 && res.data.status === 0) {
            message.success(`商品${this.isUpdata?'修改':'添加'}成功`)
        } else {
            message.error(`商品${this.isUpdata?'修改':'添加'}失败`)
        }
        console.log(params);
    }

    //Form表单的校验失败回调
    onFinishFailed = () => {}

    //价格的自定义校验规则
    priceRules = [
        { required: true, message: '商品价格为必填项' },
        { 
            validator: (_, value) =>{
                if(value?value <= 0 :false) {
                    return Promise.reject('商品价格必须大于0')
                }else{
                    return Promise.resolve()
                }
            }
        }
    ]

    //点击第一级option时触发的请求第二级option的回调函数
    loadData = async (val ) => {
        const { options } = this.state;

        //选中选的option值
        const targetOption = val[val.length - 1];
        targetOption.loading = true; //Loading状态

        //加载级联选择器的第二级
        let res = await repGetCategory({parentId: targetOption.value});
        targetOption.loading = false;
        if(res&&res.status === 200) {
            let {data} = res.data;
            targetOption.children = this.processData(data,true);
            this.setState({options: [...options]})
        } else {
            message.error('获取商品分类数据失败!')
        }
        
    }

    //商品分类的change事件
    onChange = (val) => {
        this.categoryId = val
    }


    //初始化
    componentDidMount () {
        this.getGetCategory();

        this.isUpdata =  !!this.props.location.state;//这里直接判断是是修改商品还是添加商品
        if(this.isUpdata) {
            this.init_(this.props.location.state);
            this.getClass();
            this.desc = this.props.location.state.desc;
            this._id = this.props.location.state._id;
        }
        // console.log('~~',this.props.location.state);
    }

    //请求一级/二级分类列表
    getGetCategory = async () => {
        let res = await repGetCategory({parentId: '0'});
        if(res&&res.status === 200){
            let {data} = res.data;
            this.setState({options: this.processData(data,false)})
        } else {
            message.error('获取商品分类数据失败!')
        }
    }

    // 抽离公共部分的逻辑 处理请求回来的数据 
    processData = (data, boolen) => {
        let arrData = data.map( item => ({
            label: item.name,
            value: item._id,
            isLeaf: boolen
        }))
        return arrData
    }

    //请求分类名称
    getClass = async () => {
        let res = await reqCategory({categoryId: this.props.location.state.categoryId});
        let data = this.markrState(res);
        if(data) {
            this.className = [];
            this.className.push(this.props.location.state.categoryId)

            this.setState({classNameStr: '①' + data.name})
            let res2 = await reqCategory({categoryId: data.parentId});
            let data2 = this.markrState(res2);
            if(data2) {
                this.className.unshift(data.parentId);
                this.setState({classNameStr: `① ${data2.name } > ② ${data.name}`})
            }
        }
    }

    //请求数据时 抽离相同部分的逻辑
    markrState = (res) => {
        if(res&&res.status === 200) {
            const {data} = res.data;
            if(!data)  {
                return false
            };
            return data;
        }
    }

    //如果是点击修改跳转过来的 
    init_ = (state) => {
        this.myRefs.current.setFieldsValue({
            name: state.name,
            price: state.price,
            detail: state.desc
        })
    }

    //指定Form表单的Item配置对象 layout:布局
    layout = {
        labelCol: { span: 1.5 }, //指定左边label的宽度
        wrapperCol: { span: 8 }, //指定右边包裹容器的宽度
    };
 
    render() {
        const { options, classNameStr } = this.state;
       
        const title = (
            <span>
                <ArrowLeftOutlined className='ArrowLeftOutlined' onClick={()=> {this.props.history.goBack()}}/>
                <span>{ this.isUpdata ? '修改商品' : '添加商品' }</span>
            </span>
        )
        return (
            <Card title={title}>
                <Form {...this.layout} onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} name="basic" ref={this.myRefs}>

                    <Form.Item rules={[{ required: true, message: '商品名称为必填项' }]} label='商品名称' name="name">
                        <Input placeholder='请输入商品名称'/>
                    </Form.Item>

                    <Form.Item rules={[{ required: true, message: '商品描述为必填项' }]} label='商品描述' name="detail">
                        <Input.TextArea autoSize={{ minRows: 2, maxRows: 5 }} placeholder='请输入商品描述'/>
                    </Form.Item>

                    <Form.Item label='商品价格' name="price" rules={this.priceRules}>
                        <Input addonAfter="元" type='number' placeholder='请输入商品价格'/>
                    </Form.Item>

                    <Form.Item label='商品分类' rules={[{ required: true, message: '商品分类为必填项' }]} name='class'>
                        <Cascader allowClear options={options} loadData={this.loadData} onChange={this.onChange} changeOnSelect />
                    </Form.Item>
                    <div className='tishi' style={{display: this.isUpdata ?'':'none'}}>
                        商品原所属分类: &nbsp;&nbsp;
                        <span>
                            <SyncOutlined  style={{display: classNameStr?'none':''}} />
                            {classNameStr}
                        </span>
                    </div>

                    <Form.Item label='商品图片' name='img' >
                        <ProductUpload ref={this.myUpdatRefs} state={this.props.location?this.props.location.state:{}}/>
                    </Form.Item>

                    <Form.Item label='商品详情' wrapperCol={{ span: 16 }}>
                        <RichTextEditor ref={this.myRichTextEditor} state={this.props.location?this.props.location.state:{}}/>
                    </Form.Item>

                    <Form.Item >
                        <Button type='primary' htmlType="submit">提交</Button>
                    </Form.Item>

                </Form>
            </Card>
        )
    }
}
