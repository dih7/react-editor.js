import React from 'react';
import { render } from 'react-dom';
import Editor from '../dist/react-editorjs.umd';

const wrapperStyle = {
  width: '1280px',
  backgroundColor: '#efefef',
  padding: '20px',
  border: '1px solid #e0e0e0',
};

render(
  <div style={wrapperStyle}>
    <Editor excludeDefaultTools={['checklist']} />
  </div>,
  document.getElementById('app'),
);
