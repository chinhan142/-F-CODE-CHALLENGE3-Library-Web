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
