import {
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    HomeOutlined,
    BarChartOutlined,
    LineChartOutlined
  
  } from "@ant-design/icons";

const arr = [
  {
    id: '1',
    text: '首页',
    icon: <HomeOutlined/>,
    path: '/admin/home'
  },{
    id: '2',
    text: '商品',
    icon: <AppstoreOutlined/>,
    path: '',
    children: [
        {
            id: '3-1',
            text: '品类管理',
            icon: <MenuUnfoldOutlined/>,
            path: '/admin/category'
        },{
            id: '3-2',
            text: '商品管理',
            icon: <PieChartOutlined/>,
            path: '/admin/product/productHome'
        }
    ]
  },{
    id: '3',
    text: '用户管理',
    icon: <DesktopOutlined/>,
    path: '/admin/user'
  },{
    id: '4',
    text: '角色管理',
    icon: <ContainerOutlined/>,
    path: '/admin/role'
  },{
    id: '5',
    text: '图形管理',
    icon: <MenuFoldOutlined/>,
    path: '/admin/charts',
    children: [
      {
          id: '5-1',
          text: '柱状图',
          icon: <BarChartOutlined/>,
          path: '/admin/bar'
      },{
          id: '5-2',
          text: '折线图',
          icon: <LineChartOutlined/>,
          path: '/admin/line'
      },{
          id: '5-3',
          text: '饼图',
          icon: <PieChartOutlined/>,
          path: '/admin/pie'
      }
    ],
  }
]

export default arr