import React, { useState } from "react";
import "../css/contact.css";
import Navbar from "./NavBar";
import axios from "axios";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/contact", {
        name,
        email,
        message,
      });

      alert("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Email send error:", error);
      alert("Failed to send message. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p className="contact-subtitle">
          We'd love to hear from you. Reach out with any questions or feedback!
        </p>

        <div className="contact-content">
          {/* Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>

          {/* Contact Info */}
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p>Email: support@aiexplorer.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Address: yyyy</p>
            <div className="socials">
              <a href="https://www.linkedin.com/in/balachandar-b-cse/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://github.com/Balachandarcse" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
