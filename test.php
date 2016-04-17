<?
$message = 'hello';

// Без "use"
$example = function () {
    var_dump($message);
};
echo $example();

// Наследуем $message
$example = function () use ($message) {
    var_dump($message);
};
echo $example();

?>