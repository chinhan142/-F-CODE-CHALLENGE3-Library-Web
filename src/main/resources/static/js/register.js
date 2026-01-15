async function handleRegister(event) {
    event.preventDefault();
    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('password').value;

    if ( !userVal || !passVal) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const response = await fetch('http://127.0.0.1:8080/api/users/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: userVal, password: passVal})
    });
    const result = await response.json();
    if ( response.ok) {
        alert(result.message);
        window.location.href = "login.html";
    } else {
        alert(result.message);
    }
}