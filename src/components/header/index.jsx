import React, { Component } from 'react'
import { Button } from 'antd'
import {withRouter} from 'react-router-dom'
import {getUser,removeUser} from '../../utils/storageUtils'
import img_p1 from '../../assets/img/you.webp'
import {reqGetWeb} from '../../api'

class Header extends Component {
    state = {
        user: '',
        time_: new Date().toLocaleTimeString(),
        w_m: {}
    }

    componentDidMount() {
        this.setState({user: getUser('user')})
    }

    logOut =  () => {
        removeUser('user');
        this.props.history.replace({pathname: '/login'})
    }

    async componentDidMount() {
        setInterval(()=>{
            this.setState({time_:new Date().toLocaleTimeString()})
        },1000)
        
        //请求天气情况信息
        let res = await reqGetWeb('440300');
        if(res){
            let {info,status,lives} = res;
            let webther_msg = lives[0];
            if(status === '1' && info === 'OK'){
                this.setState({w_m: webther_msg})
                console.log(webther_msg)
            }
        }
    }

    render() {
        let {user,time_,w_m} = this.state
        return (
            <div className='header_'>
                <div className='top_'>
                    <span>欢迎,<span className='t_span'>{user?user.username:''}</span>!</span>
                    <Button type="primary" onClick={this.logOut}>退出</Button>
                </div>
                <div className='top_2'>
                    <div className='top_2_1'>首页</div>
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
