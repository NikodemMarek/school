<?php

include("db.php");

if(isset($_GET['acc']) && $_GET['acc'] == 'add') {
    $name = $_POST['name'];
    $country = $_POST['country'];
    $alloy = $_POST['alloy'];
    $year = $_POST['year'];
    $identifier = $_POST['identifier'];

    $query = "INSERT INTO currencies (name, country, alloy, year, identifier) VALUES ('$name', $country, $alloy, $year, '$identifier')";

    $stmt = $conn->prepare($query);
    $res = $stmt->execute();
    $stmt->close();

    $query = "SELECT currencies.*, alloys.name AS alloy, countries.name AS country FROM currencies JOIN alloys ON alloys.id = currencies.alloy JOIN countries ON countries.id = currencies.country ORDER BY currencies.id DESC LIMIT 1";

    $result = $conn->query($query);
    $currency = $result->fetch_assoc();

    echo json_encode($currency);

    $conn->close();
} else if(isset($_GET['acc']) && $_GET['acc'] == 'remove') {
    $id = $_POST['id'];

    $query = "DELETE FROM currencies WHERE id = $id";

    $stmt = $conn->prepare($query);
    $res = $stmt->execute();
    $stmt->close();

    $conn->close();

    echo json_encode($id);
} else if(isset($_GET['acc']) && $_GET['acc'] == 'get') {
    $query = "SELECT currencies.*, alloys.name AS alloy, countries.name AS country FROM currencies JOIN alloys ON alloys.id = currencies.alloy JOIN countries ON countries.id = currencies.country ORDER BY currencies.id ASC";

    $result = $conn->query($query);
    $currencies = $result->fetch_all(MYSQLI_ASSOC);

    $currencies = array_map(function ($row) {
        return $row;
    }, $currencies);

    $conn->close();

    echo json_encode($currencies);
} else if(isset($_GET['acc']) && $_GET['acc'] == 'update') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $country = $_POST['country'];
    $alloy = $_POST['alloy'];
    $year = $_POST['year'];
    $identifier = $_POST['identifier'];

    $query = "UPDATE currencies SET name = '$name', country = $country, alloy = $alloy, year = $year, identifier = '$identifier' WHERE id = $id";

    $stmt = $conn->prepare($query);
    $res = $stmt->execute();
    $stmt->close();

    $query = "SELECT currencies.*, alloys.name AS alloy, countries.name AS country FROM currencies JOIN alloys ON alloys.id = currencies.alloy JOIN countries ON countries.id = currencies.country WHERE currencies.id = $id";

    $result = $conn->query($query);
    $currency = $result->fetch_assoc();

    echo json_encode($currency);

    $conn->close();
}

?>