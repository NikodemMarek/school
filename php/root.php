<?php

require 'start_session.php';

if (!isset($_SESSION['logged_in_root']) || $_SESSION['logged_in_root'] !== true) {
  header('location: login.php');
}

require 'db.php';

mysqli_close($conn);

?>

<h1>dodaj seans</h1>
<form action="add_movie.php" method="post">
  <input type="text" name="title" placeholder="tytuł" required>
  <input type="datetime-local" name="datetime" required>

  <button type="submit">dodaj</button>
</form>

<?php include 'movies.php' ?>