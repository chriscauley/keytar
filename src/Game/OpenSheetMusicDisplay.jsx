import React, { Component } from 'react';
import { debounce } from 'lodash'
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';
import styled from 'styled-components'

import { pitchToMidiNumber } from '../utils'
import withSheet from '../withSheet'

const Wrapper = styled.div`svg + img { height: 180px }`

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
    return (<Wrapper><div ref={this.divRef}></div></Wrapper>);
  }
}

export default withSheet(OpenSheetMusicDisplay)
