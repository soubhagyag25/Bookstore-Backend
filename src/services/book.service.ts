import {Book} from '../models/books';
import { Request } from 'express';

class BookService {

    //! Admin can add the Books into the Database
    public async createBook(req: Request) {
        const { bookName, author, qty, price, description } = req.body;
        const adminId = req.user?.id; // Extract adminId from request

        if (!adminId) {
            throw new Error('Admin ID is required');
        }

        // Check if the book already exists
        const existingBook = await Book.findOne({
            where: {
                bookName,
                author,
            },
        });

        if (existingBook) {
            throw new Error('A book with the same name and author already exists');
        }

        const book = await Book.create({ bookName, author, qty, price, description, adminId });
        return book;
    }

    public async getBooks() {
        return await Book.findAll();
    }

    public async getBookById(id: number) {
        return await Book.findByPk(id);
    }

    //! Admin can Update the Book's Metadata like qty,price or author
    public async updateBook(id: number, bookData: any) {
        const book = await Book.findByPk(id);
        if (!book) throw new Error('Book not found');

        // Update only provided fields
        const { bookName, author, qty, price, description } = bookData;
        if (bookName !== undefined) {
            book.bookName = bookName;
        }
        if (author !== undefined) {
            book.author = author;
        }
        if (qty !== undefined) {
            book.qty = qty;
        }
        if (price !== undefined) {
            book.price = price;
        }
        if (description !== undefined) {
            book.description = description;
        }

        return await book.save();
    }
    //! Admin can delete the book from the Database
    public async deleteBook(id: number) {
        const book = await Book.findByPk(id);
        if (!book) throw new Error('Book not found');
        return await book.destroy();
    }
}

export default new BookService();
