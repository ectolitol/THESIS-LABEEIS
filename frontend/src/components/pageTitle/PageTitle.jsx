import "./pageTitle.scss";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import React from 'react';

const PageTitle = ({ page }) => {
  return (
    <div className="pagetitle">
      <nav>
        <li className="paging-item">
          <a href="/">
          </a>
        </li>
        <li className="paging-item-active">
          <HomeOutlinedIcon className="icon-small" />
          <span className="separator">/</span> {/* Add separator here */}
          {page}
        </li>
      </nav>
    </div>
  );
};

export default PageTitle;
