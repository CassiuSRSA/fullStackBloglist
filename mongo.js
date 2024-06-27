const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://cassius:${password}@cluster0.7qgqk0e.mongodb.net/testBlogList?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url).then(() => {
  const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
  });

  const Blog = mongoose.model("Blog", blogSchema);

  const blog = new Blog({
    title: "How to make money",
    author: "Sean Brookstein",
    url: "https://www.blogging.com",
    like: undefined,
  });

  blog.save().then((result) => {
    console.log("blog saved!");
    mongoose.connection.close();
  });
});
