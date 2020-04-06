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
      autoResize: true,
      drawTitle: true,
      followCursor: true,
      disableCursor: false,
    }
    window.osmd = this.osmd = new OSMD(this.divRef.current, options);
    this.osmd.load(this.props.file).then(() => this.props.sheet.set(this.osmd))
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
    return (<div className="OpenSheetMusicDisplay" ref={this.divRef} />);
  }
}

export default withSheet(OpenSheetMusicDisplay)
