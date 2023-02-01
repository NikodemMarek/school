<?php

require 'db.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    $sql = "SELECT * FROM movies WHERE id = $id";    
    $result = mysqli_query($conn, $sql);
    $movie = mysqli_fetch_assoc($result);

    $booked_seats = "SELECT * FROM booked WHERE movie_id = $id";
    $result = mysqli_query($conn, $booked_seats);
    $booked_seats = mysqli_fetch_all($result, MYSQLI_ASSOC);
    $booked_seats = array_map(function($seat) {
        return $seat['seat'];
    }, $booked_seats);
}

mysqli_close($conn);

?>

<form action="order_seats.php" method="post">
<input type="hidden" name="movie_id" value="<?php echo $movie['id'] ?>">

<div id='seats-map'>
<?php

$rows = range('A', 'O');
$numbers = range(0, 19);
$result = array();

foreach ($rows as $row) {
    foreach ($numbers as $number) {
        $result[] = "$row$number";
    }
}

foreach ($result as $key=>$seat) {
    $in = in_array($seat, $booked_seats);
    echo "<div class='seat'><input type='checkbox' name='seats[]' value='$seat' id='$seat'" . ($in? " disabled": "") . "><label for='$seat'>$seat</label></div>";
}

?>
</div>

<input type="submit" name="submit" value="zarezerwuj">
</form>

<style>
#seats-map {
    display: grid;
    grid-template-columns: repeat(20, 36px);
    grid-gap: 5px;
    padding: 10px
}

.seat {
    display: flex;
    align-items: center;
}

.seat input[type="checkbox"] {
    display: none;
}

.seat label {
    width: 36px;
    height: 36px;
    background-color: #ddd;
    border-radius: 4px;
    display: inline-block;
    position: relative;
}
.seat label:hover {
    cursor: pointer;
    background-color: #ccc;
}

.seat input[type="checkbox"]:checked + label {
    content: "";
    background-color: #0f0;
}
.seat input[type="checkbox"]:disabled + label {
    background-color: #f00;
}
</style>