import React from "react";
import "../css/contact.css";
import Navbar from "./NavBar";

const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p className="contact-subtitle">We'd love to hear from you. Reach out with any questions or feedback!</p>

        <div className="contact-content">
          {/* Contact Form */}
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Send Message</button>
          </form>

          {/* Contact Info */}
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p>Email: support@aiexplorer.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Address: yyyy</p>
            <div className="socials">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
              <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
