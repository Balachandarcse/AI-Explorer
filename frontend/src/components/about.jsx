import React from "react";
import "../css/about.css"; // Optional: if you want custom styling

const About = () => {
  return (
    <div className="about-page">
      <h1>About Us</h1>
      <p>
        Welcome to MyApp! We are committed to providing you with the best AI tools
        discovery experience. Whether you're a developer, researcher, or tech enthusiast,
        our platform helps you explore, search, and learn about various AI tools.
      </p>

      <h2>Our Mission</h2>
      <p>
        Our mission is to make AI tools accessible, understandable, and easily searchable
        for everyone. We aim to connect users with the best resources in the rapidly growing
        world of artificial intelligence.
      </p>

      <h2>What We Offer</h2>
      <ul>
        <li>Explore a curated list of AI tools</li>
        <li>Search and filter tools by category or keyword</li>
        <li>Stay up to date with the latest in AI technology</li>
      </ul>

      <h2>Contact Us</h2>
      <p>
        Have questions or suggestions? Reach out to us via our <a href="/contact">Contact</a> page.
      </p>
    </div>
  );
};

export default About;
