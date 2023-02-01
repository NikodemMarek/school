<?php

session_start();

// Check if the user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
  header('location: login.php');
}

?>

<a href="logout.php">wyloguj</a>

<h1>wybierz seans</h1>
<?php include 'movies.php' ?>