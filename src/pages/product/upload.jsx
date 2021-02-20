import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { reqImgDelete } from '../../api/index'

//读取文件的方法 FileReader对象是H5提供的读取上传文件的构造函数
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); //读取文件 这是一个异步操作 
      reader.onload = () => resolve(reader.result); //文件读取成功
      reader.onerror = error => reject(error); //文件读取失败
    });
  }

export default class ProductUpload extends Component {
    state = {
        previewVisible: false, //预览的Modal组件的显示隐藏标志位
        previewImage: '', //预览时的img的src
        previewTitle: '', //预览时的img名称
        //已经上传的文件 准备一个数组接收
        fileList: [
        //   {
        //     uid: '-1',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //   },
        //   {
        //     uid: '-2',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //   },
        //   {
        //     uid: '-3',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //   },
        //   {
        //     uid: '-4',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //   },
        //   {
        //     uid: '-xxx',
        //     percent: 50,
        //     name: 'image.png',
        //     status: 'uploading',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //   },
        //   {
        //     uid: '-5',
        //     name: 'image.png',
        //     status: 'error',
        //   },
        ],
      };

      //返回满足提交信息的image的name属性
      getImgs = () =>{
          return this.state.fileList.map(item => {
              return item.name
          })
      }
    
      //点击空白处时 关闭Modal组件的回调
      handleCancel = () => this.setState({ previewVisible: false });
    
      //Upload组件的点击图片预览的回调
      handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
          previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
      };
    
      //Upload组件的change事件 上传或者删除都要对fileList数组进行操作
      handleChange = async ({ file, fileList }) => {
        //file: 当前操作的文件,包过上传的和删除的
          if(file.status === 'done') { //上传完成
              let res = file.response;
              if(res.status === 0) { //上传成功
                let {name,url} = res.data;
                file = fileList[fileList.length-1];
                file.name = name;
                file.url = url;
                message.success('上传图片成功')
              } else {
                  message.error('上传图片失败')
              }
          } else if(file.status === 'removed') { //删除图片
            let r = await reqImgDelete({name: file.name});
            if(r && r.data && r.status === 200) {
                let {data} = r;
                if(data.status === 0) {
                    message.success('图片已删除')
                } else {
                    message.error('删除图片失败')
                }
            }
          }
          this.setState({ fileList })
      };

      componentDidMount() {
          //修改的情况下才会有this.props.state传过来 修改的时候需要把原先有的商品图片显示出来 让用户看到
          let state = this.props.state
          if(state && state.imgs && state.imgs.length) {//修改时
              let fileList = state.imgs.map((item,i) => {
                return {
                    uid: '-' + (i + 1), //antd官网建议我们写成负数 
                    name: item,
                    status: 'done',
                    url: '/api/upload/' + item,
                }
              })
            this.setState({ fileList})
          }
      }
    
      render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        );
        return (
          <div>
            <Upload
              action="/api/manage/img/upload"   //action:上传地址
              accept="image/*"                  //指定文件只能是image
              name='image'                      //请求参数名,参数值就是这个文件
              listType="picture-card"           //listType: Upload组件的主题样式(有三套)
              fileList={fileList}               //fileList: 已经上传的文件列表
              onPreview={this.handlePreview}    //预览回调函数
              onChange={this.handleChange}      
            >
              {fileList.length >= 8 ? null : uploadButton}  {/*限制可上传图片数量*/}
            </Upload>
            <Modal
              visible={previewVisible}           //Modal组件是否展示
              title={previewTitle}               //Modal组件标题
              footer={null}                      //取消Modal组件底部自带的 确认取消按钮
              onCancel={this.handleCancel}       //关闭Modal组件的回调
            >
              <img alt="预览失败" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        );
      }
}
