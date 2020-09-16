import React, { useState, useEffect } from "react";

function Repo({ repoData, updateCachedFlag, index }) {
  const [localFlag, setLocalFlag] = useState(repoData.flagged);

  // toggles flag and updates cache and local state
  const toggleFlag = () => {
    const tempFlag = !localFlag;
    setLocalFlag(tempFlag);
    updateCachedFlag(tempFlag, index);
  };

  // updates local state on render
  useEffect(() => {
    setLocalFlag(repoData.flagged);
  }, [repoData]);

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
        className={localFlag ? "material-icons star active" : "material-icons star"}
        onClick={(e) => toggleFlag()}
      >
        star
      </span>
    </div>
  );
}

export default Repo;
