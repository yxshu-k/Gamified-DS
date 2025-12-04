import React, { useState, useEffect } from "react";
import questionsData from "../data/stackQuestions.json";
import { leaderboardAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function QuizSection({ topic = "Stack" }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [savingScore, setSavingScore] = useState(false);
  const [saveError, setSaveError] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Pick 10 random questions from JSON
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
  }, []);

  const handleOptionClick = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: option,
    });
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = async () => {
    setShowResult(true);
    
    // Save score to backend if user is logged in
    if (isAuthenticated) {
      const score = calculateScore();
      setSavingScore(true);
      setSaveError("");
      
      try {
        await leaderboardAPI.updateScore(topic, score, questions.length, 0);
        setScoreSaved(true);
      } catch (error) {
        setSaveError(error.message || "Failed to save score");
        console.error("Error saving score:", error);
      } finally {
        setSavingScore(false);
      }
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) score++;
    });
    return score;
  };

  if (questions.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading quiz...
      </div>
    );

  // ✅ RESULT PAGE
  if (showResult) {
    const score = calculateScore();
    const message =
      score >= 8
        ? "🔥 Excellent! You’re mastering Stack concepts like a pro!"
        : score >= 5
        ? "💡 Good effort! Keep going — you’re improving."
        : "📚 Don’t worry, every engineer learns by trying again.";

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex flex-col items-center py-10">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-blue-900 mb-4 text-center">
            Quiz Results 🎓
          </h1>
          <p className="text-lg text-center text-gray-700 mb-6">
            Your Score:{" "}
            <span className="text-green-700 font-bold text-2xl">
              {score} / {questions.length}
            </span>
          </p>
          <p className="text-center text-gray-600 mb-8 italic">{message}</p>

          {/* Score Saving Status */}
          {isAuthenticated ? (
            <div className="mb-6">
              {savingScore && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded text-center">
                  💾 Saving your score...
                </div>
              )}
              {scoreSaved && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
                  ✅ Score saved to leaderboard! Check your rank now! 🏆
                </div>
              )}
              {saveError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
                  ⚠️ {saveError}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-center mb-6">
              ⚠️ Please <a href="/login" className="underline font-semibold">login</a> to save your score to the leaderboard!
            </div>
          )}

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const correct = userAns === q.answer;

              return (
                <div
                  key={idx}
                  className="border rounded-xl p-4 shadow-sm bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Q{idx + 1}. {q.question}
                  </h3>
                  {q.options.map((opt, i) => {
                    const isUserChoice = userAns === opt;
                    const isCorrectAnswer = opt === q.answer;

                    let colorClass = "";
                    if (isUserChoice && correct)
                      colorClass = "bg-green-200 border-green-500";
                    else if (isUserChoice && !correct)
                      colorClass = "bg-red-200 border-red-400";
                    else if (isCorrectAnswer)
                      colorClass = "bg-green-100 border-green-300";
                    else colorClass = "bg-white border-gray-300";

                    return (
                      <div
                        key={i}
                        className={`px-4 py-2 rounded-lg border my-1 ${colorClass}`}
                      >
                        {opt}
                      </div>
                    );
                  })}
                  <p
                    className={`mt-2 font-semibold ${
                      correct ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {correct
                      ? "✅ You got it right!"
                      : `❌ Correct Answer: ${q.answer}`}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Try Again 🔁
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ QUIZ IN PROGRESS
  const question = questions[currentIndex];
  const userAnswer = selectedAnswers[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">
          {topic} Quiz 🧠
        </h2>

        <div className="text-lg font-semibold text-gray-800 mb-6">
          Q{currentIndex + 1}. {question.question}
        </div>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = userAnswer === option;

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                className={`w-full text-left px-5 py-3 rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? "bg-green-100 border-green-500 text-green-800 font-semibold"
                    : "bg-gray-50 hover:bg-blue-50 border-gray-300"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentIndex === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-800 text-white hover:bg-blue-700"
            }`}
          >
            ⏮ Prev
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-green-700 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold"
            >
              Submit ✅
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="bg-blue-800 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
            >
              Next ⏭
            </button>
          )}
        </div>

        <div className="mt-6 text-gray-500 text-sm text-center">
          Question {currentIndex + 1} / {questions.length}
        </div>
      </div>
    </div>
  );
}
