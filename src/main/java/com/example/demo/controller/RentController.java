package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/rent")
@CrossOrigin(origins = "*")
public class RentController {
    @Autowired
    private RentRepository rentRepository;
    @Autowired
    private BookForRentRepository bookForRentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;

    @PostMapping("/borrow")
    @Transactional
    public Object borrowBook(@RequestBody Map<String, String> payload) {
        try {
            String bookId = payload.get("bookId");
            Long userId = Long.parseLong(payload.get("userId"));

            Book book = bookRepository.findById(bookId).orElse(null);
            User user = userRepository.findById(String.valueOf(userId)).orElse(null);
            if (book == null || user == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy sách hoặc người dùng"));
            }

            if (book.getQuantity() <= 0) {
                return ResponseEntity.status(400).body(Map.of("message", "Sách này đã hết cuốn sẵn có trên kệ"));
            }

            BookForRent availableCopy = null;
            if (book.getCopies() != null) {
                for (BookForRent copy : book.getCopies()) {
                    if (copy.getStatus().equals("AVAILABLE")) {
                        availableCopy = copy;
                        break;
                    }
                }
            }

            if (availableCopy != null) {
                book.setQuantity(book.getQuantity() - 1);
                bookRepository.save(book);

                availableCopy.setStatus("BORROWED");
                bookForRentRepository.save(availableCopy);

                Rent rent = new Rent();
                rent.setUser(user);
                rent.setBookForRent(availableCopy);
                rent.setBorrowDate(LocalDate.now());
                rent.setStatus("ONGOING");

                Rent savedRent = rentRepository.save(rent);

                return Map.of("message", "Mượn sách thành công!",
                        "barcode", availableCopy.getBookBarCode(),
                        "rentId", savedRent.getRentId());
            }
            return ResponseEntity.status(400).body(Map.of("message", "Lỗi: Kho báo còn sách nhưng không tìm thấy cuốn trống!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi hệ thống: " + e.getMessage()));
        }

    }

    @PostMapping("/return")
    @Transactional
    public Object returnBook(@RequestBody Map<String, String> payload) {
        String barcode = payload.get("barcode");

        BookForRent copy = bookForRentRepository.findById(barcode).orElse(null);
        if (copy != null) {
            copy.setStatus("AVAILABLE");
            bookForRentRepository.save(copy);

            List<Rent> records = rentRepository.findAll();
            for (Rent r : records) {
                if (r.getBookForRent().getBookBarCode().equals(barcode) && r.getStatus().equals("ONGOING")) {
                    r.setStatus("RETURNED");
                    r.setReturnDate(LocalDate.now());
                    rentRepository.save(r);
                    return Map.of("message", "Trả sách thành công!");
                }
            }
        }
        return Map.of("message", "Lỗi dữ lệu trả sách!");
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        long totalBorrowed = rentRepository.count();
        return Map.of("totalBorrowed", totalBorrowed);
    }

    @GetMapping("/book-stats")
    public List<Map<String, Object>> getBookBorrowStats() {
        List<Book> allBooks = bookRepository.findAll();
        List<Map<String, Object>> stats = new ArrayList<>();
        for (Book book : allBooks) {
            long borrowCount = rentRepository.findAll().stream().filter(r -> r.getBookForRent().getBook().getBookId().equals(book.getBookId())).count();
            Map<String, Object> item = new HashMap<>();
            item.put("bookName", book.getBookName());
            item.put("borrowCount", borrowCount);
            stats.add(item);
        }
        return stats;
    }

    @GetMapping("/all-history")
    public List<Map<String, Object>> getAllBorrowHistory() {
        List<Rent> allRents = rentRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Rent r : allRents) {
            Map<String, Object> map = new HashMap<>();
            map.put("rentId", r.getRentId());
            map.put("borrowDate", r.getBorrowDate());
            map.put("status", r.getStatus());

            if (r.getUser() != null) {
                map.put("username", r.getUser().getUsername());
            } else {
                map.put("username", "Unknown User");
            }

            if (r.getBookForRent() != null && r.getBookForRent().getBook() != null) {
                map.put("bookName", r.getBookForRent().getBook().getBookName());
                map.put("bookId", r.getBookForRent().getBook().getBookId());
            } else {
                map.put("bookName", "Unknown Book");
                map.put("bookId", "0");
            }

            if (r.getBorrowDate() != null) {
                map.put("dueDate", r.getBorrowDate().plusMonths(3));
            } else {
                map.put("dueDate", "N/A");
            }

            result.add(map);
        }
        return result;
    }

    @GetMapping("/user/{userId}")
    public List<Map<String, Object>> getUserBorrowHistory(@PathVariable Long userId) {
        List<Rent> allRents = rentRepository.findAll();
        List<Map<String, Object>> userHistory = new ArrayList<>();
        for (Rent r : allRents) {
            if (r.getUser() != null && r.getUser().getUserID().equals(userId)) {
                Map<String, Object> map = new HashMap<>();
                map.put("rentId", r.getRentId());
                map.put("bookName", r.getBookForRent().getBook().getBookName());
                map.put("borrowDate", r.getBorrowDate());
                map.put("status", r.getStatus());

                if (r.getBorrowDate() != null) {
                    map.put("dueDate", r.getBorrowDate().plusMonths(3));
                }
                userHistory.add(map);
            }
        }
        return userHistory;
    }
}
