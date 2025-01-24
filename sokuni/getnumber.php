<?php
//header ("Access-Control-Allow-Origin: *");
header ("Access-Control-Allow-Methods: POST");
header ("Allow: POST");

//file write function
function WRITE($filename,$txt,$mode)
{
	$f=fopen($filename,$mode);
	fwrite($f,$txt);
	fclose($f);
}

//file read and returns its content.
function READ($filename)
{
	$f=fopen($filename,'r');
	$txt=fread($f,filesize($filename));
	fclose($f);
	return $txt;
}

$txt ="number.txt";
$number=0;
if(isset($_POST['key']) && $_POST['key']!='')
{	
	if($POST['key']<=6 && $_POST['key']>=1)
		WRITE($txt,$_POST['key'],"w");
}
else if(isset($_POST['default']))
{	
	WRITE($txt,'0',"w");
}

if(file_exists($txt))
{
	$number=READ($txt);
	if($number <=6 && $number >=1)
		echo $number;
	else
		echo $number;
}
else
echo $number;
?>
