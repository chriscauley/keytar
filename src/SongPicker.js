import React from 'react'
import { Link } from 'react-router-dom'

const musicfiles = require('./musicxml.json')

export function SongPicker() {
  return (
    <div>
      {musicfiles.map(({ title, filename }) => (
        <div key={filename}>
          <Link to={`/play/${encodeURIComponent(filename)}`}>{title}</Link>
        </div>
      ))}
    </div>
  )
}
