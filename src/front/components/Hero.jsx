const Hero = () => {
    return (
      <section className="text-center py-16 bg-light">
        <div className="container">
          <h1 className="display-4 fw-bold">Discover Your Next Favorite Restaurant Today</h1>
          <p className="lead text-muted">
            Welcome to BiteFinder, your ultimate restaurant discovery platform.
            Explore, review, and share your dining experiences with a vibrant community of food lovers.
          </p>
  
          {/* 🔥 Centered Button Group */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="btn btn-dark">Search</button>
            <button className="btn btn-outline-dark">Learn More</button>
          </div>
  
          {/* 🔥 Placeholder Image Area for Reference */}
          <div className="mt-5">
            <div className="bg-secondary" style={{ width: "100%", height: "300px", borderRadius: "8px" }}></div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Hero; // ✅ Exporting as default
  