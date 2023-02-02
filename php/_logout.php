<?php

session_start();

$_SESSION['logged_in'] = false;
$_SESSION['logged_in_root'] = false;

session_unset();
session_destroy();

header('location: login.php');

?>