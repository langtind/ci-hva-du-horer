// JavaScript Document
	 
/***************************************************************************************** INIT FUNC*/
function CI_sanger_init(){
	
	console.log('sanger init run')
	
	/************************  VARIABLE  ***************************************************** VAR START*/
	
	myModus = "lytte";
	myType = "tekst"
	myCurrentSong = "tom";
	
	
	/************************  VARIABLE  ***************************************************** VAR END*/
		 
	CI_framework_clearAllSpeakers()
	CI_framework_aktiverAlleBokser(9,'navSanger')
	CI_framework_DeAktiverMarkerModus(9,'sang_check') // boksene
	
	 CI_framework_setMyStemme()
	

	document.getElementById('interaktivTxt').style.fontSize = "20px";
	document.getElementById('interaktivTxt').style.visibility = "hidden";
	document.getElementById('txtCheckbox').checked = true;
	document.getElementById('textCheck').style.visibility = "hidden";
	document.getElementById('txtCheckbox').style.visibility = "hidden";
	document.getElementById('vidCheckbox').checked = true;
	document.getElementById('videoCheck').style.visibility = "hidden";
	document.getElementById('vidCheckbox').style.visibility = "hidden";
	document.getElementById('play-pause').style.visibility = "hidden";
	
	aSanger = ["javielsker", "jegersaaglad", "mikkelrev", "perspelmann", "lillelam", "blaaballong", "kjaerlighetsvisa", "lisagikktilskolen", "lysogvarme"]
	
	checkButtons= document.getElementsByName('nameSang');
	
	for (j = 0; j<9; j++){
		checkButtons[j].checked = false;
	}
	
	for (j = 0; j<2; j++){
		checkButtons[j].checked = true;
	}
	
	/************ START TIDSKODER ***********************************************************************/
	
	javielsker_setningsArray = ["Ja, vi elsker dette landet<br> som det stiger frem<br>", "furet, værbitt over vannet,<br> med de tusen hjem.<br>","Elsker, elsker det og tenker<br> på vår far og mor<br>","og den saganatt som senker<br> drømme på vår jord.<br>","Og den saganatt som senker,<br> senker drømme på vår jord."];	 
	javielsker_tidskodeArray_mann = [[0.0, 9.1], [9.2, 18.2], [18.3, 27.8], [27.9, 37.0], [37.1, 48.2]]; 
	javielsker_tidskodeArray_dame = [[0.9, 12.9], [13.0, 24.2], [24.3, 34.9], [35.0, 47.0], [47.1, 60.3]]; 
	
	mikkelrev_setningsArray = ["Mikkel Rev satt og skrev,<br> på ei lita tavle.<br>", "Tavla sprakk. Mikkel skvatt<br> oppi pappas flosshatt<br><br>","Mikkel Rev skrev et brev,<br> sendte det til månen.<br>"," Månen sa: Hipp hurra!<br> Sendte det til Afrika.<br><br>","Afrika, Afrika<br> ville ikke ha det.<br>","Afrika, Afrika<br> sendte det tilbake<br>","med ei bløtekake."];	 
	mikkelrev_tidskodeArray_mann = [[0.0, 6.0], [6.1, 12.5], [12.6, 19.5], [19.6, 26], [26.1, 33], [33.1, 39], [39.1, 45]]; 
	mikkelrev_tidskodeArray_dame = [[1.0, 10.2], [10.3, 20.1], [20.2, 29.5], [29.6, 39.1], [39.2, 47.7], [47.8, 56.7], [56.8, 62.6]]; 
	
	lillelam_setningsArray = ["Bæ, bæ, lille lam,<br> har du noe ull?<br>","Ja, ja, kjære barn,<br> jeg har kroppen full.<br>"," Søndagsklær til far,<br> og søndagsklær til mor,<br>","og to par strømper<br> til bitte lille bror."];	 
	lillelam_tidskodeArray_mann = [[0.0, 5.4], [5.5, 11.4], [11.5, 16.9], [17.0, 24.8]];
	lillelam_tidskodeArray_dame = [[0.9, 8.2], [8.3, 15.8], [15.9, 22.8], [22.9, 32.1]];	
	
	kjaerlighetsvisa_setningsArray = ["Når sommardagen ligg utover landet<br>","og du og æ har funne oss ei strand<br>","og fire kalde pils ligg nedi vannet<br>","og vi e brun og fin og hand i hand,<br>","når vi har prata om ei bok vi lika<br>","og alt e bra og ikkje te å tru:<br>","Ingen e så god som du, da.<br>","Ingen e så god som du."];	 
	kjaerlighetsvisa_tidskodeArray_mann = [[0.0, 5.0], [5.1, 10.6], [10.7, 15.8], [15.9, 20.7], [20.8, 26.3], [26.4, 31.8], [31.9, 37.0], [37.1, 42.2]]; 
	kjaerlighetsvisa_tidskodeArray_dame = [[1.3, 7.7], [7.8, 13.7], [13.8, 20.1], [20.2, 26.1], [26.2, 32.8], [32.9, 39.1], [39.2, 45.7], [45.8, 52.5]]; 
	
	lysogvarme_setningsArray = ["Når mørke no har sænka sæ,<br>","går æ stilt igjennom rommet.<br>","Å følelsan dæm slit i mæ.<br>","Ka vil framtida gi?<br><br>","Å den arven vi har gitt dæ,<br>","kainn vær tung å ta me sæ.<br>","Vil du spørr oss, vil du last oss?<br>","Vil du kall det førr et svik?<br><br>","Sola som gikk ned i kveld, ho ska skin førr dæ, min kjære.<br>","Å føglan som e fri, dæm ska vis vei å aillt ska bli<br>","myttji lys å myttji varme.<br>","Tru å håp, det kan du få med.<br>","Mange tåra, tunge stunde, e æ redd førr at det bli."];	 
	lysogvarme_tidskodeArray_mann = [[0.0, 3.9], [4.0, 8.0], [8.1, 12.5], [12.6, 16.0], [16.1, 21.0], [21.1, 25.1], [25.2, 29.9], [30.0, 34.3], [34.4, 43.3], [43.4, 51.7], [51.8, 56.1], [56.2, 60.0], [60.1, 71.6]]; 
	lysogvarme_tidskodeArray_dame = [[1.0, 5.6], [5.7, 10.1], [10.2, 14.3], [14.4, 19.3], [19.4, 23.2], [23.3, 27.2], [27.3, 31.5], [31.6, 37.8], [37.9, 46.6], [46.7, 54.6], [54.7, 59.0], [59.1, 63.0], [63.1, 73.7]]; 
	
	jegersaaglad_setningsArray = ["Jeg er så glad hver julekveld,<br>","for da ble Jesus født;<br>","da lyste stjernen som en sol<br>","og engler sang så søtt."];	 
	jegersaaglad_tidskodeArray_mann = [[0.0, 4.7], [4.8, 9.8], [9.9, 15.2], [15.3, 20.2]]; 
	jegersaaglad_tidskodeArray_dame = [[1.3, 7.2], [7.3, 13.0], [13.1, 19.6], [19.7, 26.5]]; 
	
	perspelmann_setningsArray = ['Per Spelmann, han hadde ei einaste ku.<br>','Per Spelmann, han hadde ei einaste ku.<br>','Han bytte bort kua, fekk fela igjen.<br>','Han bytte bort kua, fekk fela igjen.<br>','"Du gamle, gode fiolin, du fiolin, du fela mi!”'];	 
	perspelmann_tidskodeArray_mann = [[0.0, 5.2], [5.3, 9.9], [10.0, 15.5], [15.6, 20.1], [20.2, 29.0]]; 
	perspelmann_tidskodeArray_dame = [[0.9, 6.8], [6.9, 12.9], [13.0, 18.6], [18.7, 24.3], [24.4, 35.0]];; 
	
	blaaballong_setningsArray = ["Jeg vil ha en blå ballong,<br>","en sånn der en fin ballong.<br>","En med hatt og nese på,<br>", "og den skal være blå.<br>","Den skal være flott og dyr,<br>","nesten som et eventyr,<br>","flyve som et riktig fly<br>","og stige høyt i sky."];	 
	blaaballong_tidskodeArray_mann = [[0.0, 4.0], [4.1, 8.3], [8.4, 12.2], [12.3, 15.7], [15.8, 20.0], [20.1, 24.1], [24.2, 28.0], [28.1, 31.7]]; 	
	blaaballong_tidskodeArray_dame = [[0.9, 4.8], [4.9, 9.2], [9.3, 12.8], [12.9, 16.7], [16.8, 20.4], [20.5, 24.4], [24.5, 28.0], [28.1, 32.0]]; 
	
	lisagikktilskolen_setningsArray = ["Lisa gikk til skolen.<br>Tripp, tripp, tripp det sa.<br>","I den nye kjolen<br>trippet hun så glad.<br><br>","Per, han stod for presten.<br>Spør om han var kar!<br>","I den nye vesten<br>lignet han på far.<br><br>","Nå er Per og Lisa<br>gamle må du tro.<br>","Men den vesle visa<br>synger begge to."];	 
	lisagikktilskolen_tidskodeArray_mann = [[0.0, 5.8], [5.9, 11.5], [11.6, 17.8], [17.9, 24.0], [24.1, 31.1], [31.2, 38.2]];		
	lisagikktilskolen_tidskodeArray_dame = [[1.0, 8.0], [8.1, 15.8], [15.9, 23.4], [23.5, 30.9], [31.0, 38.6], [38.7, 46.6]];	

	/************ SLUTT TIDSKODER ***********************************************************************/

	
	 document.getElementById('btnMenu').focus();
}

