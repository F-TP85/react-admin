import React, { Component } from "react";
import { Menu } from "antd";
import p1_img from '../../assets/img/logo.png'
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom'
import meun from '../../config/meun'

const { SubMenu,Item } = Menu;

export default class LeftNav extends Component { 

  //渲染方法一
  getMeun1 = (arr) => {
     return arr.map((item)=>{
      if(!item.children){
        return (
          <Item key={item.id} icon={item.icon}>
            <Link to={item.path}>
              {item.text}
            </Link>
          </Item>
        )
      } else {
        return (
          <SubMenu key={item.id} title={item.text}>
              {this.getMeun1(item.children)}
          </SubMenu>
        )
      }
    })
  }

  //渲染方法二
  getMeun2 = (arr) => {
    return arr.reduce((pre,item)=>{
      if(!item.children) {
        pre.push((
          <Item key={item.id} icon={item.icon}>
            <Link to={item.path}>
              {item.text}
            </Link>
          </Item>
        ))
      } else {
        pre.push((
          <SubMenu key={item.id} title={item.text}>
              {this.getMeun2(item.children)}
          </SubMenu>
        ))
      }
      //pre 当前统计的结果 作为下次统计的上一次统计结果
      return pre
    },[])
  }

  componentWillMount() {
    //这样写的只调用一次
    this.willRender = this.getMeun2(meun);
  }

  render() {
    return (
      <div>
        <div className='nav_left_header'>
            <img className='p1_img' src={p1_img} alt='图片加载失败'/>
            <h2>硅谷后台</h2>
        </div>
        <div>
          
          <Menu
            defaultSelectedKeys={["1"]} //默认选中项
            // defaultOpenKeys={["sub1"]} 默认展开哪一个
            mode="inline"
            theme="dark"
          >

            {
               this.willRender
                // navData.map(((item)=>{
                    
                //     if(!item.children.length) {

                //         return (
                //             <Menu.Item key={item.id} icon={item.icon}>
                //               <Link to={item.path}>
                //                 {item.text}
                //               </Link>
                //             </Menu.Item>
                //         )
                //     } else {
                //         return (
                //             <SubMenu key={item.id} title={item.text} icon={item.icon}>
                //                 {
                //                     item.children.map((d)=>{
                //                         return (
                //                             <Menu.Item key={d.id} icon={d.icon}>
                //                               <Link to={d.path}>
                //                                 {d.text}
                //                               </Link>
                //                             </Menu.Item>
                //                         )
                //                     })
                //                 }
                //             </SubMenu>
                //         )
                //     }
                // }))
            }

          </Menu>
        </div>
      </div>
    );
  }
}
