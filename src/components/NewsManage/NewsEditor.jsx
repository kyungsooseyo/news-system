import React, { useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './newEditor.scss'
export default function NewsEditor(props) {
  const [editorState, setEditorState] = useState('')
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
