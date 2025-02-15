import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database, ref, push } from "./firebaseConfig"; // Firebase imports
import "./App.css";
import logo from "./logo.png";
import isteLogo from './isteLogo.png'; 

const questions = [
  { id: 0, type: "mcq", question: "What does “DNS” stand for in networking?", options: [" Domain Name System", "Dynamic Network Service", "Digital Naming Structure", "Data Navigation System"], answer: "Domain Name System" },
  {
    id: 1,
    type: "mcq",
    question: "Which HTTP status code indicates a “Not Found” error?",
    options: [
      "404 ",
      "400",
      "403",
      "500"
    ],
    answer: "404"
  },
  {
    id: 2,
    type: "mcq",
    question: 'What is the output of System.out.println(10 + 20 + "Hello");?',
    options: [
      "1020Hello",
      "10 + 20Hello",
      "30Hello",
      "Hello30"
    ],
    answer: "30Hello"
  },
  {
    id: 3,
    type: "mcq",
    question: "What is the difference between == and === in JavaScript?",
    options: [
      "== checks only value, while === checks both value and type",
      "== checks both value and type, while === checks only value",
      "== is used for comparison, while === is used for assignment",
      "There is no difference between == and === in JavaScript"
    ],
    answer: "== checks only value, while === checks both value and type"
  },
  {
    id: 4,
    type: "mcq",
    question: "What is the purpose of the z-index property in CSS?",
    options: [
      "It adjusts the transparency of an element",
      "It defines the width and height of an element",
      "It controls the vertical stacking order of elements",
      "It sets the spacing between elements"
    ],
    answer: "It controls the vertical stacking order of elements"
  },
  {
    id: 5,
    type: "mcq",
    question: "Which programming language is commonly used for adding interactivity to web pages?",
    options: [
      "HTML",
      "CSS",
      "Latex",
      "JavaScript"
    ],
    answer: "JavaScript"
  },
  {
    id: 6,
    type: "mcq",
    question: "What does CORS stand for?",
    options: [
      "Cross-Origin Resource Sharing",
      "Cross-Origin Request Security",
      "Controlled-Origin Resource System",
      "Client-Origin Response Sharing"
    ],
    answer: "Cross-Origin Resource Sharing"
  },
  {
    id: 7,
    type: "mcq",
    question: "Which of the following is used to handle errors in asynchronous functions in JavaScript?",
    options: [
      "async...await",
      "promise...catch",
      "try...catch",
      "await...throw"
    ],
    answer: "try...catch"
  }, {
    id: 8,
    type: "mcq",
    question: "Which HTTP method is typically used to create new resources on a server?",
    options: [
      "UPDATE",
      "POST",
      "PUT",
      "DELETE"
    ],
    answer: "POST"
  },
  {
    id: 9,
    type: "mcq",
    question: "Which Git command is used to upload local repository content to a remote repository?",
    options: [
      "git pull",
      "git clone",
      "git push",
      "git commit"
    ],
    answer: "git push"
  },
  {
    id: 10,
    type: "mcq",
    question: "Which of the following is a NoSQL database?",
    options: [
      "MySQL",
      "MongoDB",
      "PostgreSQL",
      "SQLite"
    ],
    answer: "MongoDB"
  },
  {
    id: 11,
    type: "mcq",
    question: "Which of the following is a JavaScript runtime built on Chrome's V8 engine?",
    options: [
      "Node.js",
      "React",
      "Angular",
      "Vue.js"
    ],
    answer: "Node.js"
  },
  {
    id: 12,
    type: "mcq",
    question: "Which method is used to convert a JavaScript object into a JSON string?",
    options: [
      "JSON.parse()",
      "JSON.toString()",
      "JSON.convert()",
      "JSON.stringify()"
    ],
    answer: "JSON.stringify()"
  },
  {
    id: 13,
    type: "mcq",
    question: "Which of the following middleware is used to parse JSON data in Express.js?",
    options: [
      "bodyParser.urlencoded()",
      "express.static()",
      "express.json()",
      "multer()"
    ],
    answer: "express.json()"
  },
  {
    id: 14,
    type: "mcq",
    question: "Which of the following is used to install a package globally in Node.js?",
    options: [
      "npm install package_name",
      "npm install -g package_name",
      "node install package_name",
      "npm global package_name"
    ],
    answer: "npm install -g package_name"
  }
];

