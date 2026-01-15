async function handleLogin(event) {
    if (event) event.preventDefault();

    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: userVal, password: passVal})
        });
        if (response.ok) {
            const userData = await response.json();
            const idToSave = userData.userID || userData.userId || userData.id;

            if ( idToSave) {
                localStorage.setItem('userId', idToSave);
                localStorage.setItem('username', userData.username);
                localStorage.setItem('role', userData.role);
                alert("Đăng nhập thành công!");
                window.location.href = "index.html";
            } else {
                alert("Lỗi: Server không trả về user người dùng!")
            }

        } else {
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    } catch (e) {
        console.error("Lỗi", error);
    }
}