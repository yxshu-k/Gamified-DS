// src/components/Carousel.jsx
import React, { useState, useEffect } from "react";

const slides = [
  {
    src: "/carousel/image3.jpg",
    quote: "“Data structures turn complexity into clarity.”",
    author: "— Tech Guru",
  },
  {
    src: "/carousel/photo1.jpg",
    quote: "“Understanding data structures is understanding how to think like a programmer.”",
    author: "— Learning Quote",
  },
  {
    src: "/carousel/photo2.jpg",
    quote: "“Practice with structures to build efficient solutions.”",
    author: "— DS Enthusiast",
  },
  {
    src: "/carousel/photo3.jpg",
    quote: "“The best way to learn is by doing.”",
    author: "— Code Master",
  },
  {
    src: "/carousel/photo4.jpg",
    quote: "“Data structures are the building blocks of algorithms.”",
    author: "— Algorithm Expert",
  },
  {
    src: "/carousel/photo5.jpg",
    quote: "“Simple solutions come from understanding complex structures.”",
    author: "— Programming Mentor",
  },
  {
    src: "/carousel/photo6.jpg",
    quote: "“Knowledge of data structures is power in programming.”",
    author: "— Tech Leader",
  },
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative bg-gray-50 rounded-lg overflow-hidden shadow">
      <div className="h-72 md:h-80 w-full">
        <img
          src={slides[index].src}
          alt={`slide-${index}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-md max-w-xs">
        <p className="text-sm italic"> {slides[index].quote} </p>
        <p className="text-xs mt-1 text-gray-600">{slides[index].author}</p>
      </div>

      {/* dots */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${i === index ? "bg-gray-800" : "bg-gray-300"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
