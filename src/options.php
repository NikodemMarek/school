<?php

require 'db.php';

$select = $_POST['select'];

if ($select == "countrie") {
    $select = "countries";
} else if ($select == "alloy") {
    $select = "alloys";
} else {
    $select = "countries";
}

$query = "SELECT * FROM $select";
$result = $conn->query($query);

$rows = array();
while($r = $result->fetch_assoc()) {
    $rows[] = $r;
}

$conn->close();

print json_encode($rows);

?>