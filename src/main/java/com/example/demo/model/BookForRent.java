package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Table(name = "book_for_rent")
public class BookForRent {
    @Id
    private String bookBarCode;

    private String status;

    @ManyToOne
    @JoinColumn(name = "book_id")
    @JsonIgnore
    @JsonBackReference
    private Book book;

    @OneToMany(mappedBy = "bookForRent")
    @JsonIgnore
    private List<Rent> rentRecords;

    public String getBookBarCode() {
        return bookBarCode;
    }

    public void setBookBarCode(String bookBarCode) {
        this.bookBarCode = bookBarCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public List<Rent> getRentRecords() {
        return rentRecords;
    }

    public void setRentRecords(List<Rent> rentRecords) {
        this.rentRecords = rentRecords;
    }
}
