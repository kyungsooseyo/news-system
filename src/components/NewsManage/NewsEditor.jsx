import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './newEditor.scss'
export default function NewsEditor(props) {
  const [editorState, setEditorState] = useState('')
  useEffect(() => {
    // html->draft
    const html = props?.content
    // · 撰写新闻的时候是没有传递content的，所以要判断一下
    if (!html) return
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState)
    }
    return () => {
    }
  }, [props.content])
  const handleEditorBlur = () => {
    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(edit) => setEditorState(edit)}
        onBlur={() => handleEditorBlur()}
      />
    </div>
  )
}
