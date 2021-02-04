import React, { Component } from 'react'
import { Button } from 'antd'
import {withRouter} from 'react-router-dom'
import {getUser,removeUser} from '../../utils/storageUtils'
import img_p1 from '../../assets/img/you.webp'
import {reqGetWeb} from '../../api'

class Header extends Component {
    state = {
        user: ''
    }

    componentDidMount() {
        this.setState({user: getUser('user')})
    }

    logOut =  () => {
        removeUser('user');
        this.props.history.replace({pathname: '/login'})
    }

    getWeb = async () => {
        let res = await reqGetWeb('440300')
        console.log(res)
    }

    render() {
        return (
            <div className='header_'>
                <div className='top_'>
                    <span>欢迎,<span className='t_span'>{this.state.user?this.state.user.username:''}</span>!</span>
                    <Button type="primary" onClick={this.logOut}>退出</Button>
                </div>
                <div className='top_2'>
                    <div className='top_2_1'>首页</div>
                    <div className='top_2_2'>
                        <span>2021年2月3日22:16:05</span>
                        <img onClick={this.getWeb} src={img_p1} />
                        <span>晴</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
