import React from 'react'
import { useNavigate } from 'react-router-dom'
import NotFoundImage from '../assets/images/404.gif'

const NotFoundPage = () => {
  const navigate = useNavigate();
  const goBack = () =>{
    navigate(-1);
  }


  return (
    <div className="container text-center" style={{ marginTop: '100px' }}>
    <div className="row">
      <div className="col-md-6 offset-md-3">
        <img
          src={NotFoundImage}
          alt="404 Not Found"
          className="img-fluid"
          style={{height:"200px"}}
        />
        <h1 className="mt-4">404 - Page Not Found</h1>
        <p className="lead">
          Oops! The page you are looking for does not exist.
        </p>
        <button onClick={goBack} className="btn btn-primary mt-3">
          Go Back Home
        </button>
      </div>
    </div>
  </div>
  )
}

export default NotFoundPage
