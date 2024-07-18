import React from 'react';
import { withRouter } from "react-router";



function UserPage() {
  return (
    <div>
      <p>This is the second page.</p>
    </div>
  );
}

export default UserPage;
// export default withRouter(UserPage);


// import { useParams } from 'react-router-dom';

// export default function UserPage() {

// let { id } = useParams();

// return (

// <>

// <h1>Hello there user {id}</h1>

// <p>This is your awesome User Profile page</p>

// </>

// );

// }

