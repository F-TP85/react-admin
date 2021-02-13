import React, { Component } from 'react';
import {Form, Select, Input} from 'antd'

const Item = Form.Item;
const Option = Select.Option;

class addCategory extends Component {
    //创建ref
    addCategoryRef = React.createRef()

    addState = {parentId: '', categoryName: ''}

    //form验证成功的回调
    onFinish = () => {}

    //表单验证失败的回调
    onFinishFailed = () => {}

    //效验规则1
    categoryRules = [{ required: true, whitespace: true, message: "请选择分类!" }]

    //效验规则2
    categoryNameRules = [
        { required: true, whitespace: true, message: "请填写分类名称!" },
        {
            validator: (_,value) => {
                if(!value) {
                    Promise.reject('请填写分类名称')
                } else {
                    Promise.resolve()
                }
            }
        }
    ]

    //初始化数据
    init = () => {
        if(this.props.addState[0].name === '一级分类') {
            this.addState.parentId = this.props.addState[0].parentId;
        } else {
            this.addState.parentId = this.props.addState[0]._id;
        }
        //设置输入框默认值
        this.addCategoryRef.current.setFieldsValue({
            category: this.props.addState[0].name
        })
    }

    //处理父元素传下来的数据 
    componentDidMount() {
        this.init()
    }

    componentDidUpdate() {
        this.init()
    }

    //下拉框change事件记录下parentId的数据
    selectChange = (a) => {
        this.addState.parentId = a;
    }

    //input的change事件
    inputChange = (e) => {
        this.addState.categoryName = this.addCategoryRef.current.getFieldValue('categoryName');
        if(e.target.value) {
            this.props.getAddState(this.addState)
        }
    }

    render() {
        let {addState} = this.props
        return (
            <Form onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} ref={this.addCategoryRef}>
                <Item label="所属分类:" name="category" rules={this.categoryRules}>
                    <Select onChange={this.selectChange}>
                            {
                                addState.map((item)=>{
                                    return (
                                        <Option key={item._id} value={item._id}>{item.name}</Option>
                                    )
                                })
                            }
                    </Select>
                </Item>
                <Item label="分类名称:" name="categoryName" rules={this.categoryNameRules} onChange={this.inputChange}>
                    <Input placeholder='请输入分类名称'/>
                </Item>
            </Form>
        );
    }
}

export default addCategory;