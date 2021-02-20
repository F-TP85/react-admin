// 商品管理
import React, { Component, lazy, Suspense } from 'react'
import {Route, Switch, Redirect } from 'react-router-dom'
import {Card} from 'antd'
import './index.less'

const ProductHome = lazy(()=> import('./ProductHome.jsx')) 
const ProductAddUpdata = lazy(()=> import('./ProductAddUpdata.jsx')) 
const ProductDeatil = lazy(()=> import('./ProductDeatil.jsx')) 

export default class Product extends Component {
    render() {
        return (
            <div className='margin_right'>
                <Card>
                    <Switch>
                        {/* 使用lazy的话必须使用该标签 */}
                        <Suspense fallback={<div>加载中,请稍后</div>}>
                            <Route path='/admin/product/productHome' component={ProductHome} />
                            <Route path='/admin/product/productAddUpdata' component={ProductAddUpdata} />
                            <Route path='/admin/product/productDeatil' component={ProductDeatil} />
                            <Redirect to='/admin/product/productHome' />
                        </Suspense>
                    </Switch>
                </Card>
            </div>
        )
    }
}
