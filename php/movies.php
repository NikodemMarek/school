
<?php

require 'db.php';

$sql = "SELECT * FROM movies";
$result = mysqli_query($conn, $sql);
$movies = mysqli_fetch_all($result, MYSQLI_ASSOC);

mysqli_close($conn);

?>

<div id='movies-list'>
<?php foreach ($movies as $key=>$movie) : ?>
    <a href="seats.php?id=<?php echo $movie['id'] ?>">
        <div class="movie">
            <h2><?php echo $key + 1 ?>. <?php echo $movie['title'] ?></h2>
            <p><?php echo $movie['datetime'] ?></p>
        </div>
    </a>
<?php endforeach; ?>
</div>

<style>
#movies-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.movie {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: 300px;
    height: 120px;

    background-color: #ccc;
    border: 1px solid #333;
    border-radius: 5px;
}

a {
  text-decoration: none;
  color: black;
}
</style>