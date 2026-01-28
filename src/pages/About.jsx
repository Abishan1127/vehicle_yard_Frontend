import logoImage from "../assets/images/bird-colorful-gradient-design-vector_343694-2506.avif";

export default function About() {
  return (
    <div>
      {/* Header Section */}
      <div className="mb-5">
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-6">
            <img 
              src={logoImage} 
              alt="Vehicle Yard Logo"
              style={{ width: "100%", maxWidth: 300, height: "auto" }}
              className="img-fluid"
            />
          </div>
          <div className="col-12 col-md-6">
            <h1 className="mb-3">About Vehicle Yard</h1>
            <p className="lead text-muted">
              Your trusted partner for buying and selling quality vehicles. With years of experience in the automotive industry, we are committed to providing transparent and reliable services.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="bi bi-target"></i> Our Mission
              </h5>
              <p className="card-text">
                To provide a seamless, transparent, and customer-centric platform for buying and selling vehicles. We believe in building long-term relationships with our customers through integrity, quality, and exceptional service.
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="bi bi-eye"></i> Our Vision
              </h5>
              <p className="card-text">
                To become the most trusted vehicle marketplace in Sri Lanka, where buyers and sellers can connect with confidence. We aim to revolutionize the way people buy and sell vehicles through innovation and customer excellence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mb-5">
        <h2 className="mb-4">Why Choose Vehicle Yard?</h2>
        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 text-center">
              <div className="card-body">
                <div className="fs-1 mb-3 text-primary">✓</div>
                <h5 className="card-title">Transparent Pricing</h5>
                <p className="card-text small">No hidden charges. All prices are clearly displayed with detailed vehicle information.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 text-center">
              <div className="card-body">
                <div className="fs-1 mb-3 text-primary">🔒</div>
                <h5 className="card-title">Secure Transactions</h5>
                <p className="card-text small">Your transactions are safe and secure. Professional documentation and verification process.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 text-center">
              <div className="card-body">
                <div className="fs-1 mb-3 text-primary">⭐</div>
                <h5 className="card-title">Quality Assurance</h5>
                <p className="card-text small">Every vehicle is thoroughly inspected to ensure quality and reliability standards.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 text-center">
              <div className="card-body">
                <div className="fs-1 mb-3 text-primary">📞</div>
                <h5 className="card-title">Expert Support</h5>
                <p className="card-text small">Our team is always ready to assist you with any questions or concerns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-5">
        <h2 className="mb-4">Our Core Values</h2>
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="d-flex gap-3">
              <div>
                <h6 className="mb-2">Integrity</h6>
                <p className="text-muted small">We conduct business with complete honesty and transparency. Trust is the foundation of everything we do.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex gap-3">
              <div>
                <h6 className="mb-2">Customer Focus</h6>
                <p className="text-muted small">Your satisfaction is our priority. We listen, understand, and exceed your expectations.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex gap-3">
              <div>
                <h6 className="mb-2">Excellence</h6>
                <p className="text-muted small">We strive for excellence in every aspect of our business, from vehicle selection to customer service.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex gap-3">
              <div>
                <h6 className="mb-2">Innovation</h6>
                <p className="text-muted small">We continuously improve our services and adopt new technologies to serve you better.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Stats */}
      <div className="bg-light p-5 rounded mb-5">
        <h2 className="mb-4 text-center">By The Numbers</h2>
        <div className="row text-center g-4">
          <div className="col-12 col-md-4">
            <div className="mb-3">
              <h3 className="text-primary display-6 mb-0">500+</h3>
              <p className="text-muted">Vehicles Sold</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="mb-3">
              <h3 className="text-primary display-6 mb-0">1000+</h3>
              <p className="text-muted">Happy Customers</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="mb-3">
              <h3 className="text-primary display-6 mb-0">5+</h3>
              <p className="text-muted">Years Experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="card bg-primary text-white">
        <div className="card-body text-center py-5">
          <h3 className="card-title mb-3">Ready to Find Your Perfect Vehicle?</h3>
          <p className="card-text mb-4">Browse our collection of quality vehicles or get in touch with our team for personalized assistance.</p>
          <div className="d-flex gap-2 justify-content-center">
            <a href="/" className="btn btn-light">Browse Vehicles</a>
            <a href="/contact" className="btn btn-outline-light">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
