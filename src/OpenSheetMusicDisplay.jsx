import React, { Component } from 'react';
import { debounce } from 'lodash'
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';
import { pitchToMidiNumber } from './utils'
import withSheet from './withSheet'

class OpenSheetMusicDisplay extends Component {
    constructor(props) {
      super(props);
      this.state = { dataReady: false };
      this.osmd = undefined;
      this.divRef = React.createRef();
    }
    setupOsmd() {
      const options = {
        autoResize: this.props.autoResize ? this.props.autoResize : true,
        drawTitle: this.props.drawTitle ? this.props.drawTitle : true,
        followCursor: true,
        disableCursor: false,
      }
      this.osmd = new OSMD(this.divRef.current, options);
      this.osmd.load(this.props.file).then((...args) => {
        const { setCursor=() => {} } = this.props
        this.props.sheet.set(this.osmd)
        const getNotes = () => this.osmd.cursor.NotesUnderCursor().map(n => n.pitch).filter(Boolean)
        setCursor(this.osmd.cursor, getNotes)
      });
      window.OSMD = this
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.resize)
    }
  
    componentDidUpdate(prevProps) {
      if (!this.osmd) {
        this.setupOsmd();
      } else if (this.props.file !== prevProps.file) {
        this.osmd.load(this.props.file).then(() => this.osmd.render());
      }
    }
  
    // Called after render
    componentDidMount() {
      this.setupOsmd();
    }
  
  render() {
      return (<div ref={this.divRef} />);
    }
  }

export default withSheet(OpenSheetMusicDisplay)
