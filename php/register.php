<?php

require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = mysqli_real_escape_string($conn, $_POST["username"]);
    $password = mysqli_real_escape_string($conn, $_POST["password"]);
    $phone = mysqli_real_escape_string($conn, $_POST["phone"]);

    $password = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (username, password, phone)
    VALUES ('$username', '$password', '$phone')";

    if (mysqli_query($conn, $sql)) {
        header('location: login.php');

        // session_start();
        // $_SESSION['logged_in'] = true;
        // header('location: home.php');
    } else {
        header('location: register.php');
    }
}

mysqli_close($conn);

?>

<!-- HTML form for registering a new user -->
<form action="register.php" method="post" id="register-form">
    <input type="text" name="username" placeholder="nazwa użytkownika" required>
    <input type="password" name="password" placeholder="hasło" required>
    <input type="tel" id="phone" name="phone" placeholder="numer telefonu" required>

    <button type="submit">zarejestruj</button>

    <a href="login.php" class="switch">zaloguj</a>
</form>

<style>
body {
    overflow: hidden;
}

#register-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    height: 100%;
}
#register-form input {
    width: 200px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
}

#register-form button {
    width: 200px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #ccc;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
}
#register-form button:hover {
    background-color: #333;
    color: #ccc;
}

.switch {
    display: block;
    margin-top: 10px;
    text-decoration: none;
    color: #ccc;
    font-size: 12px;
}
.switch:hover {
    color: #333;
}
</style>