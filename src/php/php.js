var execPhp = require('exec-php');

execPhp('./prueba.php', function(error, php, outprint){
    // outprint is now `One'.
    
    php.my_function(1, 2, function(err, result, output, printed){
        // result is now `3'
        // output is now `One'.
        // printed is now `Two'.
    });
});