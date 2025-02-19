# [josephmars.me](https://josephmars.me)

```
root/
│
├── sitemap.xml
├── index.html
├── data/
│   ├── education.yml
│   └── experience.yml
│   └── projects.yml
├── projects/
│   ├── index.html
├── blog/
│   ├── index.html
│   └── [blog-post-1]/
│       ├── index.html
│       └── content.md
│   └── [blog-post-2]/
│       ├── index.html
│       └── content.md
│   └── ...
├── assets/
│   ├── ...
```


## Important SEO Notes
1. Add a page title.
2. Add open graph meta tags.
3. Add Twitter meta tags.
4. Add SEO meta tags.
5. Add canonical URL.
6. Add Schema.org markup for Google.

### For HTML Pages
```html
  <title>Joseph Martinez - Data Scientist</title>

<!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://josephmars.me/">
  <meta property="og:title" content="Joseph Martinez - Data Scientist">
  <meta property="og:description" content="Data Scientist with 4 years of experience specializing in Machine Learning and Generative AI.">
  <meta property="og:image" content="https://josephmars.me/assets/images/joseph_martinez.jpg">
  <meta property="og:image:width" content="300">
  <meta property="og:image:height" content="300">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://josephmars.me/">
  <meta name="twitter:title" content="Joseph Martinez - Data Scientist">
  <meta name="twitter:description" content="Data Scientist with 4 years of experience specializing in Machine Learning and Generative AI.">
  <meta name="twitter:image" content="https://josephmars.me/assets/images/joseph_martinez.jpg">

  <!-- SEO Meta Tags -->
  <meta name="description" content="Joseph Martinez - Data Scientist specializing in Machine Learning, LLM training, and simulation modeling. Explore my portfolio, blog posts about AI, and professional experience.">
  <meta name="keywords" content="Joseph Martinez, Data Scientist, Machine Learning, LLM, AI, Generative AI, Portfolio, Blog">
  <meta name="author" content="Joseph Martinez">
  <meta name="robots" content="index, follow">
  
  <!-- Canonical URL -->
  <meta rel="canonical" href="https://josephmars.me/">
  
  <!-- Schema.org markup for Google -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Joseph Martinez",
      "jobTitle": "Data Scientist",
      "url": "https://josephmars.me",
      "image": "https://josephmars.me/assets/images/joseph_martinez.jpg",
      "sameAs": [
        "https://github.com/josephmars",
        "https://www.linkedin.com/in/josephmars/"
      ],
      "description": "Data Scientist with 4 years of experience specializing in Machine Learning, LLM training and deployment, and simulation modeling."
    }
  </script>
```

### For Blog Posts
```html

```
