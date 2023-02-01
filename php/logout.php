<?php

session_start();
session_destroy();
$_SESSION['logged_in'] = false;
$_SESSION['logged_in_root'] = false;
header('location: login.php');

?>