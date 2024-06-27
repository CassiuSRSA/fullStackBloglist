const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const helper = require("./test_helper");

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  await Blog.insertMany(helper.initialBlogs);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("a specific blog can be viewed", async () => {
  const blogsAtStart = await helper.blogsInDb();

  const blogToView = blogsAtStart[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.deepStrictEqual(resultBlog.body, blogToView);
});

test.only("id returns without id instead of _id", async () => {
  const response = await api.get("/api/blogs");

  const firstPost = response.body[0];

  assert.deepStrictEqual(Object.keys(firstPost).includes("id"), true);
});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "Another blog",
    author: "Mike Jackson",
    url: "https://www.blogging.com",
    likes: 6,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const titles = response.body.map((r) => r.title);

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);

  assert(titles.includes("Another blog"));
});

test("likes can be omitted ", async () => {
  const newBlog = {
    title: "Another blog",
    author: "Mike Jackson",
    url: "https://www.blogging.com",
    likes: null,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const likesOnLastAdded = response.body[response.body.length - 1].likes;

  assert.strictEqual(0, likesOnLastAdded);
});

test("title and url can not be omitted ", async () => {
  const newBlog = {
    title: null,
    author: "Mike Jackson",
    url: "https://www.blogging.com",
    likes: 16,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);
    assert(!titles.includes(blogToDelete.title));
  });
});

after(async () => {
  await mongoose.connection.close();
});
