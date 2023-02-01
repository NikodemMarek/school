<?php

require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = mysqli_real_escape_string($conn, $_POST["username"]);
    $password = mysqli_real_escape_string($conn, $_POST["password"]);

    $query = "SELECT * FROM users WHERE username='$username'";
    $result = mysqli_query($conn, $query);
    $user = mysqli_fetch_assoc($result);

    if ($username == "root" && $password == "root" && $user['id'] == 1) {
        session_start();
        $_SESSION['logged_in_root'] = true;
        $_SESSION['user_id'] = $user['id'];
        header('location: root.php');
    }

    if (password_verify($password, $user['password'])) {
        session_start();
        $_SESSION['logged_in'] = true;
        $_SESSION['user_id'] = $user['id'];
        header('location: home.php');
    } else {
        echo "niepoprawne hasło lub nazwa użytkownika";
    }
}

mysqli_close($conn);

?>

<!-- HTML form for registering a new user -->
<form action="login.php" method="post" id="login-form">
    <input type="text" name="username" placeholder="nazwa użytkownika" required>
    <input type="password" name="password" placeholder="hasło" required>

    <button type="submit">zaloguj</button>

    <a href="register.php" class="switch">zarejestruj</a>
</form>

<style>
body {
    overflow: hidden;
}

#login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    height: 100%;
}
#login-form input {
    width: 200px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
}

#login-form button {
    width: 200px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #ccc;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
}
#login-form button:hover {
    background-color: #333;
    color: #ccc;
}

.switch {
    display: block;
    margin-top: 10px;
    text-decoration: none;
    color: #ccc;
}
.switch:hover {
    color: #333;
}
</style>