// src/pages/HomePage.jsx
import React from "react";
import Carousel from "../components/Carousel";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-pink-100 rounded-lg p-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Gamified Learning With Data Structure
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Make learning fun, interactive, and improve concept retention.
          </p>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate("/stack")}
              className="bg-pink-600 text-white px-4 py-2 rounded-md shadow"
            >
              Start Learning — Stack
            </button>
          </div>
        </div>

        {/* Carousel area */}
        <div>
          <Carousel />
        </div>
      </section>

      {/* What do I teach? */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold">What do I teach?</h2>
        <p className="mt-4 text-gray-700 max-w-3xl">
          At Gamified Learning with Data Structures, we focus on teaching the core building blocks of programming through an interactive and visual approach.
Students learn key Data Structures such as Arrays, Stacks with engaging visualizations and real-time operations.
Each topic includes hands-on challenges, instant feedback, and game-like rewards to make learning exciting.
Our aim is to help learners not just memorize, but truly understand how data structures work internally.
By combining fun with logic, we make complex concepts simple, visual, and enjoyable to master.
        </p>

        <div className="mt-6">
          <button onClick={() => navigate("/about")} className="bg-blue-950 text-white px-4 py-2 rounded-md">
            About me
          </button>
        </div>
      </section>

      {/* Cards for Stack and Array */}
      <section className="mt-12 grid md:grid-cols-2 gap-6">
        <article className="p-6 border rounded-lg bg-sky-100">
          <h3 className="text-xl font-semibold">Stack</h3>
          <p className="mt-2 text-gray-700">
            A stack is a data structure where the last element added is the first one to be removed (LIFO).
          </p>
          <div className="mt-4">
            <button onClick={() => navigate("/stack")} className="text-blue-950 underline">
              Go to Stack
            </button>
          </div>
        </article>

        <article className="p-6 border rounded-lg bg-pink-100">
          <h3 className="text-xl font-semibold">Array</h3>
          <p className="mt-2 text-gray-700">
            An array is a data structure that stores multiple elements of the same type in a continuous memory location.
It allows easy access to elements using their index.
          </p>
          <div className="mt-4">
            <button onClick={() => navigate("/array")} className="text-blue-950 underline">
              Go to Array
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
