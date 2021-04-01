<?php

function obtenerServicios() : array {

    try {
        //importar coneccion
        require 'databases.php';

        //escribir codigo sql

        $sql = "SELECT * FROM servicios;";
        $consulta = mysqli_query($db,$sql);  //base de datos y consulta 


        //arreglo vacio
        $servicios = [];

        $i = 0;

        //obtener resultado

        while( $row = mysqli_fetch_assoc($consulta)){
            $servicios[$i]['id'] = $row['id'];            //al final del arreglo
            $servicios[$i]['nombre'] = $row['nombre'];            
            $servicios[$i]['precio'] = $row['precio'];           
            $i ++;
        }

        return $servicios;
        
        // echo "<pre>";
        // var_dump(mysqli_fetch_assoc($consulta));     //transformar en arreglo php
        // // var_dump(mysqli_fetch_all($consulta));          //todos
        // echo"</pre>";
        
        
    } catch (\Throwable $th) {
        var_dump($th);
    }                


} 

obtenerServicios();

?>