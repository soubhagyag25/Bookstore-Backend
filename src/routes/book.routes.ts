import express, { Router } from 'express';
import BookController from '../controllers/book.controller';
import { adminAuth, userAuth } from '../middlewares/auth.middleware'; 

class BookRoutes {
    public router: Router;
    private bookController: BookController;

    constructor() {
        this.router = express.Router();
        this.bookController = new BookController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/addBook', adminAuth, this.bookController.addBook.bind(this.bookController));
        this.router.get('/getAll', userAuth, this.bookController.getAllBooks.bind(this.bookController));
        this.router.get('/getAllBooks', adminAuth, this.bookController.getAllBooks.bind(this.bookController));
        this.router.get('/:id', userAuth, this.bookController.getBookById.bind(this.bookController));
        this.router.get('/:id', adminAuth, this.bookController.getBookById.bind(this.bookController));
        this.router.put('/:id/update', adminAuth, this.bookController.updateBook.bind(this.bookController));
        this.router.delete('/:id/delete', adminAuth, this.bookController.deleteBook.bind(this.bookController));
    }
}

export default BookRoutes;
