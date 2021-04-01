<?php

    $db = mysqli_connect('localhost','root','root','appsalon');

    if(!$db){
        echo "fatal error al conectar a la base de datos";
    }

    // echo "se conecto a la base de datos";

?>