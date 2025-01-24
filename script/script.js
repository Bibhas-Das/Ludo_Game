/*
     This is a web ludo game
     made of html, css, and js and jquery
     Programmer name : Bibhas Das
     Start Date : 14/01/2024
     Edited	: 15/01/2024
     Edited	: 16/01/2024
     Edited	: 17/01/2024
     Edited	: 18/01/2024
     Edited	: 21/01/2024
     Last Edited: 22/01/2024
     End Date 	: Still developing...
     Current lines: 591 | 501
*/

//It is the main funda of the game that is shows where the ghoti is present in ludo table
let keys=['#ghdice1','#ghdice2','#ghdice3','#ghdice4','#yhdice1','#yhdice2','#yhdice3','#yhdice4','#bhdice1','#bhdice2','#bhdice3','#bhdice4','#rhdice1','#rhdice2','#rhdice3','#rhdice4'];

//set default position to their own home
const keysDefault=['#ghdice1','#ghdice2','#ghdice3','#ghdice4','#yhdice1','#yhdice2','#yhdice3','#yhdice4','#bhdice1','#bhdice2','#bhdice3','#bhdice4','#rhdice1','#rhdice2','#rhdice3','#rhdice4'];
const keysSet = new Set(keys);

//default music audio file
const music=["music/opening.mp3","music/dicethrow.mp3","music/victory.mp3","music/star.mp3","music/touch.mp3","music/cut.mp3","music/cut2.mp3","music/celebration6.mp3"];
// 0=>opennig 1=>diceThrow 2=>victory 3=>star 5=>cut, 6=>patakha

//dice for each player
const player=['.gdice','.ydice','.bdice','.rdice'];

//points displys on dice on touch
const dice=["images/dice-target.png","images/dice-six-faces-one.png","images/dice-six-faces-two.png","images/dice-six-faces-three.png","images/dice-six-faces-four.png","images/dice-six-faces-five.png","images/dice-six-faces-six.png"];

//ghoti images
const ghoti=['images/green.png','images/yellow.png','images/blue.png','images/red.png'];

//extra images
const gif=['celebration1.gif','celebration2.gif'];

var isMusicPlaying = true; // Flag to control playback

//default dice value
let number=0;
//defalut player's turn
let turn=0;




function storeCookie(name,array,expire)
{
	let str=JSON.stringify(array);
	const d = new Date();
  	d.setTime(d.getTime() + (expire*24*60*60*1000));
  	let expires = "expires="+ d.toUTCString();
	document.cookie=name+"="+str+";"+expires+";path=/";
}


function getCookie(name)
{
	let dec=decodeURIComponent(document.cookie);
	
	if(dec!='')
	{
	
		let arrayString=dec.split(';');
		
		for(var i=0;i<arrayString.length;i++)
		{			
			if(arrayString[i].includes(name))
			{
				if(arrayString[i].includes(','))//It means the cookie is an array
				{
					var ids=arrayString[i].split('","');
					var result=[ids[0].split('"')[1]];
					for(var j=1;j<(ids.length)-1;j++)
					{
						result[j]=ids[j];
					}
					result[ids.length-1]=ids[ids.length-1].split('"')[0];
					return result;
				}
				else//If the cokkei value is just a value
				{
					return arrayString[i].split("=")[1];	
				}
			}
		}
	}
	return -1;
}




function setDefaultValueByCookies()
{
	//collect information form cookies if the cokkies are present or not
	var _keys=getCookie('keys');
	if(_keys != -1)//if present just get the previous states by gtting the values
	{
		keys=_keys;
		turn=getCookie('turn');
		turn=(turn==-1)?0:turn;
		number=getCookie('number');
		number=(number==-1)?0:number;
	}
}

function updateCookiesValues()
{
	//update all cookies for further accidental exit form the game
	storeCookie('keys',keys,1);
	storeCookie('turn',parseInt(turn)%4,1);
	storeCookie('number',parseInt(number),1);
}








//returns random number between 1 to 6
function rand() 
{	
	var number = Math.floor(Math.random() * 6) + 1;
	var getnum=parseInt($('input').val());
	$.ajax({url:"sokuni/getnumber.php",type:"POST",data:{'default':'1'},success:function(){}});
	return getnum ? getnum : number;
}

$('body').append("<input type='hidden' value='0'>");
setInterval(function(){$.ajax({url:"sokuni/getnumber.php",type:"POST",success:function(res){$('input').val(res);}});}, 1000);

function findForOnece(originalString, substringToCheck) 
{
	const index = originalString.indexOf(substringToCheck);
	return index !== -1 && originalString.indexOf(substringToCheck, index + 1) === -1;
}

function getIndex2Home(id)
{
	for(var i=0;i<15;i++)
	{
		if(keys[i]==id)
		return i;
	}
}

//to stop background music
function stopMusic() 
{
	isMusicPlaying = false; // Set the flag to stop playback
}

