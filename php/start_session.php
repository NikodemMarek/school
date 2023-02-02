<?php

session_start();

if (!(isset($_SESSION['logged_in']) && $_SESSION['logged_in']) && !(isset($_SESSION['logged_in_root']) && $_SESSION['logged_in_root'])) {
    header('location: _logout.php');
}

?>

<a href="_logout.php" id="logout">wyloguj</a>

<style>
#logout {
    border: 1px solid black;
    padding: 5px;
    border-radius: 5px;
    text-decoration: none;
    color: black;
}
#logout:hover {
    background-color: black;
    color: white;
}
</style>