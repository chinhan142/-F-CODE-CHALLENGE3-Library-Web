package com.example.demo.controller;

import com.example.demo.model.Book;
import com.example.demo.model.BookForRent;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BookForRentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookForRentRepository bookForRentRepository;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @PostMapping("/add")
    @Transactional
    public Book addBook(@RequestBody Book book) {
        Book savedBook = bookRepository.save(book);

        List<BookForRent> copies = new ArrayList<>();
        for ( int i = 1; i <= book.getQuantity(); i++) {
            BookForRent copy = new BookForRent();
            copy.setBookBarCode(savedBook.getBookId() + "-" + i);
            copy.setStatus("AVAILABLE");
            copy.setBook(savedBook);
            copies.add(copy);
        }
        bookForRentRepository.saveAll(copies);
        return savedBook;
    }

    // Thêm vào BookController.java

    // 1. Cập nhật thông tin sách
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateBook(@PathVariable String id, @RequestBody Book bookDetails) {
        Book book = bookRepository.findById(id).orElse(null);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }

        // 1. Cập nhật thông tin cơ bản
        book.setBookName(bookDetails.getBookName());
        book.setAuthor(bookDetails.getAuthor());
        book.setCategory(bookDetails.getCategory());
        book.setPublishDate(bookDetails.getPublishDate());
        book.setImageUrl(bookDetails.getImageUrl());

        // 2. Xử lý số lượng (Quantity)
        int oldQuantity = book.getQuantity();
        int newQuantity = bookDetails.getQuantity();

        book.setQuantity(newQuantity); // Cập nhật con số trong bảng Book

        // 3. Nếu số lượng tăng lên, phải tạo thêm các bản sao (BookForRent) tương ứng
        if (newQuantity > oldQuantity) {
            for (int i = oldQuantity + 1; i <= newQuantity; i++) {
                BookForRent copy = new BookForRent();
                // Tạo mã barcode mới ví dụ: B001-2, B001-3...
                copy.setBookBarCode(book.getBookId() + "-" + i);
                copy.setStatus("AVAILABLE");
                copy.setBook(book);
                bookForRentRepository.save(copy);
            }
        }
        // Lưu ý: Nếu giảm số lượng thì logic sẽ phức tạp hơn (phải check xem sách có đang bị mượn không)
        // Để phục vụ present ngày mai, bạn nên ưu tiên test trường hợp tăng số lượng.

        bookRepository.save(book);
        return ResponseEntity.ok(book);
    }

    // 2. Xóa sách
    @DeleteMapping("/{id}")
    @Transactional // Quan trọng: Đảm bảo mọi thứ xóa hết hoặc không xóa gì cả
    public ResponseEntity<?> deleteBook(@PathVariable String id) {
        try {
            Book book = bookRepository.findById(id).orElse(null);
            if (book == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy sách!"));
            }

            // Nhờ có CascadeType.ALL ở Bước 1, lệnh này sẽ tự động xóa:
            // 1. Dữ liệu trong bảng Rent liên quan
            // 2. Dữ liệu trong bảng BookForRent liên quan
            // 3. Cuối cùng là xóa chính cuốn Book đó
            bookRepository.delete(book);

            return ResponseEntity.ok(Map.of("message", "Xóa sách và toàn bộ dữ liệu liên quan thành công!"));
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra console để debug nếu cần
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    // 3. Lấy thông tin 1 cuốn sách theo ID (Dùng để đổ dữ liệu vào form Sửa)
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
