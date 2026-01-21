import React from 'react'
import BlogCard from '../components/BlogCard'

export default function Blog() {
  return (
    <div>
      <h1>Blog</h1>
      <p>Découvrez nos derniers articles et conseils pour bien choisir votre instrument de musique.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BlogCard title="Article 1" description="Description de l'article 1" image="/images/blog/blog1.jpg" />
        <BlogCard title="Article 2" description="Description de l'article 2" image="/images/blog/blog2.jpg" />
        <BlogCard title="Article 3" description="Description de l'article 3" image="/images/blog/blog3.jpg" />
        <BlogCard title="Article 3" description="Description de l'article 3" image="/images/blog/blog3.jpg" />
        <BlogCard title="Article 3" description="Description de l'article 3" image="/images/blog/blog3.jpg" />
        <BlogCard title="Article 3" description="Description de l'article 3" image="/images/blog/blog3.jpg" />
      </div>
    </div>
  )
}
