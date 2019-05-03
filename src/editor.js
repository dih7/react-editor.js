import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorJS from '@brandontle/editorjs';
import commonTools from './common-tools';

class Editor extends Component {
  static defaultProps = {
    holderId: 'editorjs-holder',
    customTools: {},
    excludeDefaultTools: [],
    onChange: () => {},
    onReady: () => {},
    data: {},
    autofocus: true,
    readOnly: false,
  };

  static propTypes = {
    holderId: PropTypes.string,
    customTools: PropTypes.object,
    excludeDefaultTools: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
    onReady: PropTypes.func,
    data: PropTypes.object,
    autofocus: PropTypes.bool,
    readOnly: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this._tools = this._initTools(props.tools, props.excludeTools);
    this.readOnly = props.readOnly;
    this._onChange = props.onChange;
    this._onReady = props.onReady;

    this._el = React.createRef();
  }

  async componentDidMount() {
    this._initEditor();
  }

  componentWillUnmount() {
    if (typeof this.editor.destroy !== 'undefined') {
      this.editor.destroy();
    }
  }

  _initEditor = () => {
    const { holderId, autofocus, data } = this.props;
    this.editor = new EditorJS({
      holderId,
      autofocus,
      data,
      tools: this._tools,

      onChange: this._handleChange,
      onReady: this._handleReady,
    });
    return this.editor;
  };

  _initTools = () => {
    const { customTools, excludeDefaultTools } = this.props;
    const toolsList = { ...commonTools, ...customTools };

    if (excludeDefaultTools.length !== 0) {
      return Object.keys(toolsList)
        .filter(tool => !excludeDefaultTools.includes(tool))
        .reduce((acc, curr) => ({ ...acc, [curr]: toolsList[curr] }), {});
    }

    return toolsList;
  };

  _handleChange = async () => {
    const data = await this.editor.save();
    this._onChange(data);
  };

  _handleReady = () => {
    this._onReady();

    // disable editing if readOnly
    if (this.readOnly) {
      // turn contentEditables false
      const editables = document.querySelectorAll('[contentEditable="true"]');
      editables.forEach(element => {
        element.setAttribute('contentEditable', 'false');
        element.style['background-image'] = 'unset';
      });

      // hide control elements (.ce-toolbar__actions)
      const controlElements = document.querySelectorAll('.ce-toolbar__actions');
      controlElements.forEach(element => {
        element.style.display = 'none';
      });
    }
  };

  render() {
    const { holderId } = this.props;
    return React.createElement('div', {
      id: holderId,
      ref: this._el,
    });
  }
}

export default Editor;