/**************** LYTTE / ØVE*/

function CI_musikk_sang_velgModus(){
		radioButtons = document.getElementsByName('modus');
		for (i = 0; i < radioButtons.length; i++) {
			if (radioButtons[i].checked == true) {
				myModus = radioButtons[i].value;
			}
		}

		CI_framework_clearAllSpeakers()
		CI_InteractiveTranscript_handleChange()
		/*document.getElementById('interactiveTranscript').style.visibility = "hidden"*/
		CI_musikk_sang_resetMarkering()
		
		if (myModus == "lytte"){
			
			console.log('myType: '+myType)
			
			CI_framework_hideOppgaveNav()
			CI_framework_clearAudioOppg()
			CI_framework_aktiverAlleBokser(9,'navSanger')
			CI_framework_nullstillFarge(9,'navSanger')
			CI_framework_DeAktiverMarkerModus(9,'sang_check') // boksene

		 } else {
			 
			
			 /*CI_musikk_sanger_setSang_withTranscript(myCurrentSong)*/
			  
			 
			 
			 CI_framework_startToStartBtn()			 
			 document.getElementById("interaktivTxt").style.visibility = "hidden";
			 document.getElementById("textCheck").style.visibility = "hidden";
			 document.getElementById("txtCheckbox").style.visibility = "hidden";
			 vid.style.visibility = "visible";
			 vid.style.opacity = 1;
			 
			 CI_framework_InitOppgaveNav()
			 CI_framework_showOppgaveNav()
			 CI_framework_AktiverMarkerModus(9,'sang_check') // boksene
			 CI_framework_deaktiverAlleBokser(9,'navSanger')
			 CI_framework_nullstill()
			 
			 	 

		 };
		 
	 };




