import React, { Component } from 'react'
import { Popconfirm,message } from 'antd'
import {withRouter} from 'react-router-dom'
import PubSub from 'pubsub-js' //引入订阅

import {getUser,removeUser} from '../../utils/storageUtils'
import {reqGetWeb} from '../../api'
import LinkButton from '../link-button'


class Header extends Component {
    state = {
        user: '',
        time_: new Date().toLocaleTimeString(),
        w_m: {},
        title: '首页'
    }

    async componentDidMount() {
        //获取登录的用户名
        this.setState({user:getUser('user')})

        //订阅菜单栏变化
        PubSub.subscribe('title', (_,msg)=>{ 
            this.setState({title:msg});//获取不到组件实例的this 用that转了一下
        }); //订阅

        //实时更新时间
        this.timeID = setInterval(()=>{
            this.setState({time_:new Date().toLocaleTimeString()})
        },1000)
        
        //请求天气情况信息
        let res = await reqGetWeb('440300');
        if(res){
            let {info,status,lives} = res;
            let webther_msg = lives[0];
            if(status === '1' && info === 'OK'){
                this.setState({w_m: webther_msg})
            }
        }

    }

    componentWillUnmount() {
        clearInterval(this.timeID);
        PubSub.unsubscribe('title')
    }

    //确认退出登录?
    confirm = () => {
        removeUser('user');
        this.props.history.replace({pathname: '/login'});
        if(!getUser('user')) {
            message.success('已退出登录')
        }
    }

    render() {
        let {user,time_,w_m,title} = this.state;
        return (
            <div className='header_'>
                <div className='top_'>
                    <span>欢迎,<span className='t_span'>{user?user.username:''}</span>!</span>
                    <Popconfirm 
                        title="确认退出登录吗?"
                        onConfirm={this.confirm}
                        okText="确认"
                        cancelText="取消"
                    >
                        <LinkButton>退出</LinkButton>
                    </Popconfirm>
                </div>
                <div className='top_2'>
                    <div className='top_2_1'>{title}</div>
                    <div className='top_2_2'>
                        <span className='header_top'>{time_}</span>
                        <span className='header_top'>当前城市:{w_m.city}</span>
                        <span className='header_top'>{w_m.weather}</span>
                        <span className='header_top'>{w_m.temperature}℃</span>
                        <span className='header_top'>湿度:{w_m.humidity}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
