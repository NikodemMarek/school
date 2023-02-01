<?php

require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = mysqli_real_escape_string($conn, $_POST["title"]);
    $datetime = mysqli_real_escape_string($conn, $_POST["datetime"]);

    $sql = "INSERT INTO movies (title, datetime)
    VALUES ('$title', '$datetime')";

    if (mysqli_query($conn, $sql)) {
        header('location: root.php');
    } else {
        header('location: root.php');
    }
}

mysqli_close($conn);

?>