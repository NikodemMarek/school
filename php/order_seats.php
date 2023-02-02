<?php

require 'start_session.php';

require 'db.php';

$user = $_SESSION['user_id'];

if (isset($_POST['submit'])) {
    $movie = $_POST['movie_id'];
    $booked = $_POST['seats'];

    $sql = "INSERT INTO booked (seat, user_id, movie_id) VALUES ";
    foreach ($booked as $seat) {
        $sql .= "('$seat', $user, $movie),";
    }
    $sql = rtrim($sql, ',');
    $sql .= ";";

    if (mysqli_query($conn, $sql)) {
        header('location: home.php');
    } else {
        header('location: home.php');
    }
}

mysqli_close($conn);

?>