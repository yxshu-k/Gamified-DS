import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import missionsData from "../data/arraymissions.json";
import { leaderboardAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function ArrayStoryMission() {
  const [missions, setMissions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [savingScore, setSavingScore] = useState(false);
  const [saveError, setSaveError] = useState("");
  const { isAuthenticated } = useAuth();

  // Helper: shuffle an array without mutating the original
  const shuffleArray = (arr) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  // Pick random 10 missions each time and shuffle options inside each mission
  useEffect(() => {
    if (missionsData && missionsData.length > 0) {
      const shuffledMissions = shuffleArray(missionsData)
        .slice(0, Math.min(10, missionsData.length))
        .map((m) => ({
          ...m,
          options: shuffleArray(m.options || []),
        }));

      setMissions(shuffledMissions);
    }
  }, []);

  const handleDragEnd = (result, index) => {
    if (!result.destination) return;
    const currentOptions = Array.from(answers[index] || missions[index].options);
    const [movedItem] = currentOptions.splice(result.source.index, 1);
    currentOptions.splice(result.destination.index, 0, movedItem);
    setAnswers({ ...answers, [index]: currentOptions });
  };

  const handleSubmit = async () => {
    let newScore = 0;

    missions.forEach((m, i) => {
      const userOrder = answers[i] || m.options;

      // For these array missions, the data uses a *single* correct answer string.
      // We'll treat the option placed at the first position as the player's choice.
      const selectedAnswer = Array.isArray(userOrder) ? userOrder[0] : userOrder;
      const correct = selectedAnswer === m.answer;

      if (correct) newScore++;
    });

    setScore(newScore);
    setSubmitted(true);
    
    // Save score to backend if user is logged in
    if (isAuthenticated) {
      setSavingScore(true);
      setSaveError("");
      
      try {
        await leaderboardAPI.updateMissionScore("Array", newScore, missions.length);
        setScoreSaved(true);
      } catch (error) {
        setSaveError(error.message || "Failed to save score");
        console.error("Error saving story mission score:", error);
      } finally {
        setSavingScore(false);
      }
    }
  };

  const restartGame = () => {
    if (missionsData && missionsData.length > 0) {
      const shuffledMissions = shuffleArray(missionsData)
        .slice(0, Math.min(10, missionsData.length))
        .map((m) => ({
          ...m,
          options: shuffleArray(m.options || []),
        }));

      setMissions(shuffledMissions);
    }
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  if (missions.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600">Loading missions...</p>
        <p className="text-gray-400 text-sm mt-2">Please add missions to arraymissions.json</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 mt-8 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        🚀 Story Missions: Array Adventures
      </h1>

      {!submitted ? (
        <>
          {missions.map((mission, index) => (
            <div
              key={mission.id || index}
              className="mb-6 border-b border-gray-200 pb-6 last:border-none"
            >
              <h2 className="text-lg font-semibold text-blue-600 mb-2">
                Mission {index + 1}: {mission.story}
              </h2>
              <p className="text-gray-700 mb-3">{mission.question}</p>

              <DragDropContext
                onDragEnd={(result) => handleDragEnd(result, index)}
              >
                <Droppable droppableId={`options-${index}`}>
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {(answers[index] || mission.options).map((opt, i) => (
                        <Draggable
                          key={`${index}-${i}-${opt}`}
                          draggableId={`${index}-${i}-${opt}`}
                          index={i}
                        >
                          {(provided) => (
                            <li
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="bg-blue-50 p-3 rounded-md shadow hover:bg-blue-100 cursor-move"
                            >
                              {opt}
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          ))}

          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit All Missions
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎯 Mission Summary</h2>
          
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
                  ✅ Score saved to leaderboard! Keep playing to earn more points! 🏆
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
          
          {missions.map((mission, i) => {
            const userOrder = answers[i] || mission.options;
            const selectedAnswer = Array.isArray(userOrder) ? userOrder[0] : userOrder;
            const correct = selectedAnswer === mission.answer;

            return (
              <div
                key={mission.id || i}
                className={`mb-4 p-4 rounded-lg ${
                  correct
                    ? "bg-green-100 border-l-4 border-green-500"
                    : "bg-red-100 border-l-4 border-red-500"
                }`}
              >
                <h3 className="font-semibold">{mission.story}</h3>
                <p className="text-sm text-gray-600 mb-2">{mission.question}</p>
                <p>
                  ✅ Correct Answer: <strong>{mission.answer}</strong>
                </p>
                <p>
                  🧠 Your Answer:{" "}
                  <strong className={correct ? "text-green-700" : "text-red-700"}>
                    {selectedAnswer}
                  </strong>
                </p>
              </div>
            );
          })}

          <h3 className="text-2xl font-bold mt-6">
            Your Final Score: {score} / {missions.length}
          </h3>

          <p className="mt-3 text-gray-700 italic">
            {score === missions.length
              ? "🌟 Perfect! You're an Array Master!"
              : score >= Math.ceil(missions.length * 0.7)
              ? "🔥 Great work! You really understand arrays well."
              : score >= Math.ceil(missions.length * 0.4)
              ? "💪 Keep practicing, you're improving!"
              : "😅 Don't worry! Each mistake is one step closer to mastery."}
          </p>

          <button
            onClick={restartGame}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try New Missions
          </button>
        </div>
      )}
    </div>
  );
}
