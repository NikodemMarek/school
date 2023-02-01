<?php

$conn = mysqli_connect("kinodb", "root", "root", "db", "3306");

if (!$conn) {
    die("nie udało się połączyć z bazą");
}

?>