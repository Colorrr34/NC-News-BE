const app = require("../app.js");
const db = require("../db/connection.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));

afterAll(() => db.end());
describe("GET", () => {
  describe("GET topics", () => {
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
  });

  describe("GET articles", () => {
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
            if (
              comment.article_title === "Living in the shadow of a great man"
            ) {
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
  });

  describe("GET users", () => {
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
  });

  describe("GET article by ID", () => {
    test("GET articles by ID response have the correct set of data", () => {
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
          } = responseBody;
          expect(article_id).toBe(2);
          expect(title).toBe("Sony Vaio; or, The Laptop");
          expect(topic).toBe("mitch");
          expect(author).toBe("icellusedkars");
          expect(body).toBe(
            "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me."
          );
          expect(typeof created_at).toBe("string");
          expect(votes).toBe(0);
          expect(typeof article_img_url).toBe("string");
        });
    });

    test("GET article by ID includes comment_count", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          expect(typeof body.comment_count).toBe("number");
        });
    });

    describe("GET comments by article ID", () => {
      test("response has the correct set of data", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body }) => {
            body.forEach((comment) => {
              const {
                comment_id,
                votes,
                created_at,
                author,
                body,
                article_id,
              } = comment;
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

    describe("Error handling", () => {
      test("Query article_id over data size has a response of status code 404 and error message", () => {
        return request(app)
          .get("/api/articles/50")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Article 50 Not Found");
          });
      });
    });
  });
});

describe("POST", () => {
  describe("POST comment", () => {
    test("suscessfully creates a comment and responses with the posted comment", () => {
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
            responseBody;
          expect(comment_id).toBe(data.commentData.length + 1);
          expect(votes).toBe(0);
          expect(typeof created_at).toBe("string");
          expect(author).toBe("butter_bridge");
          expect(body).toBe("Test text");
          expect(article_id).toBe(2);
        });
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
        expect(body.votes).toBe(
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
        expect(body.votes).toBe(
          data.articleData[0].votes + patchBody.inc_votes
        );
      });
  });
});

describe("DELETE", () => {
  describe("DELETE comment", () => {
    test("DELETE /api/comments/:comment_id deletes the comment and has a status code 204", () => {
      return request(app)
        .delete("/api/comments/3")
        .expect(204)
        .then(() => {
          return request(app).get("/api/comments/3").expect(404);
        });
    });
  });
});

describe("Error handling for invalid path", () => {
  test("GET invalid path should have a status code 404 and response message", () => {
    return request(app)
      .get("/invalid-path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Path");
      });
  });

  test("Query artcile_id invalid input has a response of status code 400 and error message", () => {
    return request(app)
      .get("/api/articles/invalidID")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid query");
      });
  });
});
