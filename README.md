📚 Hệ Thống Quản Lý Thư Viện (Library Management System)

Dự án xây dựng website quản lý thư viện theo mô hình Client - Server, sử dụng kiến trúc RESTful API. Cho phép người dùng đăng ký, đăng nhập, xem danh sách sách, mượn sách và cho phép quản trị viên theo dõi thống kê mượn trả.

🛠 Công nghệ sử dụng

Backend: Java 17, Spring Boot 3.x, Spring Data JPA.

Database: Microsoft SQL Server 2019.

Frontend: HTML5, CSS3 (Bootstrap 5), JavaScript (ES6).

Giao tiếp: RESTful API (JSON).

🚀 Các tính năng chính

Xác thực: Đăng ký tài khoản và Đăng nhập (phân quyền USER/ADMIN).

Quản lý kho: Theo dõi số lượng sách tổng (quantity) và trạng thái từng cuốn vật lý (barcode).

Nghiệp vụ mượn sách: Tự động tìm cuốn sách trống và cập nhật kho theo thời gian thực.

Quản lý cá nhân: Người dùng xem danh sách sách đang mượn và tự động tính hạn trả (3 tháng).

Dashboard Admin: Thống kê các đầu sách được mượn nhiều nhất và lịch sử chi tiết.
📋 Hướng dẫn cài đặt và khởi chạy
Để chạy dự án này trên máy cục bộ, vui lòng thực hiện theo các bước sau:
1. Chuẩn bị cơ sở dữ liệu

Hệ thống sử dụng MS SQL Server. Bạn cần tạo database trước:
Mở SQL Server Management Studio (SSMS).
Chạy câu lệnh SQL:
CREATE DATABASE library_db;

2. Cấu hình kết nối Backend

Mở file src/main/resources/application.properties và chỉnh sửa thông tin tài khoản SQL Server của bạn:

spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=library_db;encrypt=true;trustServerCertificate=true;
spring.datasource.username=TÊN_TÀI_KHOẢN_SA
spring.datasource.password=MẬT_KHẨU_CỦA_BẠN

3. Khởi tạo dữ liệu mẫu

Sau khi chạy dự án lần đầu để Hibernate tự sinh các bảng, hãy thực thi các lệnh INSERT (trong file database_setup.sql kèm theo) vào database library_db để có dữ liệu demo về sách và tài khoản admin.

