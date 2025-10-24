const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const {
  convertTimestampToDate,
  getValueByValue,
} = require("../db/seeds/utils");
const db = require("../db/connection");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("getValueByValue", () => {
  test("returns a new object", () => {
    const object = {
      article_title: "Living in the shadow of a great man",
      body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
      votes: 14,
      author: "butter_bridge",
      created_at: 1604113380000,
    };
    const array = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];

    expect(
      getValueByValue(object, array, "article_title", "title", "article_id")
    ).not.toBe(object);
  });

  test("returns the object with a article id", () => {
    const object = {
      article_title: "Living in the shadow of a great man",
      body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
      votes: 14,
      author: "butter_bridge",
      created_at: 1604113380000,
    };
    const array = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];

    expect(
      getValueByValue(
        object,
        array,
        "article_title",
        "title",
        "article_id"
      ).hasOwnProperty("article_id")
    ).toBe(true);
  });

  test("the object has the correct article id", () => {
    const object = {
      article_title: "Living in the shadow of a great man",
      body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
      votes: 14,
      author: "butter_bridge",
      created_at: 1604113380000,
    };

    const array = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];

    return db
      .query(
        `
        SELECT article_id FROM articles
        WHERE title = 'Living in the shadow of a great man'
        `
      )
      .then((query) => {
        expect(
          getValueByValue(object, array, "article_title", "title", "article_id")
            .article_id
        ).toBe(query.rows[0].article_id);
      });
  });
});
