import React from 'react';
import history from './history';

class PageTwo extends React.Component {
  changePage = () => {
    history.push('/');
  }

  render() {
    return (
      <form onSubmit={this.changePage}>
        <input type="text" />
        <input type="submit" value="back" />
      </form>
    );
  }
};

export default PageTwo;