```
/* 
   FILE KHỞI TẠO DỮ LIỆU HỆ THỐNG QUẢN LÝ THƯ VIỆN
   Hướng dẫn: Chạy Script này trong SQL Server Management Studio (SSMS)
*/

-- 1. TẠO DATABASE (Nếu chưa có)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'library_db')
BEGIN
    CREATE DATABASE library_db;
END
GO

USE library_db;
GO

-- 2. DỌN DẸP DỮ LIỆU CŨ THEO THỨ TỰ KHÓA NGOẠI
-- Xóa bảng con trước, bảng cha sau
DELETE FROM rent;
DELETE FROM book_for_rent;
DELETE FROM books;
DELETE FROM users;
GO

-- 3. CHÈN DỮ LIỆU BẢNG: users
-- ID tự tăng, vai trò ADMIN và USER
INSERT INTO users (username, password, role) VALUES 
('admin', '123456', 'ADMIN'),
('nhan_bui', 'password123', 'USER'),
('student_01', '123', 'USER'),
('student_02', '123', 'USER');
GO

-- 4. CHÈN DỮ LIỆU BẢNG: books (Thông tin đầu sách)
-- Đảm bảo mỗi đầu sách có quantity = 3
INSERT INTO books (book_id, author, book_name, category, publish_date, quantity, image_url) VALUES 
('1', 'Robert C. Martin', 'Clean Code', 'Programming', '2008-08-01', 3, 'https://covers.openlibrary.org/b/id/8226199-L.jpg'),
('2', 'Herbert Schildt', 'Java Programming', 'Java', '2018-12-15', 3, 'https://covers.openlibrary.org/b/id/8291542-L.jpg'),
('3', 'Eric Matthes', 'Python Crash Course', 'Python', '2019-05-03', 3, 'https://covers.openlibrary.org/b/id/12547191-L.jpg'),
('4', 'Jon Duckett', 'HTML and CSS Design', 'Web Design', '2011-10-25', 3, 'https://covers.openlibrary.org/b/id/7120611-L.jpg'),
('5', 'Douglas Crockford', 'JavaScript The Good Parts', 'JavaScript', '2008-05-01', 3, 'https://covers.openlibrary.org/b/id/7120657-L.jpg'),
('6', 'John Viescas', 'SQL Queries for Mere Mortals', 'Database', '2014-06-01', 3, 'https://covers.openlibrary.org/b/id/8114421-L.jpg'),
('7', 'Craig Walls', 'Spring Boot in Action', 'Backend', '2016-01-03', 3, 'https://covers.openlibrary.org/b/id/7946950-L.jpg'),
('8', 'Stoyan Stefanov', 'React Up and Running', 'Frontend', '2016-07-15', 3, 'https://covers.openlibrary.org/b/id/12411516-L.jpg'),
('9', 'Thomas Cormen', 'Algorithms Unlocked', 'Algorithms', '2013-03-01', 3, 'https://covers.openlibrary.org/b/id/8120302-L.jpg'),
('10', 'Erich Gamma', 'Design Patterns', 'Architecture', '1994-10-31', 3, 'https://covers.openlibrary.org/b/id/8114251-L.jpg');
GO

-- 5. CHÈN DỮ LIỆU BẢNG: book_for_rent (Cuốn sách vật lý)
-- Mỗi đầu sách (book_id 1-10) chèn đúng 3 barcode để khớp với quantity=3 ở trên
INSERT INTO book_for_rent (book_bar_code, status, book_id) VALUES 
('BC001', 'AVAILABLE', '1'), ('BC002', 'AVAILABLE', '1'), ('BC003', 'AVAILABLE', '1'),
('BC004', 'AVAILABLE', '2'), ('BC005', 'AVAILABLE', '2'), ('BC006', 'AVAILABLE', '2'),
('BC007', 'AVAILABLE', '3'), ('BC008', 'AVAILABLE', '3'), ('BC009', 'AVAILABLE', '3'),
('BC010', 'AVAILABLE', '4'), ('BC011', 'AVAILABLE', '4'), ('BC012', 'AVAILABLE', '4'),
('BC013', 'AVAILABLE', '5'), ('BC014', 'AVAILABLE', '5'), ('BC015', 'AVAILABLE', '5'),
('BC016', 'AVAILABLE', '6'), ('BC017', 'AVAILABLE', '6'), ('BC018', 'AVAILABLE', '6'),
('BC019', 'AVAILABLE', '7'), ('BC020', 'AVAILABLE', '7'), ('BC021', 'AVAILABLE', '7'),
('BC022', 'AVAILABLE', '8'), ('BC023', 'AVAILABLE', '8'), ('BC024', 'AVAILABLE', '8'),
('BC025', 'AVAILABLE', '9'), ('BC026', 'AVAILABLE', '9'), ('BC027', 'AVAILABLE', '9'),
('BC028', 'AVAILABLE', '10'), ('BC029', 'AVAILABLE', '10'), ('BC030', 'AVAILABLE', '10');
GO

-- THÔNG BÁO HOÀN TẤT
PRINT 'Database library_db setup successfully with clean dataset!';
```

4. Chạy dự án

Cách 1: Chạy trực tiếp file DemoApplication.java từ IntelliJ IDEA.

Cách 2: Dùng lệnh Maven tại thư mục gốc:

mvn spring-boot:run

Truy cập trang chủ tại địa chỉ: http://localhost:8080/index.html

🏗 Kiến trúc hệ thống

Dự án được tổ chức theo mô hình 3 lớp (3-Layer Architecture):

Model: Định nghĩa các thực thể (Entity) và quan hệ dữ liệu (1-N, N-N).

Repository: Interface giao tiếp với SQL thông qua Spring Data JPA.

Controller: Tiếp nhận các Request từ Client, xử lý logic nghiệp vụ và phản hồi JSON.

👥 Thành viên thực hiện

Bùi Phạm Chí Nhân - Chịu trách nhiệm chính Backend, Database và Tích hợp hệ thống.

Trần Lê Anh Quân - Chịu trách nhiệm chính Frontend, viết giao diện cho trang web.
