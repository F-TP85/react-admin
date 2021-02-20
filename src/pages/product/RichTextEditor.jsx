import React, { Component } from 'react'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default class RichTextEditor extends Component {

    state = {
        editorState: EditorState.createEmpty(), //创建一个空的编辑对象
    }

    onEditorStateChange = (editorState) => { //监听编辑器的change事件
        this.setState({ editorState })
    }

    getDetail = () => { //获取富文本编辑的 html格式的文本  的标签字符串  最终,是要把它提交给后台
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    componentDidMount() {
        if(this.props.state) { //修改数据时接收原有的商品详情内容并把内容添加到富文本里边
            const contentBlock = htmlToDraft(this.props.state.detail);
            if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({ editorState })
            }
        }
    }

    //富文本上传图片的方法  固定格式
    uploadImageCallBack = (file) => {
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', '/api/manage/img/upload')
            const data = new FormData()
            data.append('image', file)
            xhr.send(data)
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText)
              const url = response.data.url // 得到图片的url
              console.log(url);
              resolve({data: {link: url}})
            })
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText)
              reject(error)
            })
          }
        )
    }
    

    render() {
        const { editorState } = this.state
        return (
            <div>
                <Editor
                editorState={editorState}
                editorClassName="editorClassName"
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
                />
                {/* <textarea disabled value={ draftToHtml(convertToRaw(editorState.getCurrentContent())) } /> */}
            </div>
        )
    }
}
