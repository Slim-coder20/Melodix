import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ title, description, image }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-700 text-sm md:text-base mb-4">{description}</p>
        <Link
          to="#"
          className="text-blue-600 hover:text-blue-800 font-semibold text-sm md:text-base"
        >
          Lire la suite →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;

