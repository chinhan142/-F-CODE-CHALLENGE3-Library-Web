package com.example.demo;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "*") // Dòng này cực kỳ quan trọng để FE gọi được vào BE
public class HelloController {

    @GetMapping("/api/message")
    public Map<String, String> getMessage() {
        Map<String, String> response = new HashMap<>();
        response.put("content", "Chào bạn! Dữ liệu này được gửi từ Backend Java Spring Boot.");
        response.put("status", "Thành công");
        return response; // Spring Boot sẽ tự chuyển Map này thành JSON
    }

    @PostMapping("/api/greet")
    public Map<String, String> greetUser(@RequestBody Map<String, String> request) {
        // Lấy dữ liệu 'name' từ JSON mà FE gửi lên
        String name = request.get("name");

        // Xử lý logic tại Backend
        String message = "Chào " + name + "! Backend Spring Boot đã xử lý yêu cầu của bạn lúc: " + new java.util.Date();

        // Trả kết quả về cho FE
        Map<String, String> response = new HashMap<>();
        response.put("result", message);
        return response;
    }
}