/*radio mann/damestemme*/
function CI_musikk_runMyStemmeValg(){
	console.log('myCurrentSong:'+myCurrentSong);
	
	clearInterval(interval4PlayingEvent);
	clearInterval(intervall4ClickEvent);
	interval4PlayingEventBool = false;
	vid.pause()
	CI_framework_clearAllSpeakers()
	vid.style.visibility="visible";
	vid.style.opacity = 1;
	document.getElementById('vidCheckbox').checked = true;
	
	document.getElementById('play-pause').innerHTML="<i id='play-pause-itag' class='material-icons'>play_circle_filled</i>";
	
	if (myCurrentSong!="tom"){
	if (myModus == "lytte"){
			if (myType == "tekst"){
				console.log('inside myType tekst')
				CI_musikk_sanger_setSang_withTranscript(myCurrentSong)
				CI_musikk_markselected(myCurrentSong)
			}
			if (myType == "lalala"){
				console.log('inside myType lalala')
				CI_musikk_sanger_setSang_noTranscript(myCurrentSong)
				CI_musikk_markselected(myCurrentSong)
				
			}
		}
	
	//her er man igang med øvingen
		
		if (myModus == "ove" && markerModus==false){

		  
		if (myType == "lalala"){
		CI_musikk_sanger_setSang_noTranscript(myCurrentSong)
		} 
			
		if (myType == "tekst"){
		CI_musikk_sanger_setSang_withTranscript(myCurrentSong)
		} 
			
			
			document.getElementById('interaktivTxt').style.visibility = "hidden";
		   document.getElementById('txtCheckbox').style.visibility = "hidden";
		   document.getElementById('textCheck').style.visibility = "hidden";
			
			
		}
	
	
	}
}



