const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "A blog about life",
    author: "Mike Jackson",
    url: "https://www.blogging.com",
    likes: 5,
  },
  {
    title: "How to make money",
    author: "Sean Brookstein",
    url: "https://www.blogging.com",
    likes: 10,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "How to lose money",
    author: "Sean Brookstein",
    url: "https://www.blogging.com",
    likes: 5,
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
