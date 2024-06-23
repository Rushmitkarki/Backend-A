// import
const request = require("supertest");
// import server file
const app = require("../index");

// text token (for admin)
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjkyOWRkOWMwY2VmOGRlOTFmOWU3ZSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MTkxMTY4NTl9.HcNza5_ZulcXGtwwTDB9-dEs5j_RK9zuzw1gfbgiHqU";

describe("Testing API", () => {
  //Testing '/test' api
  it("Get /test | Response with text", async () => {
    //request sending to the server
    const response = await request(app).get("/test");
    expect(response.statusCode).toBe(200);
    // compare received  text
    expect(response.text).toEqual("Test API is working.....");
  });

  //   get all products
  it("GET Products | Fetch all products", async () => {
    const response = await request(app)
      .get("/api/product/get_all_products")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("Product Fetched Successfully");
  }, 100000);

  //   resgister testing
  // 1. sending resuest (with data)
  // 2. check response

  // IFF alrewady exist : handel accordingly

  it("POST /api/user/create | Response with body", async () => {
    const response = await request(app).post("/api/user/create").send({
      firstName: "Joy",
      lastName: "Boy ",
      email: "joy@gmail.com",
      password: "123456",
    });
    // if condition
    if (!response.body.success) {
      expect(response.body.message).toEqual("user Already Exists....");
    } else {
      expect(response.body.message).toEqual("user created successfully");
    }
  });
  // login
  it("POST /api/user/login | Response with body", async () => {
    const response = await request(app).post("/api/user/login").send({
      email: "joy@gmail.com",
      password: "123456",
    });
    if (response.body.statusCode === 400) {
      expect(response.body.message).toEqual("User not found...");
    } else if (response.body.statusCode === 300) {
      expect(response.body.message).toEqual("Invalid Password...");
    } else {
      expect(response.body.message).toEqual("Login Success");
    }
  });
});
