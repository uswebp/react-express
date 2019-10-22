// import history from 'history/createBrowserHistory';
// 上はサービス切れるらしいからこっち ↓
const history = require("history").createBrowserHistory;

export default history();