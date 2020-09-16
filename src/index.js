import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ls from "local-storage"; // package for simpler local storage access
import "./index.css";

// COMPONENT IMPORTS
import Repo from "./components/Repo";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

function App() {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);

  // handles repos data updates, fetches new data from API when no cached data found
  const handleRepos = async () => {
    // check local storage for data before fetching
    if (!ls.get(page)) {
      try {
        const req = await fetch(
          `https://api.github.com/search/repositories?sort=stars&q=javascript&per_page=10&page=${page}`
        );
        const res = await req.json();
        const reposArr = res.items;
        reposArr.forEach((repo) => {
          repo.flagged = false;
        });
        setRepos(reposArr);
      } catch (err) {
        console.log(err);
      }
    } else {
      setRepos(ls.get(page)); // update state from local storage if data found
    }
  };

  const handlePagination = (newPageIndex) => {
    if (newPageIndex >= 1) setPage(newPageIndex);
  };

  // handler for data persistence using local storage
  const handleCache = () => {
    if (ls.get(page)) {
    } else {
      ls.set(page, repos);
    }
  };

  // updates local storage when flag state changes; called in 'repo' child component
  const updateCachedFlag = (isFlagged, index) => {
    console.log("updating flag");
    let tempRepos = ls.get(page);
    tempRepos[index].flagged = isFlagged;
    ls.set(page, tempRepos);
  };

  // get repo data on pagination
  useEffect(() => {
    if (page > 0) handleRepos();
  }, [page]);

  // handle local storage updates when repos are updated
  useEffect(() => {
    if (repos.length > 0) {
      handleCache();
      console.log(repos);
    }
  }, [repos]);

  return (
    <div id="app">
      <h1>Browse Github</h1>
      <div id="app-pagination">
        <button
          onClick={(e) => {
            handlePagination(page - 1);
          }}
        >
          <span class="material-icons">keyboard_arrow_left</span>
        </button>
        <button
          onClick={(e) => {
            handlePagination(page + 1);
          }}
        >
          <span class="material-icons">keyboard_arrow_right</span>
        </button>
      </div>
      <ul>
        {repos.length > 0 &&
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
