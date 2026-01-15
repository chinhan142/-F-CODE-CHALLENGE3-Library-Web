package com.example.demo.repository;
import com.example.demo.model.BookForRent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface BookForRentRepository extends JpaRepository<BookForRent, String>{

}
