import { Request, Response, NextFunction } from 'express';
import BookService from '../services/book.service';

class BookController {
    public async addBook(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await BookService.createBook(req);
            res.status(201).json({
                message: 'Book added successfully',
                book
            });
        } catch (error) {
            next(error);
        }
    }

    public async getAllBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const books = await BookService.getBooks();
            res.status(200).json(books);
        } catch (error) {
            next(error);
        }
    }

    public async getBookById(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await BookService.getBookById(Number(req.params.id));
            res.status(200).json(book);
        } catch (error) {
            next(error);
        }
    }

    public async updateBook(req: Request, res: Response, next: NextFunction) {
        try {
            const updatedBook = await BookService.updateBook(Number(req.params.id), req.body);
            res.status(200).json(updatedBook);
        } catch (error) {
            next(error);
        }
    }

    public async deleteBook(req: Request, res: Response, next: NextFunction) {
        try {
            await BookService.deleteBook(Number(req.params.id));
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default BookController;
