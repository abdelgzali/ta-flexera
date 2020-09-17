import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ls from "local-storage"; // package for simpler local storage access
import "./index.css";

import Repo from "./components/Repo";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

function App() {
  // initial states
  const initialPage = 1;
  const initialRepoData = ls.get(initialPage) || [];

  const [repos, setRepos] = useState(initialRepoData);
  const [page, setPage] = useState(initialPage);

  const [loading, setLoading] = useState(false);

  // given page number, fetch data from API resource
  const fetchRepos = async (pageNum) => {
    setLoading(true);   // toggle loading screen when fetching new data
    try {
      const req = await fetch(
        `https://api.github.com/search/repositories?sort=stars&q=javascript&per_page=10&page=${pageNum}`
      );
      const res = await req.json();
      // map repo array, add property for flag feature
      const reposArr = res.items.length ? res.items.map((repo) => {
        repo.flagged = false;
        return repo
      }) : [];
      setRepos(reposArr);
      ls.set(pageNum, reposArr);  // update local storage
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handlePagination = (newPageIndex) => {
    if (newPageIndex >= 1) setPage(newPageIndex);
  };

  // updates local storage when flag state changes; called in 'repo' child component
  const updateCachedFlag = (index) => {
    const updatedRepos = [...repos];  // new array copy
    const repo = updatedRepos[index];
    repo.flagged = !repo.flagged;
    updatedRepos[index] = repo;
    ls.set(page, updatedRepos);
    setRepos(updatedRepos);
  };


  // get repos data from local storage when accessing a page
  // fetch new data from resource if no cached data found
  useEffect(() => {
    if (ls.get(page)) {
      setRepos(ls.get(page));
    } else {
      console.log('fetching')
      fetchRepos(page);
    }
  }, [page]);

  return (
    <div id="app">
      <h1>Browse Github</h1>
      <div id="app-pagination">
        <button
          onClick={(e) => {
            handlePagination(page - 1);
          }}
        >
          <span className="material-icons">keyboard_arrow_left</span>
        </button>
        <button
          onClick={(e) => {
            handlePagination(page + 1);
          }}
        >
          <span className="material-icons">keyboard_arrow_right</span>
        </button>
      </div>
      {loading && <span>Loading repos...</span>}
      <ul>
        {!loading && repos.length > 0 &&
          repos.map((repo, index) => {
            return (
              <li key={index}>
                <Repo repoData={repo} updateCachedFlag={updateCachedFlag} index={index}></Repo>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default App;
