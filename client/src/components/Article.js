import React from 'react';
import history from '../lib/history';

class PageTwo extends React.Component {
  changePage = () => {
    history.push('/');
  }

  render() {
    return (
      <form onSubmit={this.changePage}>
        <input type="submit" value="back" />
      </form>
    );
  }
};

export default PageTwo;