/*Her trykkes det på en sang-knapp, sangmeny */
function CI_musikk_sang_velgSang(song,nr){
	
	ValgtSang=song

	
	if (myModus == "lytte"){
			if (myType == "tekst"){
				console.log('inside myType tekst')
				
				CI_framework_turnoffInteraktivTranscript()
				CI_InteractiveTranscript_handleChange()
				document.getElementById('vidCheckbox').checked = true;
				document.getElementById('videoCheck').style.visibility = "visible";
				document.getElementById('vidCheckbox').style.visibility = "visible";
				vid.style.visibility="visible";
				vid.style.opacity = 1;
				
				CI_framework_turnonInteraktivTranscript()
				CI_musikk_sanger_setSang_withTranscript(song)
				CI_musikk_markselected(song)
			}
			if (myType == "lalala"){
				console.log('inside myType lalala')
				CI_musikk_sanger_setSang_noTranscript(song)
				CI_musikk_markselected(song)
				
				vid.pause();
				videoplayingBool = false;
				document.getElementById('speakerOve').style.visibility="hidden";
				document.getElementById('play-pause').innerHTML="<i id='play-pause-itag' class='material-icons'>play_circle_filled</i>";
				
				document.getElementById('vidCheckbox').checked = true;
				vid.style.visibility="visible";
				vid.style.opacity = 1;
				document.getElementById('play-pause').style.visibility = "visible";
				document.getElementById('videoCheck').style.visibility = "visible";
				document.getElementById('vidCheckbox').style.visibility = "visible";
			}
		
	}

	if (myModus == "ove" && markerModus==true){
		
		var checkButtons= document.getElementsByName('nameSang');
		teller = 0;
		for (i=0; i<9; i++) {
			if (checkButtons[i].checked == true){
				teller = teller + 1;
			}
		}
		
		if (teller == 0){
			CI_framework_deactivateStartButton()
		} else {
			CI_framework_activateStartButton()
			
		}
	
	}
	
	if (myModus == "ove" && markerModus==false){
		fasitKlikket = false;
		
		
		if (oppgNr==20){
			CI_framework_showResultat()
			CI_framework_deactivateStartButton()
			$("#nesteBtn").removeClass("blink");
			
			vid.pause();
			clearInterval(interval4PlayingEvent);
	        interval4PlayingEventBool = false;
			
			
			
		} else {
			CI_framework_activateStartButton()
			
		}
		
		
		CI_framework_deaktiverFasit()
		CI_musikk_markselected(song)
		
		
		
		
		
		if (ValgtSang == RiktigSang){
			
			console.log("riktig")
			
			vid.pause();
				
				document.getElementsByClassName('navSanger')[nr-1].style.backgroundColor=ciColorGreen;
				
				if (firstClick == false){
					firstClick = true;
					antRiktig = antRiktig + 1;
					document.getElementById('statCelle'+oppgNr).style.backgroundColor=ciColorGreen;
					document.getElementById('statCelle'+oppgNr).innerHTML = statCelleRiktig;
				}
				
			} else {
				
				console.log("feil")
				
				if (firstClick == false){
					firstClick = true;
					document.getElementById('statCelle'+oppgNr).style.backgroundColor=ciColorRed;
					document.getElementById('statCelle'+oppgNr).innerHTML = statCelleFeil;
				}
				document.getElementsByClassName('navSanger')[nr-1].style.backgroundColor=ciColorRed;
			}
			
			 document.getElementById('respons').innerHTML="<strong>Resultat:</strong><br><br>Du fikk "+antRiktig+" riktige av "+oppgNr+" mulige"; 
		 }
	}
	



/*radioknapp tekst / lalala*/
function CI_musikk_sang_velgType(){
	
	
	clearInterval(interval4PlayingEvent);
	clearInterval(intervall4ClickEvent);
	interval4PlayingEventBool = false;
	vid.pause()
	document.getElementById('play-pause').innerHTML="<i id='play-pause-itag' class='material-icons'>play_circle_filled</i>";
	vid.style.visibility="visible";
	CI_framework_clearAllSpeakers()
	
        
if(document.getElementById('tekst').checked == true){
		myType = "tekst"
		console.log('vi bytter til tekst')
			

	if (myModus == "ove"){	
			if (myCurrentSong!="tom"){
			CI_musikk_sanger_setSang_withTranscript(myCurrentSong)
			document.getElementById('interaktivTxt').style.visibility = "hidden";
			document.getElementById('txtCheckbox').style.visibility = "hidden";
			document.getElementById('textCheck').style.visibility = "hidden";	
				
				}
		}
	
	
	if (myModus == "lytte"){	
			if (myCurrentSong!="tom"){
			console.log('lytte + tekst *********************************************')
			CI_musikk_sanger_setSang_withTranscript(myCurrentSong)
			document.getElementById('vidCheckbox').checked = true;
			document.getElementById('interaktivTxt').style.visibility = "visible";
			document.getElementById('txtCheckbox').style.visibility = "visible";
			document.getElementById('textCheck').style.visibility = "visible";	
				
				}
		}
	
	
	
	}
	
	
	
	if(document.getElementById('lalala').checked == true){
		myType = "lalala"
		console.log('vi bytter til lalala')
		
		if (myModus == "lytte"){	
		
			if (myCurrentSong!="tom"){
			CI_musikk_sanger_setSang_noTranscript(myCurrentSong)
			document.getElementById('vidCheckbox').checked = true;
			CI_InteractiveTranscript_toggle_video()
			CI_InteractiveTranscript_handleChange()
		}
		}
			
		if (myModus == "ove"){	
		
			if (myCurrentSong!="tom"){
			CI_musikk_sanger_setSang_noTranscript(myCurrentSong)
			document.getElementById('vidCheckbox').checked = true;
			/*vid.play()*/
		}
			
			
			
			console.log("hva pokker er vidstyle her: "+vid.style.visibility)
			console.log("hva pokker er vidstyle opacity her: "+vid.style.opacity)
			
				
		}
	}
	
	
	if (myModus == "ove" && markerModus==true){
		
		vid.style.visibility="hidden";
	}
	
	
}

	

