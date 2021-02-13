import React, { Component } from 'react';
import {Form, Input} from 'antd'

const Item = Form.Item;

class EditorCategory extends Component {
    //创建ref
    editorCategoryRef = React.createRef()

    //监听input的onchange事件 值发生改变时 每触发一次就把修改的值传到父元素
    inputChange = (e) => {
        let obj = {
            name: e.target.value,
            _id: this.props.state._id
        }
        this.props.getEditorState(obj)
    }

    //将获取到的对应行分类名称作为编辑分类框的默认值
    componentDidMount() {//创建阶段触发 只触发一次
        this.editorCategoryRef.current.setFieldsValue({
            editorName: this.props.state.name
        })
    }

    componentDidUpdate() {//运行阶段 组件更新后执行 render多少次就触发多少次
        this.editorCategoryRef.current.setFieldsValue({
            editorName: this.props.state.name
        })
    }

    editorNameRules = [ { required: true, whitespace: true, message: "请填写分类名称!" }]

    render() {
        
        return (
            <Form ref={this.editorCategoryRef}>
                <Item name="editorName" rules={this.editorNameRules}>
                    <Input placeholder='请输入新分类名称' onChange={this.inputChange}/>
                </Item>
            </Form>
        );
    }
}

export default EditorCategory;