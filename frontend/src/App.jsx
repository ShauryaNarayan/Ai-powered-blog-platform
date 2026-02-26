import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import WriteEdit from './pages/WriteEdit';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container main-content">
        <Switch>
          {/* Note the use of "exact" so it only matches the root URL */}
          <Route exact path="/">
            <Home />
          </Route>
          
          <Route exact path="/post/:id">
            <PostDetail />
          </Route>
          
          <Route exact path="/write">
            <WriteEdit />
          </Route>
          
          <Route exact path="/edit/:id">
            <WriteEdit />
          </Route>

          {/* Fallback Redirect: If the user types a random URL, send them home */}
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;