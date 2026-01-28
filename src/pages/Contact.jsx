import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function validateForm() {
    const newErrors = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Phone validation
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{9,15}$/.test(form.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 9-15 digits";
    }

    // Subject validation
    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (form.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }

    // Message validation
    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    // Simulate sending message
    setTimeout(() => {
      console.log("Contact form submitted:", form);
      
      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setSubmitted(true);
      setLoading(false);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1500);
  }

  return (
    <div>
      <h2 className="mb-4">Contact Us</h2>

      <div className="row">
        <div className="col-12 col-lg-8">
          {submitted && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <h4 className="alert-heading">Thank you!</h4>
              <p className="m-0">Your message has been sent successfully. We will get back to you soon!</p>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSubmitted(false)}
              ></button>
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <div className="invalid-feedback d-block">{errors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                  />
                  {errors.phone && (
                    <div className="invalid-feedback d-block">{errors.phone}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                  />
                  {errors.subject && (
                    <div className="invalid-feedback d-block">{errors.subject}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Message *</label>
                  <textarea
                    className={`form-control ${errors.message ? "is-invalid" : ""}`}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Your message"
                    rows="5"
                  ></textarea>
                  {errors.message && (
                    <div className="invalid-feedback d-block">{errors.message}</div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Contact Information</h5>
              <div className="mb-4">
                <h6 className="text-muted">Address</h6>
                <p className="m-0">Vehicle Yard<br />Sri Lanka</p>
              </div>
              <div className="mb-4">
                <h6 className="text-muted">Phone</h6>
                <p className="m-0">+94 XX XXX XXXX</p>
              </div>
              <div className="mb-4">
                <h6 className="text-muted">Email</h6>
                <p className="m-0">info@vehicleyard.com</p>
              </div>
              <div className="mb-0">
                <h6 className="text-muted">Hours</h6>
                <p className="m-0">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