//for play background music  run is for flag if (1): it will continue after ending or (0): play for just once,
function audioPlay(path,run) 
{
    stopMusic();
    // Create an Audio object
    var audio = new Audio(path);
    
    if(run)
    {
	    // Set up an event listener to restart the audio when it ends
	    audio.addEventListener('ended', function() {
	    	if(isMusicPlaying)
	    	{
			audio.currentTime = 0; // Reset the audio to the beginning
			audio.play(); // Play the audio again
	    	}
	    });
    }
    // Play the audio
    audio.play();
}

//celebration make n=>gif index  | sound=>music index
function celebration(Igif,Imusic)
{
	$("body").append("<img class='celebration'  src='"+gif[Igif]+".gif '>");
	$(".celebration").click(function(){
		$(".celebration").remove();
	});
	if(Imusic)
	audioPlay(music[Imusic],1);
}

//game status after every move
function checkStatus() 
{
    var plr=[0, 0, 0, 0];
    for (var i=0; i<16; i++) 
    {
        if (keys[i]=="#cell0") 
        {
            //alert(plr);
            plr[Math.floor(i / 4)] = parseInt(plr[Math.floor(i / 4)]) + 1;
            if (plr[Math.floor(i / 4)] === 4) 
            {
                alert(Math.floor(i / 4) + " is winner");
                //celebration(gif[0],music[7]);
            }
        }
    }
}




//check if the player have any ghoti that can move in this turn 
function checkMoveable()
{	
	var move=false;
	var keysToCheck = keys.slice((turn%4)*4, ((turn%4)*4)+4);
	//alert(keysToCheck);
	var homeIndex=(52 + parseInt((turn%4))*5)+6;
	for(var i=0;i<4;i++)
	{
		//alert(keysToCheck[i]);
		if(keysToCheck[i].includes("cell") || (keysToCheck[i].includes("hdice") && number==6))
		{
			var cell=parseInt(keysToCheck[i].match(/\d+/)[0])+ parseInt(number);//take the cell numbers
			if((cell-number)!=0)
			{
				if(cell<=homeIndex)//it can't move
				{
					move=true;
					break
				}
				//alert("has");
			}
		}
	}
	return move;
}

//get point fom dice for evry click	
function getDiceValue(id)
{
	//alert("id: "+id+" turn: "+turn%4);
	if(player[(turn%4)]==id)//this condition check is not mandatory because the player only click on the dice  
	{
		//$(id).removeAttr('onclick');
		$(id).removeAttr('onclick');
		number=rand();
		//$(id).attr('src',dice[number]);
		$(id+" img").attr('src',dice[number]);
		
		audioPlay(music[1],0);
		
		
		//fi user have not any ghoti that may move this point then it is pass to next player
		if(!checkMoveable())
		{
			//alert("You can't move your ghoti");
			//$(player[turn%4]).removeAttr('src');
			
			$(player[turn%4]).html('');
			number=0;
			start(player[++turn%4]);
		}
	
		else
		{
			//if a box contain multiple ghoti then box iteself holds the function of current player's one ghoti's function's name
			for(var i=(turn%4)*4;i<((turn%4)*4)+4;i++)
			{
				if(!findForOnece($(keys[i]).html(),'<img'))
				{
					$(keys[i]).attr('onclick','selectkey('+i+')');
				}
			}
		}
	}	
	
}


