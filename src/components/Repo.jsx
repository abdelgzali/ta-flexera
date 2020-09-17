import React, { useState, useEffect } from "react";

function Repo({ repoData, updateCachedFlag, index }) {

  return (
    <div className="repo">
      <figure>
        <img src={repoData.owner.avatar_url} alt="avatar" />
        <figcaption>
          <h3>{repoData.full_name}</h3>
          <p>{repoData.description}</p>
        </figcaption>
      </figure>
      <span
        className={repoData.flagged ? "material-icons star active" : "material-icons star"}
        onClick={(e) => updateCachedFlag(index)}
      >
        star
      </span>
    </div>
  );
}

export default Repo;
