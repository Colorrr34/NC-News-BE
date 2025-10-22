const app = require("../app.js");
const db = require("../db/connection.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));

afterAll(() => db.end());
describe("GET", () => {
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

  test("GET articles from the database, added comment_count", () => {
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

  test("GET articles sort articles by created_at descending by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        for (let i = 0; i < body.length - 1; i++) {
          expect(body[i].created_at >= body[i + 1].created_at).toBe(true);
        }
      });
  });

  test("GET takes a sort_by query which sort the the article by any valid column", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        for (let i = 0; i < body.length - 1; i++) {
          expect(body[i].votes <= body[i + 1].votes).toBe(true);
        }
      });
  });

  test("GET articles takes a topic query which filters the topic of the articles", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        body.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("comment_count has the correct count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        let commentCountInData = 0;
        let commentCountByRequest;
        data.commentData.forEach((comment) => {
          if (comment.article_title === "Living in the shadow of a great man") {
            commentCountInData++;
          }
        });
        body.forEach((article) => {
          if (article.article_id === 1) {
            commentCountByRequest = article.comment_count;
          }
        });
        expect(commentCountByRequest).toBe(commentCountInData);
      });
  });

  test("GET users from the database", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(data.userData.length);
        body.forEach((user) => {
          const { username, name, avatar_url } = user;
          expect(typeof username).toBe("string");
          expect(typeof name).toBe("string");
          expect(typeof avatar_url).toBe("string");
        });
      });
  });

  test("GET articles by ID", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: responseBody }) => {
        const {
          article_id,
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        } = responseBody[0];
        expect(typeof article_id).toBe("number");
        expect(typeof title).toBe("string");
        expect(typeof topic).toBe("string");
        expect(typeof author).toBe("string");
        expect(typeof body).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof article_img_url).toBe("string");
      });
  });

  test("GET article by ID includes comment_count", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body[0].comment_count).toBe("number");
      });
  });

  test("GET comments from an article", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        body.forEach((comment) => {
          const { comment_id, votes, created_at, author, body, article_id } =
            comment;
          expect(typeof comment_id).toBe("number");
          expect(typeof votes).toBe("number");
          expect(typeof created_at).toBe("string");
          expect(typeof author).toBe("string");
          expect(typeof body).toBe("string");
          expect(typeof article_id).toBe("number");
        });
      });
  });
});

describe("POST", () => {
  test("POST a comment to an article", () => {
    const commentBody = {
      body: "Test text",
      author: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(commentBody)
      .expect(201)
      .then(({ body: responseBody }) => {
        const { comment_id, votes, created_at, author, body, article_id } =
          responseBody[0];
        expect(comment_id).toBe(data.commentData.length + 1);
        expect(votes).toBe(0);
        expect(typeof created_at).toBe("string");
        expect(author).toBe("butter_bridge");
        expect(body).toBe("Test text");
        expect(article_id).toBe(2);
      });
  });
});

describe("PATCH", () => {
  test("PATCH /api/articles/:article_id accepts an object with inc_votes as the key and updates the vote accordingly", () => {
    const patchBody = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(patchBody)
      .expect(200)
      .then(({ body }) => {
        expect(body[0].votes).toBe(
          data.articleData[0].votes + patchBody.inc_votes
        );
      });
  });

  test("PATCH accepts negative inc_votes", () => {
    const patchBody = { inc_votes: -200 };
    return request(app)
      .patch("/api/articles/1")
      .send(patchBody)
      .expect(200)
      .then(({ body }) => {
        expect(body[0].votes).toBe(
          data.articleData[0].votes + patchBody.inc_votes
        );
      });
  });
});

describe("DELETE", () => {
  test("DELETE /api/comments/:comment_id deletes the comment and has a status code 204", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(() => {
        return request(app).get("/api/comments/3").expect(404);
      });
  });
});