function CI_sanger_lagNyTabell(){
	
	aTabell=[];
	checkButtons = document.getElementsByName('nameSang');
	
	for (i = 0; i < checkButtons.length; i++) {
		if (checkButtons[i].checked == true) {
			aTabell.push(i)
		}
	}
}




function CI_sanger_nullstill(){
	
	CI_sanger_lagNyTabell()
	oppgNr = 0;
		
	CI_musikk_sang_resetMarkering()
	CI_framework_AktiverMarkerModus(9,"sang_check")
	CI_framework_aktiverAlleBokser(9,'navSanger')
	
	
	
	/*Sjekker om utvalg er gjort - slik at oppgave kan starte - START*/
	console.log(aTabell)
	if (aTabell.length != 0){
		CI_framework_activateStartButton()
		$("#nesteBtn").addClass("blink");
	} else {
		CI_framework_deactivateStartButton()
		$("#nesteBtn").removeClass("blink");
	}
	
	CI_framework_startToStartBtn()
	vid.pause();
	vid.style.visibility="hidden";
	document.getElementById('vidCheckbox').checked = true;
	
	document.getElementById('play-pause').style.visibility = "hidden";
	document.getElementById('videoCheck').style.visibility = "hidden";
	document.getElementById('vidCheckbox').style.visibility = "hidden";

}





/* Start / Neste */
function CI_sanger_random() {
	
	CI_framework_deactivateStartButton()
	CI_musikk_sang_resetMarkering()
	CI_framework_activateGjentaButton()
	CI_framework_activateFasitButton()
	
	

	if (markerModus==true){
		//Oppgaven starter fra begynnelsen
		
		CI_sanger_nullstill()
		$("#nesteBtn").removeClass("blink");
		vid.style.visibility="visible";
		vid.style.opacity = 1;
		document.getElementById('play-pause').style.visibility = "visible";
		document.getElementById('videoCheck').style.visibility = "visible";
	    document.getElementById('vidCheckbox').style.visibility = "visible";
		
				
		CI_framework_deaktiverAlleBokser(9,'navSanger')
		
		for (i = 0; i < aTabell.length; i++) {
			document.getElementsByClassName('navSanger')[aTabell[i]].style.opacity="1.0";
			document.getElementsByClassName('navSanger')[aTabell[i]].style.pointerEvents="auto";
		}

		CI_framework_startToNesteBtn()
	}
	
	CI_framework_DeAktiverMarkerModus(9,'sang_check') // boksene
	CI_framework_deactivateStartButton()
	
	if (oppgNr < antOppg){
		firstClick = false;
		fasitKlikket = false;
		oppgNr = oppgNr + 1;
		
		//marker for orange - gjeldene oppgave
		
		/*document.getElementById('statCelle'+oppgNr).style.backgroundColor=ciColorYellow;
		document.getElementById('statCelle'+oppgNr).innerHTML = statCelleUlost;*/
		 /*marker for gjeldene oppgave*/
		document.getElementById('statCelle'+oppgNr).style.backgroundColor=ciColorFour;
		
		randNr = Math.floor(Math.random() * aTabell.length);
		
		
		RiktigSangNr = aTabell[randNr]+1
		
		RiktigSang = aSanger[aTabell[randNr]]
		
		
		
		 if (myType == "tekst"){
				console.log('inside myType tekst')
				CI_musikk_sanger_setSang_withTranscript(RiktigSang)
				
			}
			if (myType == "lalala"){
				console.log('inside myType lalala')
				CI_musikk_sanger_setSang_noTranscript(RiktigSang)
				
				
			}
		
		 console.log('myType: '+myType)
		/*CI_musikk_sanger_setSang_withTranscript(RiktigSang)*/
		vid.play()
		document.getElementById('interaktivTxt').style.visibility = "hidden";
		document.getElementById('txtCheckbox').style.visibility = "hidden";
		document.getElementById('textCheck').style.visibility = "hidden";
		
		console.log(RiktigSang)
	 }
}