export default function QuizPage() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState(localStorage.getItem("teamName") || "Unknown Team"); // ✅ Store team name in state
 
  useEffect(() => {
    const storedTeamName = localStorage.getItem("teamName");
    if (storedTeamName) {
      setTeamName(storedTeamName);
    } else {
      setTeamName("Unknown Team"); // Default if not found
    }
  }, []);
 
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem(`quizTimeLeft_${teamName}`);
    return savedTime ? parseInt(savedTime) : 20 * 60; // 30 minutes
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // ✅ Fix: Check if the quiz was submitted before
  // useEffect(() => {
  //   const storedTeamName = localStorage.getItem("teamName") || "Unknown Team";
  //   const isSubmitted = localStorage.getItem(`quizSubmitted_${storedTeamName}`);
  //   const storedScore = localStorage.getItem(`quizScore_${storedTeamName}`);

  //   if (isSubmitted && storedScore !== null) {
  //     setSubmitted(true);
  //     setScore(storedScore);
  //   }
  // }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); // Auto-submit when time runs out
      return;
    }
  
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        localStorage.setItem(`quizTimeLeft_${teamName}`, newTime); // Store team-specific time
        return newTime;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  const handleAnswer = (e) => {
    setAnswers({ ...answers, [currentQuestion]: e.target.value });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  // ✅ Fix: Make sure scoring is correct
  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach((q, index) => {
      // Debugging Information
      console.log(`Question ${index + 1}:`);
      console.log("Your Answer:", answers[index]);
      console.log("Correct Answer:", q.answer);
  
      // Check if an answer exists and is a string
      if (typeof answers[index] === "string" && 
          answers[index].toLowerCase().trim() === q.answer.toLowerCase().trim()) {
        
        if (index < 5) totalScore += 100;        // First 5 questions => 100 points each
        else if (index < 10) totalScore += 200;  // Next 5 => 200 points each
        else totalScore += 300;                  // Remaining => 300 points each
  
        console.log("Correct! Current Score:", totalScore);
      } else {
        console.log("Incorrect or Not Attempted");
      }
    });
  
    console.log("Final Total Score:", totalScore);
    return totalScore;
  };
  
  

  // ✅ Fix: Ensure `teamName` is defined
  const handleSubmit = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setSubmitted(true);

    const storedTeamName = localStorage.getItem("teamName") || "Unknown Team"; // Fix here

    localStorage.setItem(`quizSubmitted_${storedTeamName}`, "true");
    localStorage.setItem(`quizScore_${storedTeamName}`, finalScore);
    localStorage.removeItem(`quizTimeLeft_${storedTeamName}`);

    try {
      const dbRef = ref(database, `quizResults/${storedTeamName}`);
      await push(dbRef, { teamName: storedTeamName, answers, score: finalScore });
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };
  return (
    <div className="quiz-page">
       <div className="iste-logo-container">
          <img src={isteLogo} alt="ISTE Logo" className="iste-logo" />
        </div>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="quiz-container">
        {submitted ? (
          <div className="score-screen">
            <h2>Quiz Completed!</h2>
            <p>
              Your Score: <strong>{score} points</strong>
            </p>
          </div>
        ) : (
          <>
            <div className="timer">
              Time Left: {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </div>
            <div className="question-box">
              <h2>{questions[currentQuestion].question}</h2>
              {questions[currentQuestion].type === "mcq" ? (
                <div className="options">
                  {questions[currentQuestion].options.map((option, index) => (
                    <label key={index} className="option">
                      <input
                        type="radio"
                        name={`q${currentQuestion}`}
                        value={option}
                        onChange={handleAnswer}
                        checked={answers[currentQuestion] === option}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={answers[currentQuestion] || ""}
                  onChange={handleAnswer}
                  className="text-input"
                />
              )}
            </div>
            <div className="buttons">
              <button className="previous" onClick={prevQuestion} disabled={currentQuestion === 0}>
                Previous
              </button>
              {currentQuestion < questions.length - 1 ? (
                <button className="next" onClick={nextQuestion}>Next</button>
              ) : (
                <button className="next" onClick={handleSubmit}>Submit</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
