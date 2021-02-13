import React, { Component,lazy,Suspense } from 'react'
 import { Redirect,Route,Switch } from 'react-router-dom'
import {getUser } from '../../utils/storageUtils'
import { Layout } from 'antd'
import './index.less'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

const Category = lazy(()=>import('../category'))
const Product = lazy(()=>import('../product'))
const Role = lazy(()=>import('../role'))
const User = lazy(()=>import('../user'))
const Home = lazy(()=>import('../home'))
const Bar = lazy(()=>import('../charts/bar'))
const Line = lazy(()=>import('../charts/line'))
const Pie = lazy(()=>import('../charts/pie'))

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
    state = {
        userMsg: {}
    }

    componentDidMount(){
        this.setState({userMsg: getUser('user')?getUser('user'):null})
        //如果没有用户信息 就跳转到登录页
        if(!getUser('user')){
            this.props.history.replace({pathname:'/login'});
            //<Redirect to='/login' /> //或者直接重定向过去也可以 不过得在render函数里面写 (该方法浏览器一刷新就会跳转到登录页 不太合适)
        }
    }

    render() {
        return (
            <Layout>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content>
                        <Switch>
                            {/* 使用lazy的话必须使用该标签 */}
                            <Suspense fallback={<div>加载中,请稍后</div>}>
                                <Route path='/admin/home' component={Home} />
                                <Route path='/admin/category' component={Category} />
                                <Route path='/admin/product' component={Product} />
                                <Route path='/admin/role' component={Role} />
                                <Route path='/admin/user' component={User} />
                                <Route path='/admin/bar' component={Bar}/>
                                <Route path='/admin/line' component={Line}/>
                                <Route path='/admin/pie' component={Pie}/>
                                <Redirect to='/admin/home' />
                            </Suspense>
                        </Switch>
                    </Content>
                    <Footer>推荐使用谷歌浏览器,可以获得页面更佳体验</Footer>
                </Layout>
            </Layout>
        )
    }
}
