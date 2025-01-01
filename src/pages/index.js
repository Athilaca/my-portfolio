
import { useState, useEffect } from "react";
import skills from "../data/skills"; 
import { motion, AnimatePresence  } from "framer-motion";
import projects from "../data/projects";


const words = [
  "Web Development.",
  "Python Developer",
  "FullStack Developer",
  "Open Source Contribution.",
];

export default function Home({ duration = 2 }) {

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleSkills, setVisibleSkills] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0, x: -50 }, // Start off-screen
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }, // Slide in
  };

  const containerRightVariants = {
    hidden: { opacity: 0, x: 50 }, // Start off-screen
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }, // Slide in
  };



  // Function to update the current word index
  const updateWordIndex = () => {
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
  };

  useEffect(() => {
    const interval = setInterval(updateWordIndex, duration * 1000); // Switch word every `duration` seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [words.length, duration]);

    
  useEffect(() => {
    const handleScroll = () => {
      const newVisibleSkills = skills.filter((_, index) => {
        const element = document.getElementById(`skill-${index}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust the condition to better suit smaller screens
          return rect.top < window.innerHeight - rect.height / 2; // Trigger when half of the skill element is visible
        }
        return false;
      });
      setVisibleSkills(newVisibleSkills.map((skill) => skill.skill));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger on page load
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 } // Adjust threshold as needed
    );
    const section = document.getElementById("experience");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in"); // Add the fade-in class
          }
        });
      },
      { threshold: 0.3 } // Adjust threshold for visibility
    );

    // Select all the project boxes
    const boxes = document.querySelectorAll(".work .box");
    boxes.forEach((box, index) => {
      box.style.setProperty("--delay", `${index * 0.2}s`); // Add a staggered delay
      observer.observe(box);
    });

    return () => {
      // Cleanup the observer
      boxes.forEach((box) => observer.unobserve(box));
    };
  }, []);


  // form submission

  const validate = () => {
    const newErrors = {};

    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name should only contain alphabets.';
    }
    if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (formData.phone && (!/^\d{10}$/.test(formData.phone))) {
      newErrors.phone = 'Phone number must be 10 digits.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return; // Stop submission if validation fails
    }

    setIsSubmitting(true);

  
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send the form data as JSON
      });
    
      if (response.ok) {
        setSubmitStatus('Your message has been sent!');
        setFormData({ name: '', email: '', phone: '', message: '' }); // Clear form after submission
      } else {
        setSubmitStatus('Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('Error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
        <header>
          <a href="/" className="logo">
           
          </a>
          <div id="menu" className="fas fa-bars"></div>
          <nav className="navbar">
            <ul>
              <li>
                <a className="active" href="#home">
                  Home
                </a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#skills">Skills</a>
              </li>
              <li>
                <a href="#education">Education</a>
              </li>
              <li>
                <a href="#work">Work</a>
              </li>
              <li>
                <a href="#experience">Experience</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>
        </header>
       

       
          {/* Hero Section */}
          <section className="home" id="home">
            <div id="particles-js"></div>
            <div className="content">
              
              <h2>
                Hi There,
                <br /> I'm Athila <span>C A</span>
              </h2>
              <p>
                I am into 
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWordIndex} // Use the index as the key to trigger animations
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    
                  >
                        {" "}{words[currentWordIndex]}
                  </motion.span>
                </AnimatePresence>
              </p>
              <a href="#about" className="btn">
                <span>About Me</span>
                <i className="fas fa-arrow-circle-down"></i>
              </a>
              <div className="socials">
                <ul className="social-icons">
                  <li>
                    <a
                      className="linkedin"
                      aria-label="LinkedIn"
                      href="https://www.linkedin.com/in/athila-c-a-07092227b/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="fab fa-linkedin"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      className="github"
                      aria-label="GitHub"
                      href="https://github.com/Athilaca"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="fab fa-github"></i>
                    </a>
                  </li>
                  
                  
                  <li>
                    <a
                      className="instagram"
                      aria-label="Instagram"
                      href="https://www.instagram.com/jigarsable.dev"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dev"
                      aria-label="Dev"
                      href="https://dev.to/jigarsable"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="fab fa-dev"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="image">
              <img
                draggable="false"
                className="tilt"
                src="profile.jpg"
                alt="Hero"
              />
            </div>
            
            
          </section>

          {/* About Section */}
          <section className="about" id="about">
            <h2 className="heading">
              <i className="fas fa-user-alt"></i> About <span>Me</span>
            </h2>
            <div className="row">
             
              <div className="content">
                <h3>I'm Athila</h3>
                <span className="tag">Full Stack Developer</span>
                <p>
                  I am a Full-Stack developer based in Kerala, India.  . A self-taught and experienced Python developer with a robust technical background, specializing in Python, Django, REST
                  API,React, SQL and NoSQL databases and AWS. I have dedicated more than 6 months to focused learning and application of
                  Python. Passionate about constructing scalable and robust applications. Additionally, I am familiar with languages such as
                  JavaScript, Java, and C++, further broadening my technical expertise and adaptability across various technology stacks.
                  Possess excellent communication skills, enabling effective collaboration and the ability to prioritize and meet deadlines.I am very
                  passionate about improving my coding skills & developing
                  applications & websites
                </p>
                <div className="box-container">
                  <div className="box">
                    <p>
                      <span>email :</span>athilaca26@gmail.com
                    </p>
                    <p>
                      <span>place :</span> Kerala, India - 683503
                    </p>
                  </div>
                </div>
                <div className="resumebtn">
                  <a
                    href="https://drive.google.com/file/d/119G0_cwkjL5bymIL_g_ky8oOaXO0AAND/view?usp=sharing"
                    target="_blank"
                    className="btn"
                    rel="noreferrer"
                  >
                    <span>Resume</span>
                    <i className="fas fa-chevron-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="heading">
              <i className="fas fa-laptop-code"></i> Skills & <span>Abilities</span>
            </h2>
            <div className="skills-grid">
              {skills.map((skillData, index) => (
                <div key={index} id={`skill-${index}`} className="skill">
                  <img src={skillData.icon} alt={skillData.skill} className="icon" />
                  <div className="progress-container">
                    <div className="skill-name">{skillData.skill}</div>
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{
                          width: visibleSkills.includes(skillData.skill)
                            ? `${skillData.level}%`
                            : "0%",
                        }}
                      >
                        {visibleSkills.includes(skillData.skill) &&
                          `${skillData.level}%`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="education" id="education">
            <h1 className="heading"><i className="fas fa-graduation-cap"></i> My <span>Education</span></h1>
             <p className="qoute">Education is not the learning of facts, but the training of the mind to think.</p>
              <div className="box-container">
                <div className="box">
                    <div className="image">
                    <img draggable="false" src="education/alameen.jpg" alt=""/>
                    </div>
                    <div className="content">
                    <h3>Bachelor of Physics with Computer Application</h3>
                    <p>Al Ameen College ,Edathala | MAHATHMA GHANDHI UNIVERSITY</p>
                    <h4>2020-2023 | Completed</h4>
                    </div>
                </div>
                <div className="box">
                  <div className="image">
                  <img draggable="false" src="education/edapally.jpeg" alt=""/>
                  </div>
                  <div className="content">
                  <h3>HSC Science </h3>
                  <p>Govt HSS Edappally | STATE</p>
                  <h4>2018-2020 | Completed</h4>
                  </div>
                </div>
   
              </div>
          </section>

          <section className="work" id="work">

            <h2 className="heading"><i className="fas fa-laptop-code"></i> Projects <span>Made</span></h2>

            <div className="box-container">
            {projects.map((project, index) => (

              <div className="box tilt" key={index} 
            >
                <img draggable="false" src={project.imgSrc} alt="" />
                <div className="content">
                  <div className="tag">
                  <h3>{project.title}</h3>
                  </div>
                  <div className="desc">
                    <p>{project.description}</p>
                   
                    <div className="btns">
                    {project.viewLink && (
                      <a href="#" className="btn" target="_blank"><i className="fas fa-eye"></i> View</a>    )}
                      <a href={project.codeLink} className="btn" target="_blank">Code <i className="fas fa-code"></i></a>
                       
                    </div>
                  </div>
                </div>
              </div>    

              
             ))}
            </div>
          </section>

          <section className="experience" id="experience">
            <h2 className="heading">
              <i className="fas fa-briefcase"></i> Experience
            </h2>
            <div className="timeline">
              <motion.div
                className="container right"
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={containerRightVariants}
              >
                <div className="content">
                  <div className="tag">
                    <h2>Algotech Solutions</h2>
                  </div>
                  <div className="desc">
                    <h3>Python Full Stack Developer</h3>
                    <p>   At Algotech Solutions, I contributed as a Software Developer, honing key 
              skills like <strong>time management</strong>, <strong>effective communication</strong>, 
              and <strong>problem-solving</strong> and <strong>interpersonal skills</strong>.I collaborated with cross-functional teams, 
              met tight deadlines, and effectively communicated technical concepts to diverse stakeholders, 
              delivering high-quality solutions in dynamic environments..(July 2024 - present)</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="container left"
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={containerVariants}
              >
                <div className="content">
                  <div className="tag">
                    <h2>Brototype</h2>
                  </div>
                  <div className="desc">
                    <h3>Web Developer | Internship</h3>
                    <p>
                      Brototype is a internship program to learn coding. The main
                      attractivness of this internship is <strong>self-learning</strong>. They provide
                      proper guidence to learn and make ourselves to become a software
                      Developer (August 2023 - June 2024)
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="contact" id="contact">
            <h2 className="heading">
              <i className="fas fa-headset"></i> Get in <span>Touch</span>
            </h2>

            <div className="container">
              <form id="contact-form" method="POST" onSubmit={handleSubmit} className="form-card">
                <div className="form-group">
                  <div className="field">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <i className="fas fa-user"></i>
                    {errors.name && <p className="error">{errors.name}</p>}
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <i className="fas fa-envelope"></i>
                    {errors.email && <p className="error">{errors.email}</p>}
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <i className="fas fa-phone-alt"></i>
                    {errors.phone && <p className="error">{errors.phone}</p>}

                  </div>
                  <div className="message">
                    <textarea
                      placeholder="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                    {errors.message && <p className="error">{errors.message}</p>} 
                  </div>
                </div>
                <div className="button-area">
                {submitStatus && <p className="status">{submitStatus}</p>}
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}{" "}
                    <i className="fa fa-paper-plane"></i>
                  </button>
                </div>

              </form>
            </div>
          </section>


          <section className="footer">

            <div className="box-container">

                <div className="box">
                  
                    <p>Thank you for visiting my personal portfolio website. Connect with me over socials 🚀. </p>
                </div>

                <div className="box">
                    <h3>quick links</h3>
                    <a href="#home"><i className="fas fa-chevron-circle-right"></i> home</a>
                    <a href="#about"><i className="fas fa-chevron-circle-right"></i> about</a>
                    <a href="#skills"><i className="fas fa-chevron-circle-right"></i> skills</a>
                    <a href="#education"><i className="fas fa-chevron-circle-right"></i> education</a>
                    <a href="#work"><i className="fas fa-chevron-circle-right"></i> work</a>
                    <a href="#experience"><i className="fas fa-chevron-circle-right"></i> experience</a>
                </div>

                <div className="box">
                    <h3>contact info</h3>
                    <p> <i className="fas fa-phone"></i>+91 7907432513</p>
                    <p> <i className="fas fa-envelope"></i>athilaca26@gmail.com</p>
                    <p> <i className="fas fa-map-marked-alt"></i>kerala, India-683503</p>
                    <div className="share">

                        <a href="https://www.linkedin.com/in/athila-c-a-07092227b/" className="fab fa-linkedin" aria-label="LinkedIn" target="_blank"></a>
                        <a href="https://github.com/Athilaca" className="fab fa-github" aria-label="GitHub" target="_blank"></a>
                        <a href="mailto:athilaca26@gmail.com" className="fas fa-envelope" aria-label="Mail" target="_blank"></a>
                      
                    </div>
                </div>
            </div>
          </section>        
    </>
  );
};


