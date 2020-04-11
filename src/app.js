import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, HashRouter, Route, Link } from 'react-router-dom'
import 'react-piano/dist/styles.css'

import SongPicker from './SongPicker'
const musicfiles = require('./musicxml.json')
import withSheet from './withSheet'
import { ConfigForm } from './config'
import Game from './Game'
import CSSDocs from './css/docs'

const _chain = (f1, f2) => (a) => {
  f1(a)
  f2(a)
}

class BaseApp extends React.Component {
  constructor(props) {
    super(props)
    // Don't call this.setState() here!
    this.state = { file: musicfiles[1], pressedNotes: {} }
  }

  render() {
    return (
      <div className="App">
        <div className="container mx-auto">
          <BrowserRouter>
            <Route exact path="/" component={SongPicker} />
            <Route path="/play/:filename" component={Game} />
            <div className="fixed bottom-0 right-0 text-4xl">
              <Link to="/" className="fa fa-home p-4"></Link>
              <a href="#/docs/css" className="fa fa-paint-brush p-4"></a>
              <a href="#/config" className="fa fa-gear p-4"></a>
            </div>
          </BrowserRouter>
          <HashRouter>
            <Route path="/config" component={ConfigForm} />
            <Route path="/docs/css" component={CSSDocs} />
          </HashRouter>
        </div>
      </div>
    )
  }
}

const App = withSheet(BaseApp)

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
