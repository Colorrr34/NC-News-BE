const app = require("../app.js");
const db = require("../db/connection.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));

afterAll(() => db.end());
describe("app.js", () => {
  test("GET topics from the database", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(data.topicData.length);
        body.forEach((topic) => {
          const { slug, description, img_url } = topic;
          expect(typeof slug).toBe("string");
          expect(typeof description).toBe("string");
          expect(typeof img_url).toBe("string");
        });
      });
  });

  test("GET articles from the database", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(data.articleData.length);
        body.forEach((article) => {
          const {
            article_id,
            title,
            topic,
            author,
            body,
            created_at,
            votes,
            article_img_url,
            comment_count,
          } = article;
          expect(typeof article_id).toBe("number");
          expect(typeof title).toBe("string");
          expect(typeof topic).toBe("string");
          expect(typeof author).toBe("string");
          expect(typeof body).toBe("string");
          expect(typeof created_at).toBe("string");
          expect(typeof votes).toBe("number");
          expect(typeof article_img_url).toBe("string");
          expect(typeof comment_count).toBe("number");
        });
      });
  });

  test("comment_count has the correct count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        let commentCount = 0;
        data.commentData.forEach((comment) => {
          if (comment.article_title === "Living in the shadow of a great man") {
            commentCount++;
          }
        });
        const { article_id, comment_count } = body[0];
        expect(article_id).toBe(1);
        expect(comment_count).toBe(commentCount);
      });
  });
});
