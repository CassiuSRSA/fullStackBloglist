const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let total = 0;
  if (blogs.length === 0) {
    return total;
  }
  total += blogs.reduce((acc, cur) => acc + cur.likes, total);
  return total;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }

  if (blogs.length === 1) {
    return {
      title: blogs[0].title,
      author: blogs[0].author,
      likes: blogs[0].likes,
    };
  }
  const likeList = blogs.map((blog) => blog.likes);

  const highestLikes = Math.max(...likeList);
  const listOfMostLiked = blogs.filter((blog) => blog.likes === highestLikes);
  const formattedList = listOfMostLiked.map((blog) => ({
    title: blog.title,
    author: blog.author,
    likes: blog.likes,
  }));
  return formattedList[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
