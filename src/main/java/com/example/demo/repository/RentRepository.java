package com.example.demo.repository;
import com.example.demo.model.Rent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;
@Repository
public interface RentRepository extends JpaRepository<Rent, Long>{

}
