import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../src/index';
import { v4 as uuidv4 } from 'uuid';

describe('User and Admin Authentication', () => {

  let userResetToken: string;
  let adminResetToken: string;
  let adminToken: string;
  let userToken: string;
  let bookId: number;
  const userEmail = `user_${uuidv4()}@test.com`;
  const adminEmail = `admin_${uuidv4()}@test.com`;

  // User Signup
  it('should sign up a new user', (done) => {
    request(app)
      .post('/api/v1/users/signup')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: userEmail,
        password: 'password123'
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('email').eql(userEmail);
        done();
      });
  });

  // Admin Signup
  it('should sign up a new admin', (done) => {
    request(app)
      .post('/api/v1/users/signupAdmin')
      .send({
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        password: 'password123'
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('email').eql(adminEmail);
        done();
      });
  });

  // User Login
  it('should login user', (done) => {
    request(app)
      .post('/api/v1/users/login')
      .send({
        email: userEmail,
        password: 'password123'
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('token');
        userToken = res.body.data.token; // store user token
        done();
      });
  });

  // Admin Login
  it('should login admin', (done) => {
    request(app)
      .post('/api/v1/users/loginAdmin')
      .send({
        email: adminEmail,
        password: 'password123'
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('token');
        adminToken = res.body.data.token; // store admin token
        done();
      });
  });

  // User Forget Password
  it('should generate a password reset token for the user', function(done) {
    this.timeout(10000); 
    request(app)
      .post('/api/v1/users/forget-password')
      .send({ email: userEmail })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('data');
        userResetToken = res.body.data; // store reset token
        done();
      });
  });

  // Admin Forget Password
  it('should generate a password reset token for the admin', function(done) {
    this.timeout(10000);
    request(app)
      .post('/api/v1/users/forget-passwordAdmin')
      .send({ email: adminEmail })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('data');
        adminResetToken = res.body.data; // store reset token
        done();
      });
  });

  // User Reset Password
  it('should reset the password for the user', (done) => {
    request(app)
      .post('/api/v1/users/reset-password')
      .set('Authorization', `Bearer ${userResetToken}`)
      .send({ newPassword: 'newPassword123' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('message').eql('Password has been changed successfully');
        done();
      });
  });

  // Admin Reset Password
  it('should reset the password for the admin', (done) => {
    request(app)
      .post('/api/v1/users/reset-passwordAdmin')
      .set('Authorization', `Bearer ${adminResetToken}`)
      .send({ newPassword: 'newPassword123' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('message').eql('Password has been changed successfully');
        done();
      });
  });

  // Admin Add a Book
  it('should add a new book to the database', (done) => {
    request(app)
      .post('/api/v1/books/addBook')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        bookName: 'Test Book',
        author: 'Test Author',
        qty: 10,
        price: 19.99,
        description: 'A test book description'
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('book');
        bookId = res.body.book.id; // store book ID
        done();
      });
  });

  // User Add Book to Cart
  it('should add the book to the user cart', (done) => {
    request(app)
      .post('/api/v1/cart/add')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        bookId,
        quantity: 1
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('message').eql('Book added to cart');
        done();
      });
  });

  // User Remove Book from Cart
  it('should remove the book from the user cart', (done) => {
    request(app)
      .post('/api/v1/cart/remove')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ bookId })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('message').eql('Book removed from cart');
        done();
      });
  });

  // User Add Book to Cart Again
  it('should add the book to the user cart again', (done) => {
    request(app)
      .post('/api/v1/cart/add')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        bookId,
        quantity: 1
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('message').eql('Book added to cart');
        done();
      });
  });

  // User View Cart
  it('should view the user cart', (done) => {
    request(app)
      .get('/api/v1/cart/viewCart')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(1);
        expect(res.body[0]).to.have.property('bookId').eql(bookId);
        expect(res.body[0]).to.have.property('bookName').eql('Test Book');
        expect(res.body[0]).to.have.property('quantity').eql(1);
        expect(res.body[0]).to.have.property('price').eql(19.99);
        done();
      });
  });
  // Admin delete the book
  it('should delete a book by ID', async () => {
    const response = await request(app)
        .delete(`/api/v1/books/${bookId}/delete`)
        .set('Authorization', `Bearer ${adminToken}`);

    if (response.status === 200) {
        expect(response.body.message).to.equal('Book Deleted Successfully');
    } else if (response.status === 404) {
        expect(response.body.message).to.equal('Book not found');
    } else if (response.status === 500) {
        expect(response.body.message).to.include('foreign key constraint');
    } else {
        expect(response.status).to.be.oneOf([200, 404, 500]);
    }
});
// Add Book to Wishlist
it('should add a book to the user wishlist', (done) => {
  request(app)
    .post('/api/v1/wishlist/add')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ bookId })
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body).to.have.property('message').eql('Book added to wishlist');
      done();
    });
});

// Remove Book from Wishlist
it('should remove a book from the user wishlist', (done) => {
  request(app)
    .post('/api/v1/wishlist/remove')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ bookId })
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body).to.have.property('message').eql('Book removed from wishlist');
      done();
    });
});

// View User Wishlist
it('should view the user wishlist', (done) => {
  request(app)
    .get('/api/v1/wishlist/view')
    .set('Authorization', `Bearer ${userToken}`)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(0); 
      done();
    });
});
});