function CI_sanger_klikkFasit(){
		 
		 fasitKlikket = true;
		 
		 CI_framework_FasitButtonClicked()
		 document.getElementsByClassName('navSanger')[RiktigSangNr-1].style.backgroundColor = ciColorYellow;
		
		 if (firstClick == false){
			document.getElementById('statCelle'+oppgNr).style.backgroundColor=ciColorOne; 
			document.getElementById('statCelle'+oppgNr).innerHTML = statCelleUlost;
		 }
		 firstClick = true;

	 }

function CI_sanger_gjenta(){
	
	if (myType == "lalala"){
		CI_musikk_sanger_setSang_noTranscript(myCurrentSong)
		   document.getElementById('interaktivTxt').style.visibility = "hidden";
		   document.getElementById('txtCheckbox').style.visibility = "hidden";
		   document.getElementById('textCheck').style.visibility = "hidden";
		} 
		if (myType == "tekst"){
		CI_musikk_sanger_setSang_withTranscript(myCurrentSong)
			document.getElementById('interaktivTxt').style.visibility = "hidden";
			document.getElementById('txtCheckbox').style.visibility = "hidden";
		    document.getElementById('textCheck').style.visibility = "hidden";
		} 
		vid.play()
	
	
}

// sunget med fulltekst
function CI_musikk_sanger_setSang_withTranscript(text){
	
	myCurrentSong = text;
	document.getElementById('txtCheckbox').checked = true;
	
	switch(text) {
    	case 'javielsker':
       setningsArray = javielsker_setningsArray;
			if (myStemme == "mann"){
				tidskodeArray = javielsker_tidskodeArray_mann;
			vid.src = 'https://player.vimeo.com/external/352689832.sd.mp4?s=cafa2d9c60fb36f9158e37d24ab53b9a8078278f&profile_id=165';
			}
			if (myStemme == "dame"){
				tidskodeArray = javielsker_tidskodeArray_dame;
			vid.src = 'https://player.vimeo.com/external/353305408.sd.mp4?s=1b4fd88d3f6f7c0cac52e30d6d5a282d32ceff30&profile_id=165';
			}
        break;
			case 'mikkelrev':
       setningsArray = mikkelrev_setningsArray;
			if (myStemme == "mann"){
				 tidskodeArray = mikkelrev_tidskodeArray_mann;
			vid.src = 'https://player.vimeo.com/external/352689976.sd.mp4?s=fc479bf916a0ff6b88e4613eae8b92cc4f862515&profile_id=165';
			}
			if (myStemme == "dame"){
				 tidskodeArray = mikkelrev_tidskodeArray_dame;
			vid.src = 'https://player.vimeo.com/external/353305489.sd.mp4?s=b3a1821d3e52dd25e48dfe744b9e583e37cdf71b&profile_id=165';
			}
        break;
			case 'lillelam':
       setningsArray = lillelam_setningsArray;			
			if (myStemme == "mann"){
				tidskodeArray = lillelam_tidskodeArray_mann;
			vid.src = 'https://player.vimeo.com/external/352689764.sd.mp4?s=10c107d063b599b0786d730be7b27f7bbf7869c8&profile_id=165';
			}
			if (myStemme == "dame"){
				 tidskodeArray = lillelam_tidskodeArray_dame;
			vid.src = 'https://player.vimeo.com/external/353305383.sd.mp4?s=7c89a999e8f61fc4e971c1390202cec1b41d28d8&profile_id=165';
			}	
        break;
			case 'kjaerlighetsvisa':
       setningsArray = kjaerlighetsvisa_setningsArray;			
			if (myStemme == "mann"){
				 tidskodeArray = kjaerlighetsvisa_tidskodeArray_mann;
			vid.src = 'https://player.vimeo.com/external/352689895.sd.mp4?s=bac235717244a5d4873609d15f3cfda661eb2a1e&profile_id=164';
			}
			if (myStemme == "dame"){
				  tidskodeArray = kjaerlighetsvisa_tidskodeArray_dame;
			vid.src = 'https://player.vimeo.com/external/353305441.sd.mp4?s=e1d4d3176b49f2c977ee3ff3503c57b2df555e7b&profile_id=165';
			}	
        break;
			case 'lysogvarme':
       setningsArray = lysogvarme_setningsArray;
			if (myStemme == "mann"){
				 tidskodeArray = lysogvarme_tidskodeArray_mann;	
			vid.src = 'https://player.vimeo.com/external/352689944.sd.mp4?s=09e5dd7c268e71d4930ab8c30c0375ba7e1981b7&profile_id=165';
			}
			if (myStemme == "dame"){
				  tidskodeArray = lysogvarme_tidskodeArray_dame;	
			vid.src = 'https://player.vimeo.com/external/353305476.sd.mp4?s=92f8cd1f3ed53a111576f22f29d0f7355edab164&profile_id=165';
			}		
        break;
			case 'jegersaaglad':
       setningsArray = jegersaaglad_setningsArray;			
			if (myStemme == "mann"){
				 tidskodeArray = jegersaaglad_tidskodeArray_mann;
			vid.src = 'https://player.vimeo.com/external/352689868.sd.mp4?s=8ac6203f939e5c4458aa00d0dda89265863e910d&profile_id=164';
			}
			if (myStemme == "dame"){
				   tidskodeArray = jegersaaglad_tidskodeArray_dame;
			vid.src = 'https://player.vimeo.com/external/353305422.sd.mp4?s=d23e5cfe123caf107b2ae6f13bb99354774bbd32&profile_id=165';
			}
        break;
			case 'perspelmann':
       setningsArray = perspelmann_setningsArray;
	   vid.src = 'https://player.vimeo.com/external/352690017.sd.mp4?s=a69f502fc54d98e34c57b2fdba9f7c4c47f1de01&profile_id=164';
			if (myStemme == "mann"){
				  tidskodeArray = perspelmann_tidskodeArray_mann;
			vid.src = 'https://player.vimeo.com/external/352690017.sd.mp4?s=a69f502fc54d98e34c57b2fdba9f7c4c47f1de01&profile_id=164';
			}
			if (myStemme == "dame"){
				    tidskodeArray = perspelmann_tidskodeArray_dame;
			vid.src = 'https://player.vimeo.com/external/353305503.sd.mp4?s=702f11f43ea1a2adf5e83274dd24cc1af5650441&profile_id=165';
			}
        break;
			case 'blaaballong':
       setningsArray = blaaballong_setningsArray;			
			if (myStemme == "mann"){
				  tidskodeArray = blaaballong_tidskodeArray_mann;
			vid.src = 'https://player.vimeo.com/external/352689796.sd.mp4?s=28ff1e3ae449160c870afa3fe0598026f98426d8&profile_id=165';
			}
			if (myStemme == "dame"){
				    tidskodeArray = blaaballong_tidskodeArray_dame;
			vid.src = 'https://player.vimeo.com/external/353305397.sd.mp4?s=6d4989a8c38fac6d127fec8846c826b147971e13&profile_id=165';
			}
        break;
			case 'lisagikktilskolen':
       setningsArray = lisagikktilskolen_setningsArray;
			if (myStemme == "mann"){
				  tidskodeArray = lisagikktilskolen_tidskodeArray_mann;
			vid.src = 'https://player.vimeo.com/external/352689923.sd.mp4?s=21bf8a76c8c22753178e718c8fb24661bbcd4acf&profile_id=164';
			}
			if (myStemme == "dame"){
				    tidskodeArray = lisagikktilskolen_tidskodeArray_dame;
			vid.src = 'https://player.vimeo.com/external/353319855.sd.mp4?s=f5c5f3fc4c43b4d2303b5c145c79e2e2f3c859a7&profile_id=165';
			}
        break;
			} /*end switch*/
	
			document.getElementById('interactiveTranscript').style.visibility = "visible";
			document.getElementById('interaktivTxt').style.visibility = "visible";
			document.getElementById('txtCheckbox').style.visibility = "visible";
			document.getElementById('textCheck').style.visibility = "visible";
			insertTekst()			
			/*videoClickedWithTranscript()*/

}


