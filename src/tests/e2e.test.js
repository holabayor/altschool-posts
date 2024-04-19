const dotenv = require('dotenv');
dotenv.config();
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
// const { connectDB, disconnectDB } = require('../src/config/db');

describe('AUTHENTICATION TESTS', () => {
  let mongoServer;

  const userData = {
    name: 'Scott Jones',
    email: 'testuser@mail.com',
    password: 'password123',
    confirmPassword: 'password123',
  };

  const testUserData = {
    name: 'Bob Billing',
    email: 'bobbilling@mail.com',
    password: 'bob@123',
    confirmPassword: 'bob@123',
  };

  const postData = {
    title: 'Test Post Title',
    body: 'Onto their southern land. Serve wide all medical soon well.',
  };

  let postId, token, testUserToken;
  const fakePostId = '660416536613cf69f97d4134';

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongodbUri = mongoServer.getUri();
    await mongoose.connect(mongodbUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe('POST /api/auth/register', () => {
    it('should return 422 if invalid/missing input', async () => {
      const response = await request(app).post('/api/auth/register').send({
        first_name: 'Scott',
        last_name: 'Jones',
        email: 'testuser@mail.com',
      });
      expect(response.status).toBe(422);
      expect(response.body.success).toEqual(false);
    });

    it('should register a new user with a 201 status code', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      expect(response.status).toBe(201);
      expect(response.body.success).toEqual(true);
      expect(response.body.message).toEqual('User created successfully');
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data).toHaveProperty('email', userData.email);
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 409 if user email already exists', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: userData.email,
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(response.status).toBe(409);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('User already exists');
    });

    it('should return 422 if password is less than 6 characters', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...userData,
          password: 'short',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toContain(
        'password length must be at least 6 characters long'
      );
    });

    it('should throw error - password is equals to confirmPassword', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...userData,
          password: 'password1234',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toContain(
        'Confirm password does not match password.'
      );
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 422 if missing password', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'testuser@mail.com',
      });

      expect(response.status).toBe(422);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toBe('password is required');
    });

    it('should register and login a new user ', async () => {
      await request(app).post('/api/auth/register').send(testUserData);
      const response = await request(app).post('/api/auth/login').send({
        email: testUserData.email,
        password: testUserData.password,
      });

      // Set the token variable to the access token returned
      testUserToken = response.body.data.accessToken;

      expect(response.status).toBe(200);
      expect(response.body.success).toEqual(true);
      expect(response.body.data.user).toHaveProperty('_id');
      expect(response.body.data.user).toHaveProperty(
        'email',
        testUserData.email
      );
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should login a new user with a 200 status code', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: userData.email,
        password: userData.password,
      });

      // Set the token variable to the access token returned
      token = response.body.data.accessToken;

      expect(response.status).toBe(200);
      expect(response.body.success).toEqual(true);
      expect(response.body.message).toEqual('Log in successful');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.user).toHaveProperty('_id');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return a 401 error if email is incorrect', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'fakeuser@mail.com',
        password: 'password123',
      });
      expect(response.status).toBe(401);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('Invalid login credentials');
    });

    it('should return a 401 error if password is incorrect', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'testuser@mail.com',
        password: 'password',
      });
      expect(response.status).toBe(401);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('Invalid login credentials');
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(postData);

      //   Set the post Id
      postId = response.body.data._id;

      expect(response.status).toBe(201);
      expect(response.body.data.title).toEqual(postData.title);
      //   expect(response.body.data.read_count).toEqual(0);
    });

    it('should return an unauthorized error 401 - not logged in user', async () => {
      const postData = {
        title: 'Test Post Title',
        body: 'Content of the new test post',
      };
      const response = await request(app).post('/api/posts').send(postData);

      expect(response.status).toBe(401);
      expect(response.body.success).toEqual(false);
    });

    it('should not create a new post if title field is empty', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          body: 'Content of the new test post',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('title is required');
    });

    it('should not create a new post if body field is empty', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Post Title',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('body is required');
    });
  });

  describe('PATCH /api/posts/:id', () => {
    it('should return a 422 error if both title and body is empty', async () => {
      const updateData = {
        title: '',
        body: '',
      };
      const response = await request(app)
        .patch(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(422);
      expect(response.body.success).toEqual(false);
      // expect(response.body.message).toEqual('Post updated successfully');
      // expect(response.body.data.title).toEqual(updateData.title);
      // expect(response.body.data.body).toEqual(updateData.body);
    });

    it('should update a post', async () => {
      const updateData = {
        title: 'Updated Post',
        body: 'This post has been updated with a new content.',
      };
      const response = await request(app)
        .patch(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toEqual(true);
      expect(response.body.message).toEqual('Post updated successfully');
      expect(response.body.data.title).toEqual(updateData.title);
      expect(response.body.data.body).toEqual(updateData.body);
    });

    it('should return a 401 error - unauthenticated user trying to edit a post ', async () => {
      const updateData = {
        title: 'Updated Post',
        body: 'This post has been updated with a new content.',
      };
      const response = await request(app)
        .patch(`/api/posts/${postId}`)
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('You are not authorized');
    });

    it('should return a 403 error - authenticated user trying to edit a post is not the owner', async () => {
      const updateData = {
        title: 'Updated Post',
        body: 'This post has been updated with a new content.',
      };
      const response = await request(app)
        .patch(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${testUserToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual(
        'You are not authorized to update this post'
      );
    });

    it('should return a 404 error if post does not exist', async () => {
      const updateData = {
        title: 'Updated Post',
        body: 'This post has been updated with a new content.',
      };
      const response = await request(app)
        .patch(`/api/posts/${fakePostId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('Post not found');
    });
  });

  describe('GET /api/posts', () => {
    it('should retrieve all published posts', async () => {
      const response = await request(app)
        .get('/api/posts')
        .query({ page: 1, limit: 20, order: 'asc', orderBy: 'createdAt' });

      expect(response.status).toBe(200);
      expect(response.body.success).toEqual(true);
      expect(response.body.data).toHaveLength(1);
      //   expect(response.body.metadata.totalCount).toBe(1);
      //   expect(response.body.metadata.limit).toBe(20);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should return a specific post by id', async () => {
      const response = await request(app).get(`/api/posts/${postId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('Successfully retrieved Post');
      expect(response.body.data.title).toEqual('Updated Post');
    });

    it('should return an error 404 if post ID is invalid', async () => {
      const response = await request(app).get(`/api/posts/${fakePostId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('Post not found');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should return a 401 error if authenticated user not the owner', async () => {
      const response = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual(
        'You are not authorized to delete this post'
      );
    });

    it('should delete a post', async () => {
      const response = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should return an error if post does not exist', async () => {
      const response = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('Post not found');
    });
  });
});
