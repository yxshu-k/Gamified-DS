// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-sky-50 to-white py-12 px-4">
      <div className="container mx-auto bg-white/90 border border-pink-100 rounded-3xl shadow-xl shadow-pink-100 p-8 backdrop-blur">
        <h1 className="text-3xl font-extrabold text-blue-950">
          About Gamified learning with DS
        </h1>
        <p className="mt-4 text-gray-700 max-w-3xl">
        Welcome to Gamified Learning with Data Structures (DS)—a platform designed to make learning Data Structures engaging and interactive. Instead of traditional theory-based learning, our system helps learners visualize operations, practice concepts, and understand DS topics like stacks, queues, and linked lists with ease.

Using gamification elements such as points, levels, and badges, the platform keeps learners motivated and rewards their progress. An integrated dashboard helps track performance and improvement.

Built with React.js, Node.js, Express.js, and MongoDB, the platform delivers a smooth, modern, and user-friendly learning experience.

<br></br>Our goal: to make Data Structures easy, interactive, and enjoyable for every learner.
        </p>
      </div>
    </div>
  );
}
