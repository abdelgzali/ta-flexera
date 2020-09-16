import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

function App() {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);

  const getRepos = async () => {
    try {
      const req = await fetch(`https://api.github.com/search/repositories?sort=stars&q=javascript&per_page=10&page=${page}`);
      const res = await req.json();
      console.log(res.items);
    } catch(err) {
      console.log(err)
    }
  };

  useEffect(() => {
    if (page > 0 ) getRepos();
  }, []);

  return ( 
    <div id="app">
      
    </div>
   );
}
 
export default App;

