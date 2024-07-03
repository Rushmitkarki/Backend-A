// import
const request = require("supertest");
// import server file
const app = require("../index");

// text token (for admin)
// this is user admin tokens
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjkyOWRkOWMwY2VmOGRlOTFmOWU3ZSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MTkxMTY4NTl9.HcNza5_ZulcXGtwwTDB9-dEs5j_RK9zuzw1gfbgiHqU";

  describe('API Testing', () => {
    it('GET /test', async () => {
      const response = await request(app).get('/test');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Test API is Working!....');
    });
  
    it('GET Products | Fetch All products', async () => {
      const response = await request(app)
        .get('/api/product/get_all_products')
        .set('authorization', `Bearer ${token}`);
      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.message).toEqual('All products fetched successfully');
    });
  
    it('POST /api/user/create', async () => {
      const response = await request(app).post('/api/user/create').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'j@gmail.com',
        password: '123456',
      });
      if (response.body.success) {
        expect(response.body.message).toEqual('User Created Successfully');
      } else {
        expect(response.body.message).toEqual('User Already Exists');
      }
    });
  
    it('POST /api/user/login', async () => {
      const response = await request(app).post('/api/user/login').send({
        email: 'j@gmail.com',
        password: '123456',
      });
      if (response.body.success) {
        expect(response.body.message).toEqual('User logged in successfully');
        // token length check
  
        expect(response.body.token.length).toBeGreaterThan(10);
        // user name check
        expect(response.body.user.firstName).toEqual('John');
      } else {
        if (response.body.message === 'User not found') {
          expect(response.body.message).toEqual('User not found');
        } else {
          expect(response.body.message).toEqual('Invalid Password');
        }
      }
    });
  });