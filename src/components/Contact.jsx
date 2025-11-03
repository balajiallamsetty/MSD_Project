import React from "react";
import "./Contact.css"; // optional, your specific CSS file

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent (placeholder)");
  };

  return (
    <section className="page-contact card">
      <h2 className="page-title">Contact Us</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" placeholder="Your Name" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Your Email" required />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            placeholder="Your Message"
            rows="5"
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          Send
        </button>
      </form>
    </section>
  );
}

export default Contact;