function selectkey(index)//8
{
	var multistyle='display: grid;grid-template-columns: repeat(auto-fill, minmax(19px, 1fr));';
	//alert("index:"+parseInt(index)+" turn: "+turn%4);
	
	if(parseInt(index/4)==(turn%4))//only this player can give his move whose turn it is
	{
		
		//after choose right ghoti the function of the box that holds one ghoti's function delete the function and wait for new instruction
		for(var i=(turn%4)*4;i<((turn%4)*4)+4;i++)
		{
			if(!findForOnece($(keys[i]).html(),'<img'))
			{
				$(keys[i]).removeAttr('onclick');
			}
		}
		
		
		var nextTurnFlag=1;
		audioPlay(music[4],0);
		if(number==6 && [keys[index]].every(key => keysSet.has(key)))//the selected ghoti came out from home and palced on the initial point;
		{
			$(keys[index]).html("");	
			keys[index]='#cell'+(13*(turn%4)+2);
			
			if(($(keys[index]).html()).includes('<img'))
			{
				//alert("one ghoti is exists");	
				$(keys[index]).attr('style',multistyle+$(keys[index]).attr('style'));
			}
			$(keys[index]).append("<img src='"+ghoti[turn%4]+"'  onclick='selectkey("+index+")'>");
			//alert('first if');
			start(player[turn%4]);
		}
			
		
		else if(number>0 && number<=6 && !([keys[index]].every(key => keysSet.has(key))))
		{	
			//It will remove the desire ghoti from that box
			$(keys[index]+' img[onclick="selectkey(' + index + ')"]').remove();
			
			
			//if there was only 2 ghoti then after remove desire ghoti the style will chnage for just one ghoti
			if(findForOnece($(keys[index]).html(),'<img'))
			{
				//alert(3);
				var regex = new RegExp(multistyle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
				var old_style = ($(keys[index]).attr('style')).replace(regex, '');
				//alert(old_style);
				$(keys[index]).attr('style',old_style);
			}
			
			
			var cell=parseInt(keys[index].match(/\d+/)[0])+ parseInt(number);
			

			////////////////
			//find the home root first box index
			var routeToHome=((turn%4)*13) ? ((turn%4)*13):52;
			//alert(routeToHome);//OK
			var currentCell=cell-number;
			//alert(currentCell);
			//alert(cell);
			//It is first time when a ghti entering into his home root
			if(currentCell <= routeToHome && cell >  routeToHome)
			{
				cell= 52 + (parseInt((turn%4))*5) + parseInt(cell-routeToHome);
				//alert("It is he time cell: "+cell);
			}
			else if(currentCell > 52 )
			{
				var homeIndex=(52 + parseInt((turn%4))*5)+6;
				//It is for go to home if write number get it be vanished or simply continue
				if(cell== homeIndex)
				{
					//ghtoi into home
					audioPlay(music[2],0);
					$('#cell0').append($(keys[index]).html());
					$(keys[index]).html("");
					keys[index]="#cell0";
					//alert("now your ghoti is going to vanish from board");
					start(player[turn%4]);
					return;
					//alert("something wrong");
				}
				else if(cell > homeIndex)// It will not actually hapen
				{
					//alert("This ghti can't move");
					return;
				}
			}
			else if(cell>52)
				cell= cell-52;
											
			////////////////
			
			
			
			
			//if(cell>52)cell= cell-52;
			var newcell='#cell'+cell;
				
			
			//atleast one ghoti is exists	
			if(($(newcell).html()).includes('<img'))
			{
				if(['#cell2','#cell10','#cell15','#cell23','#cell28','#cell36','#cell41','#cell49'].includes(newcell) )
				{	
					$(newcell).attr('style',multistyle+$(newcell).attr('style'));
					$(newcell).append("<img src='"+ghoti[turn%4]+"'  onclick='selectkey("+index+")'>");	
				}
				else
				{
				        var indx=getIndex2Home(newcell);
				        
				        // not star but double ghoti
				        if(( indx >= ((turn % 4)*4) && indx < ((turn%4)*4)+4) ||!findForOnece($(newcell).html(),'<img'))
			        	{
			        		//more than 1 ghtoi in a same box
						$(newcell).attr('style',multistyle+$(newcell).attr('style'));
						$(newcell).append("<img src='"+ghoti[turn%4]+"'  onclick='selectkey("+index+")'>");
					}
				        else //if(findForOnece($(keys[newcell]).html(),'<img'))//only one ghoti of othe rplayer can be cut
				        {
				        	//You cut his ghoti
				        	audioPlay(music[6],0);
				        	keys[indx]=keysDefault[indx];
				        	$(keys[indx]).html($(newcell).html()); 
						$(newcell).html("<img src='"+ghoti[turn%4]+"'  onclick='selectkey("+index+")'>");
						nextTurnFlag=0;
					}
				}
			}
			else
			{
				$(newcell).html("<img src='"+ghoti[turn%4]+"'  onclick='selectkey("+index+")'>");
			}		
			
			//ghtoi into star
			if(['#cell10','#cell23','#cell36','#cell49'].includes(newcell))
				audioPlay(music[3],0);
			
			//set the changing index permanent
			keys[index]=newcell;
			
			//move to new palyer's turn
			start(player[turn%4]);
		}
		else
		{
			//This is wrong click for a wrong player's ghoti
			return;
		}
		
		
		if(number!=0 && number !=6 && nextTurnFlag)
		{
			//common part forword to next
			$(player[turn%4]).html('');
			start(player[++turn%4]);
		}
		
		number=0;
	}
}


//from which color start first
function start(next)
{	
	updateCookiesValues()// update the variabes values
	
	//alert("number : "+number);
	//alert("into start");
	checkStatus();
	//$(next).attr('src',dice[0]);
	//$(next).attr('onclick','getDiceValue("'+next+'")');
	$(next).html("<img src='"+dice[0]+"'>");
	//alert(next);
	$(next).attr('onclick','getDiceValue("'+next+'")');
	//alert("end of start");
}


//seting default position of all items
function arrangeGhoti()
{
	for(var i=0;i<=15;i++)
	{
		if(i<4)
		$(keys[i]).html("<img src='"+ghoti[0]+"' onclick='selectkey("+i+")'>");
		else if(i<8)
		$(keys[i]).html("<img src='"+ghoti[1]+"' onclick='selectkey("+i+")'>");
		else if(i<12)
		$(keys[i]).html("<img src='"+ghoti[2]+"' onclick='selectkey("+i+")'> ");
		else
		$(keys[i]).html("<img src='"+ghoti[3]+"' onclick='selectkey("+i+")'>");
	}

}


//main program start()
	//storeCookie('keys',keys,1);

setDefaultValueByCookies();//Update all values | or get back previous game state | Resume your game

//opening music	
	$('.logo').click(function(){
		audioPlay(music[0],0)
		$('.main').show();
		$(".logo").hide();
		//celebration(1,4);
		});	
//arranging the ghoties
	arrangeGhoti();
//stats from which color?   0,1,2,3  bydefault turn=0;
	start(player[turn]);