// sunget med lalala
function CI_musikk_sanger_setSang_noTranscript(text){
	
	myCurrentSong = text;
	clearInterval(interval4PlayingEvent);
	interval4PlayingEventBool = false;
	document.getElementById('txtCheckbox').checked = true;
			
			switch(text) {
    	case 'javielsker':
			if (myStemme == "mann"){
			vid.src = 'https://player.vimeo.com/external/356614490.sd.mp4?s=a1baab0a89a518b0e40ed27d29bf3ae79aa07c6d&profile_id=165';
			}
			if (myStemme == "dame"){
			vid.src = 'https://player.vimeo.com/external/356639560.sd.mp4?s=4e94f08a443d0f20b6f081e68c2da781d95781f9&profile_id=164';
			}
        break;
			case 'mikkelrev':
			if (myStemme == "mann"){
			vid.src = 'https://player.vimeo.com/external/356614695.sd.mp4?s=16ac8a585ebbc9d40df3c087bfed052f6777adcf&profile_id=165';
			}
			if (myStemme == "dame"){
			vid.src = 'https://player.vimeo.com/external/356640544.sd.mp4?s=e21f17282e3c6a2873c994a25dde8e4f1ba3194d&profile_id=165';
			}
        break;
			case 'lillelam':
			if (myStemme == "mann"){
			vid.src = 'https://player.vimeo.com/external/356614403.sd.mp4?s=e06512ebe152a16661d7f430864b212568b6de07&profile_id=165';
			}
			if (myStemme == "dame"){
			vid.src = 'https://player.vimeo.com/external/356638798.sd.mp4?s=e34b7c4db9feaf1890218b9e16865751eab22d08&profile_id=165';
			}
        break;
			case 'kjaerlighetsvisa':
			if (myStemme == "mann"){
			vid.src = 'https://player.vimeo.com/external/356614592.sd.mp4?s=6895eae8c1acfac7ea7f2b2703872bbc4fe2ac9b&profile_id=165';
			}
			if (myStemme == "dame"){
			vid.src = 'https://player.vimeo.com/external/356640367.sd.mp4?s=9b113156b32ac9ce9d13fad1fcc5fc6ad799907b&profile_id=164';
			}
        break;
			case 'lysogvarme':
			if (myStemme == "mann"){
			vid.src = 'https://player.vimeo.com/external/356614661.sd.mp4?s=cb5656e495fddb4b956895109cf0de257f2bf0b1&profile_id=165';
			}
			if (myStemme == "dame"){
			vid.src = 'https://player.vimeo.com/external/356640518.sd.mp4?s=7fb5559c3a5a2c8241c66642ea32d1c221e99f29&profile_id=164';
			}
        break;
			case 'jegersaaglad':
			if (myStemme == "mann"){
			vid.src = 'https://player.vimeo.com/external/356617444.sd.mp4?s=e593ee83c453ca6d326e34f64ae752541e9608c2&profile_id=165';
			}
			if (myStemme == "dame"){
			vid.src = 'https://player.vimeo.com/external/356639597.sd.mp4?s=716b0c7b97e4d302171ca8828e766193d4de8687&profile_id=164';
			}
        break;
			case 'perspelmann':
			if (myStemme == "mann"){
			vid.src = 'https://player.vimeo.com/external/356614741.sd.mp4?s=e8b931791f680e07fc50af953f328248f1a7a288&profile_id=165';
			}
			if (myStemme == "dame"){
			vid.src = 'https://player.vimeo.com/external/356640855.sd.mp4?s=56e5d2758e4336b5e1da27086583999cef2912e2&profile_id=165';
			}
        break;
			case 'blaaballong':
			if (myStemme == "mann"){
			vid.src = 'https://player.vimeo.com/external/356614445.sd.mp4?s=58941a653ed618e62cfc7ca70164d3fa9821e3ff&profile_id=165';
			}
			if (myStemme == "dame"){
			vid.src = 'https://player.vimeo.com/external/356638838.sd.mp4?s=48cbb0590a5d61d9946085d573fa752a1e7a49a2&profile_id=164';
			}
        break;
			case 'lisagikktilskolen':
			if (myStemme == "mann"){
			vid.src = 'https://player.vimeo.com/external/356614635.sd.mp4?s=8a66dd5a4cb409dea8bf0655b5f4093ac9e9c1b8&profile_id=164';
			}
			if (myStemme == "dame"){
			vid.src = 'https://player.vimeo.com/external/356640410.sd.mp4?s=be32e310a5b6bd0bc3e2c589dd6b60d4b5cc9567&profile_id=164';
			}
        break;
					
			}
			document.getElementById('interactiveTranscript').style.visibility = "visible";
			document.getElementById('interaktivTxt').style.visibility = "hidden";
			document.getElementById('txtCheckbox').style.visibility = "hidden";
			document.getElementById('textCheck').style.visibility = "hidden";
			vid.style.visibility="visible";
			vid.load();
	
			/*videoClickedNoTranscript()*/	
}

function CI_musikk_sang_resetMarkering(){
	sangMenuElement = document.querySelectorAll("div.navSanger");
	for (var m = 0 ; m < sangMenuElement.length ; m++)  {
		sangMenuElement.item(m).style.backgroundColor = '#eaeaea' ;
	}
}

function CI_musikk_markselected(element){
	CI_musikk_sang_resetMarkering()
	document.getElementById('ID'+element).style.backgroundColor = ciColorBlue ;  
		
}

function runInstrumenterBtn(){
    			console.log('run dato')	
				clearInterval(interval4PlayingEvent);
				clearInterval(intervall4ClickEvent);
				interval4PlayingEventBool = false;
				document.location.hash = "instrumenter";
		}

