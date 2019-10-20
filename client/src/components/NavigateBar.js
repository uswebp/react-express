import React from 'react'
import { Link } from 'react-router-dom'

class NavigateBar extends React.Component {
  render(){
    return(
      <div>
        <Link to="/">Home(Chat)</Link>
        <Link to="/LinkTest">LinkTest</Link>
      </div>
    )
  }
}

export default NavigateBar;