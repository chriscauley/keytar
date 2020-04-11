import React from 'react'
import 'react-piano/dist/styles.css'
import OSMD from './OpenSheetMusicDisplay'

import Status from './Status'
import Keyboard from './Keyboard'

const Game = (props) => {
  const { filename } = props.match.params
  return (
    <div>
      <Status />
      <Keyboard />
      <OSMD file={'/musicxml/' + filename} />
    </div>
  )
}

export default Game
