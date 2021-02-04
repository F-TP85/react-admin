import React, { Component } from "react";
import "./index.less";
import { Header } from "antd/lib/layout/layout";
import p1 from "../../assets/img/logo.png";
import { Form, Input, Button, Checkbox, Spin, Space, message } from "antd";
import { reqLogin } from '../../api/index'
import {
  setUser, 
  // getUser 
} from '../../utils/storageUtils'

export default class Login extends Component {
  //ref注册表单 用于重置表单
  formRef = React.createRef();

  state = {
    loading: false
  }

  layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  //表单验证成功的回调 成功后登录
  onFinish = async (values) => {
    this.setState({loading:true})

    let res = await reqLogin({
      username:values.username,
      password:values.password
    })
    let {data} = res.data;

    if(res?res.status === 200:false){

      if(data.status) return message.error(data.msg)
      setUser('user',{username:data.username, userid:data._id})
      message.success('登录成功!')
      //注意: 这里的pathname是不驼峰命名
      this.props.history.replace({pathname:'/admin',state:{username:data.username, userid:data._id}})
      this.setState({loading:false})
    }
  };

  //表单验证失败的回调
  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  //重置
  onReset = () => {
    this.formRef.current.resetFields();
  };

  //验证规则 分多个子项来写可以做到边输入边验证
  //1.声明式表单验证：
  usernameRules = [
    { required: true, whitespace: true, message: "请输入账户名!" },
    {min: 4,message: "用户名最少4位"},
    {max: 12, message: "用户名最多12位"},
    {pattern: /^[a-zA-Z0-9_-]+$/,message: "用户名只能由数字/字母/下划线组成"}
  ]

  //2. validator自定义式验证：
  passwordRules = [
    {
        validator: (_, value) =>{
          if(value?value.length >= 4 && value.length<=12:false) {
              return Promise.resolve()
          }else{
              return Promise.reject('密码长度必须是4~12位')
          }
        }
    },{
      validator: (_,value,callback) => {
        let rules_ = /^[a-zA-Z0-9_-]+$/
        if(rules_.test(value)){
          // callback();//验证通过时调用
          return Promise.resolve()
        } else {
          //callback("密码必须有数字、字母、下划线组成")
          return Promise.reject('密码长度必须是4~12位')
        }
      }
    }
  ]

  componentDidMount(){
    //挂载时 可以获取ref 这里就可以设置默认值
    this.formRef.current.setFieldsValue({
      username: "admin",
      // password: "1234"
    })
    //console.log(this.formRef.current.getFieldValue())//这里能够获取到初始化挂载的值
    
    // if(getUser('user')) {
    //   this.props.history.replace({pathname: '/admin'})
    // }
  }

  render() {
    return (
      <div className="login">
        <Header className="header">
          <img src={p1} alt='图片加载失败'/>
          <h1>React-后台管理系统</h1>
        </Header>

        <Space size="middle" className={this.state.loading?'':'loading_none'}>
          <Spin size="large" />
        </Space>

        <div className="login_content">
          <div className="login_">
            <h2>用户登录</h2>

            <Form {...this.layout} name="basic" initialValues={{ remember: true }} onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} ref={this.formRef}>
              <Form.Item label="Username" name="username" rules={this.usernameRules}>
                <Input />
              </Form.Item>

              <Form.Item label="Password" name="password" rules={this.passwordRules}>
                <Input.Password />
              </Form.Item>

              <Form.Item {...this.tailLayout} name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item {...this.tailLayout}>
                <Button type="primary" htmlType="submit">登录</Button>
                <Button htmlType="button" onClick={this.onReset}>Reset</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
