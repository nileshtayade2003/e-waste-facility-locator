import React from "react";

const Articles = () => {
  // Sample article data
  const articles = [
    {
      title: "The Importance of E-Waste Recycling",
      summary:
        "E-waste recycling is crucial for reducing environmental impact and conserving resources. Learn why it matters and how you can contribute.",
      link: "/articles/importance-of-e-waste-recycling",
    },
    {
      title: "How to Properly Dispose of Old Electronics",
      summary:
        "Disposing of old electronics requires careful handling to ensure they are processed correctly. Discover the best practices for safe disposal.",
      link: "/articles/proper-disposal-of-electronics",
    },
    {
      title: "The Benefits of Recycling Rare Earth Metals",
      summary:
        "Rare earth metals are essential for many technologies. Recycling them can reduce environmental damage and save resources.",
      link: "/articles/recycling-rare-earth-metals",
    },
    // Add more articles as needed
  ];

  return (
    <div className="container mt-5"   >
    <div className="mt-5" >
      <h2 className="mb-4 text-center " style={{ marginTop: '70px' }}>Articles</h2>
      <div className="row">
        {articles.map((article, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">{article.summary}</p>
                <a href={article.link} className="btn btn-primary">
                  Read More
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default Articles;
