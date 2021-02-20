// 角色管理
import React, { Component } from 'react'
import { Card, Button, Table } from 'antd'

import { reqRoleList } from '../../api'

export default class Role extends Component {
    state = {
        but_fl: true, //设置角色权限按钮的禁用状态
        role: [] ,//角色管理列表
        selectedRole: {}, //已选择的权限
        loading: false,
        total: 0, //列表总数
    }

    componentDidMount () {
        this.init();
        this.getRoleList();
    }

    //获取角色列表
    getRoleList = async () => {
        let res = await reqRoleList();
        if(res && res.status===200) {
            let { data } = res.data;
            console.log(data);
            this.setState({total: data.length, role: data})
        }
        
    }

    //Table的onRow事件
    onRow = (record) => {
        return {
            onClick: event => {// 点击行
                console.log(record);
            }, 
            // onDoubleClick: event => {},
            // onContextMenu: event => {},
            // onMouseEnter: event => {}, // 鼠标移入行
            // onMouseLeave: event => {},
          };
    }

    //分页器change事件
    paginationChange = () => {

    }

    //初始化
    init = () => {
        this.columns = [
            {
                title: "角色名称",
                dataIndex: "name"
            },
            {
                title: "创建时间",
                dataIndex: "create_time"
            },
            {
                title: "授权时间",
                dataIndex: "auth_time",
            },
            {
                title: "授权人",
                dataIndex: "auth_name",
            }
        ]
    }
    
    render() {
        const { but_fl, role, total, loading } = this.state
        const { columns, onRow } = this
        const title = (
            <span>
                <Button type='primary' style={{marginRight: 10}}>创建角色</Button>
                <Button type='primary' disabled={but_fl}>设置角色权限</Button>
            </span>
        )
        return (
            <div className='margin_right'>
                <Card title={title}>
                    <Table dataSource={role} loading={loading} 
                    // 表格前面的单选框  selectedRowKeys:选中的key值
                    rowSelection={{type: 'radio', selectedRowKeys: []}}
                    columns={columns} rowKey='_id' 
                    pagination={{
                        // current: pageNum, 
                        // pageSize, 
                        defaultCurrent: 5,
                        showQuickJumper: true, 
                        total,
                        // onChange: paginationChange
                    }} 
                    onRow={ onRow }
                    >
                    </Table>
                </Card>
            </div>
        )
    }
}
