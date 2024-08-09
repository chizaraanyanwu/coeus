// 404 / Error Page 
import "../css/default.css";
import '../css/NoPage.module.css';

import errorMessage from  "../images/errorMessage.png"
const NoPage = () => {
  return (
    <div className={NoPage.err_cont}>
      {/* Add an image... eventually  */}
      <img src={errorMessage} alt="Dessert cacti showing the words 'Error 404'" />
      
      <h1>404</h1>
      <p>No page available... try going back!</p>
    </div>
  ); 
};

export default NoPage;
