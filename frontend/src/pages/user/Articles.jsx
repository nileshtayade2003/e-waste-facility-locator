import React, { useEffect, useState } from "react";
import axios from 'axios'


const Articles = () => {
  const [articles,setArticles] = useState([]);
  const [loading,setLoading] = useState(false);

  // article data getting from news api.org
  useEffect( ()=>{
    const getArticles =async ()=>{
      try {
        setLoading(true);
        const response = await axios.get('https://newsapi.org/v2/everything?q=E-waste&apiKey=1d20ee841f36402c9f2f978907e3bc04')
        setArticles(response.data.articles)
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error.message)
      }
    }
    getArticles();
  },[])
  

  return (
    <div className="container mt-5">
      <div className="mt-5">
        <h2 className="mb-4 text-center" style={{ marginTop: "70px" }}>
          Articles
        </h2>
        <div className="row">
          {loading ? (
           <div className="col-12 text-center">
             <div className="spinner-border text-primary mt-4 mb-4" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="sr-only"> </span>
            </div>
           </div>
          ) : (
            articles.slice(0, 9).map((article, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card">
                  <img
                    src={article.urlToImage}
                    className="card-img-top"
                    alt={article.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{article.title}</h5>
                    <p className="card-text">
                      {article.description.length > 100
                        ? `${article.description.substring(0, 100)}...`
                        : article.description}
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;
