import { Request, Response, NextFunction } from 'express';
import BookService from '../services/book.service';

class BookController {

    //! Admin can Add the Books into the Database
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
    
    //! To get all the books
    public async getAllBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const books = await BookService.getBooks();
            res.status(200).json(books);
        } catch (error) {
            next(error);
        }
    }

    //!To Get a Book by BookId
    public async getBookById(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await BookService.getBookById(Number(req.params.id));
            res.status(200).json(book);
        } catch (error) {
            next(error);
        }
    }
    //! Admin can Update the Book's metadata
    public async updateBook(req: Request, res: Response, next: NextFunction) {
        try {
            const updatedBook = await BookService.updateBook(Number(req.params.id), req.body);
            res.status(200).json(updatedBook).json({message:"Book Updated Successfully"});
        } catch (error) {
            next(error);
        }
    }
    //! Admin can Delete the Book from the Database
    public async deleteBook(req: Request, res: Response, next: NextFunction) {
        try {
            await BookService.deleteBook(Number(req.params.id));
            res.status(200).json({ message: "Book Deleted Successfully" });
        } catch (error) {
            next(error);
        }
    }
}

export default BookController;
