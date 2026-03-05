// JavaScript Document
	 
/***************************************************************************************** INIT FUNC*/
function CI_instrumenter_init(){
	
	console.log('instrumenter init run')
	
	/************************  VARIABLE  ***************************************************** VAR START*/
	
	myModus = "lytte";
	myCurrentSong = "tom";
	myInstrument = "fiolin"
	mySang = "tom"
	ValgtSang = null;
	ValgtInstrument = null;
	firstClickSangLytte=false;
	
	aSanger = ["javielsker", "jegersaaglad", "mikkelrev", "perspelmann"]
	aInstrument = ["fiolin","gitar","piano","trompet"]
	
	/************************  VARIABLE  ***************************************************** VAR END*/
	
	CI_framework_hideOppgaveNav()
	CI_framework_clearAllSpeakers()
	CI_framework_aktiverAlleBokser(8,'navInstrument')
	CI_framework_DeAktiverMarkerModus(8,'instrument_check')
	CI_framework_turnoffInteraktivTranscript()
	
	document.getElementById('alleInstrumenter').style.visibility="hidden";
	document.getElementById('radioType').style.visibility="visible";
	
	checkButtonsSang= document.getElementsByName('nameSang');
	checkButtonsInstrument= document.getElementsByName('nameInstrument');
	
	for (j = 0; j<4; j++){
		checkButtonsSang[j].checked = false;
		checkButtonsInstrument[j].checked = false;
	}
	
	for (j = 0; j<2; j++){
		checkButtonsSang[j].checked = true;
		checkButtonsInstrument[j].checked = true;
	}
	
	
	vid.style.visibility = "visible";
	vid.style.opacity = 1;
	document.getElementById('vidCheckbox').checked = true;
	document.getElementById('videoCheck').style.visibility = "visible";
	document.getElementById('vidCheckbox').style.visibility = "visible";
	
	document.getElementById('btnMenu').focus();

}

/***************************************************************************************** END INIT FUNC*/


function CI_instrumenter_velgModus(){
	
	radioButtons = document.getElementsByName('modus');
	
	for (i = 0; i < radioButtons.length; i++) {
		if (radioButtons[i].checked == true) {
			myModus = radioButtons[i].value;
		}
	};
	
	CI_framework_clearAllSpeakers();
	CI_instrumenter_resetMarkering();
	
	if (myModus == "lytte"){
		
		firstClickSangLytte = false;
		mySang = "tom"
		CI_framework_hideOppgaveNav()
		CI_framework_clearAudioOppg()
		CI_framework_aktiverAlleBokser(8,'navInstrument')
		//CI_framework_nullstillFarge(8,'navInstrument')
		CI_framework_DeAktiverMarkerModus(8,'instrument_check') // boksene
		
		document.getElementById('alleInstrumenter').style.visibility="hidden";
		document.getElementById('radioType').style.visibility="visible";
		
		vid.style.visibility = "visible";
		vid.pause();
		vid.removeAttribute('src'); 
		document.getElementById('play-pause').style.visibility = "hidden";
		document.getElementById('interaktivTxt').style.visibility = "hidden";
		videoClickedNoTranscript()
	
	} else {
		CI_framework_startToStartBtn()
		
		document.getElementById('alleInstrumenter').style.visibility="visible";
		document.getElementById('radioType').style.visibility="hidden";

		CI_framework_InitOppgaveNav()
		CI_framework_showOppgaveNav()
		CI_framework_AktiverMarkerModus(8,'instrument_check') // boksene
		CI_framework_nullstill()
		
	vid.style.visibility = "hidden";
	vid.pause();
	vid.removeAttribute('src'); 
	document.getElementById('play-pause').style.visibility = "hidden";
	document.getElementById('videoCheck').style.visibility = "hidden";
	
		
	};
		 
	
}

/***************************************************************************************** VELG INSTRUMENT LYTTEMODUS*/

function CI_velgInstrument(instr){
	
	myInstrument = instr;
/*	console.log('firstClickSangLytte: '+firstClickSangLytte)
	console.log('myCurrentSong: '+myCurrentSong)*/
	
	if (firstClickSangLytte==true){
		myCurrentSong=mySang+"_"+myInstrument;
		CI_instrumenter_spillsang(myCurrentSong)
	}

}

/*********************************************************************************** END VELG INSTRUMENT LYTTEMODUS*/


/*Start/neste knappen kjøres*/
function CI_instrumenter_random() {
	
	
	CI_instrumenter_resetMarkering()
	CI_framework_activateGjentaButton()
	CI_framework_activateFasitButton()
	
	
	
	if (markerModus==true){
		//Oppgaven starter fra begynnelsen
	
		CI_instrumenter_nullstill()
		$("#nesteBtn").removeClass("blink");
		vid.style.visibility="visible";
		document.getElementById('play-pause').style.visibility = "visible";
		document.getElementById('videoCheck').style.visibility = "visible";
	    document.getElementById('vidCheckbox').style.visibility = "visible";
		
		CI_framework_deaktiverAlleBokser(8,'navInstrument')

		for (i = 0; i < aTabellSang.length; i++) {
			document.getElementsByClassName('navInstrument')[aTabellSang[i]].style.opacity="1.0";
			document.getElementsByClassName('navInstrument')[aTabellSang[i]].style.pointerEvents="auto";
		}
		
		for (i = 0; i < aTabellInstrument.length; i++) {
			document.getElementsByClassName('navInstrument')[aTabellInstrument[i]+4].style.opacity="1.0";
			document.getElementsByClassName('navInstrument')[aTabellInstrument[i]+4].style.pointerEvents="auto";
		}

		CI_framework_startToNesteBtn()
	}
	
	
	CI_framework_DeAktiverMarkerModus(8,'instrument_check') // boksene
	CI_framework_deactivateStartButton()
	
	if (oppgNr < antOppg){
		firstClickSang = false;
		firstClickInstrument = false;
		fasitKlikket = false;
		oppgNr = oppgNr + 1;
		
		//marker for orange - gjeldene oppgave
		
		document.getElementById('statCelle'+oppgNr).style.backgroundColor=ciColorYellow;
		
		randNrSang = Math.floor(Math.random() * aTabellSang.length);
		randNrInstrument = Math.floor(Math.random() * aTabellInstrument.length);
		
		
		RiktigSangNr = aTabellSang[randNrSang]+1
		RiktigInstrumentNr = aTabellInstrument[randNrInstrument]+1
		
		RiktigSang = aSanger[aTabellSang[randNrSang]]
		RiktigInstrument = aInstrument[aTabellInstrument[randNrInstrument]]
		
		console.log("spill sang: "+RiktigSang+"_"+RiktigInstrument)
		CI_instrumenter_spillsang(RiktigSang+"_"+RiktigInstrument)
	 }
}



/*En av de 4 sangknappene velges*/
function CI_instrumenter_velgSang(sang,nr){
	
	if (myModus == "lytte"){
		mySang = sang
		CI_instrumenter_markselected(sang)
		myCurrentSong=sang+"_"+myInstrument
		console.log('myCurrentSong: ' +myCurrentSong )
		firstClickSangLytte = true;
		CI_instrumenter_spillsang(myCurrentSong)
		
		
	}
	
	if (myModus == "ove" && markerModus==true){
		
		CI_instrumenter_nullstill()

	}
	
	
	if (myModus == "ove" && markerModus==false){
		
		CI_framework_deaktiverFasit()
		fasitKlikket = false;
		vid.pause();

		CI_instrumenter_resetMarkeringSang()
		
		ValgtSang = sang;
		
		if (ValgtSang == RiktigSang){
			
			document.getElementById('ID'+sang).style.backgroundColor=ciColorGreen;
			
			if (firstClickSang == false){
				
				if (firstClickInstrument == true){
					if (ValgtInstrument == RiktigInstrument){
						antRiktig = antRiktig + 1;
						document.getElementById('statCelle'+oppgNr).style.backgroundColor=ciColorGreen;
						document.getElementById('statCelle'+oppgNr).innerHTML = statCelleRiktig;
					} else {
						document.getElementById('statCelle'+oppgNr).style.backgroundColor=ciColorRed;
					document.getElementById('statCelle'+oppgNr).innerHTML = statCelleFeil;
					}
				}
			}
			
		} else {
			document.getElementById('ID'+sang).style.backgroundColor=ciColorRed;
			
			if (firstClickSang == false){
				if (firstClickInstrument == true){
					document.getElementById('statCelle'+oppgNr).style.backgroundColor=ciColorRed;
					document.getElementById('statCelle'+oppgNr).innerHTML = statCelleFeil;
				}
			}	
		}
			
			

		firstClickSang = true;
		
		if (oppgNr==20){
			if (firstClickSang == true && firstClickInstrument == true){
				CI_framework_showResultat()
				CI_framework_deactivateStartButton()
			}
		} else {
			if (firstClickSang == true && firstClickInstrument == true){
				CI_framework_activateStartButton()
			}
		}
		
		document.getElementById('respons').innerHTML="<strong>Resultat:</strong><br><br>Du fikk "+antRiktig+" riktige av "+oppgNr+" mulige";
		
	}
}
	

function CI_instrumenter_spillsang(sang){
	
	switch(sang) {
			
			/*FIOLIN*/
    		case 'javielsker_fiolin':
       		vid.src="https://player.vimeo.com/external/359034629.sd.mp4?s=856b06289e6e8def986266bf5cf20d79f1d72098&profile_id=164";
        break;
			case 'jegersaaglad_fiolin':
       		vid.src="https://player.vimeo.com/external/359035129.sd.mp4?s=efee759a52752e62fde8c13d7830648c17adca94&profile_id=165";
        break;
			case 'mikkelrev_fiolin':
       		vid.src="https://player.vimeo.com/external/359038228.sd.mp4?s=576f152216759acfae839d50713df2b7fa6dc151&profile_id=165";
        break;
			case 'perspelmann_fiolin':
       		vid.src="https://player.vimeo.com/external/359040738.sd.mp4?s=07a4bd52d7e8100f2285a800b2c10ba5dd9c26ab&profile_id=165";
        break;
			
				/*GITAR*/
    		case 'javielsker_gitar':
       		vid.src="https://player.vimeo.com/external/359034663.sd.mp4?s=1b8dda4106f5300ed65bbc721f2c1cf70d381bfe&profile_id=165";
        break;
			case 'jegersaaglad_gitar':
       		vid.src="https://player.vimeo.com/external/359035157.sd.mp4?s=d0d0087930ae0c6836f773af4d646b267318857c&profile_id=164";
        break;
			case 'mikkelrev_gitar':
       		vid.src="https://player.vimeo.com/external/359038277.sd.mp4?s=aad6e63d9b3bdf69c549bbf02be2f2d18c5a34e5&profile_id=165";
        break;
			case 'perspelmann_gitar':
       		vid.src="https://player.vimeo.com/external/359040761.sd.mp4?s=9ae4d8158e505817554b6493ab133968209da5a1&profile_id=165";
        break;
			
				/*PIANO*/
    		case 'javielsker_piano':
       		vid.src="https://player.vimeo.com/external/359034703.sd.mp4?s=9e50c6c705f8ddbf68e9cd3b60deceeecd17b71e&profile_id=164";
        break;
			case 'jegersaaglad_piano':
       		vid.src="https://player.vimeo.com/external/359035189.sd.mp4?s=cc820f8dccfb3ed8151217ee0359918a27248b79&profile_id=164";
        break;
			case 'mikkelrev_piano':
       		vid.src="https://player.vimeo.com/external/359038301.sd.mp4?s=63e77574ff1a1f927f63f27d59e0261299cb1fb6&profile_id=165";
        break;
			case 'perspelmann_piano':
       		vid.src="https://player.vimeo.com/external/359040788.sd.mp4?s=af83f6f48ed6b6de69ed3f2725bf93efb3cf0262&profile_id=164";
        break;
			
				/*TROMPET*/
    		case 'javielsker_trompet':
       		vid.src="https://player.vimeo.com/external/359034745.sd.mp4?s=73755dfd020a41146952fc72d4944fca346474e9&profile_id=165";
        break;
			case 'jegersaaglad_trompet':
       		vid.src="https://player.vimeo.com/external/359035227.sd.mp4?s=d770b7f254bb6a22c3dd08dfc9a012d362d8bbcb&profile_id=164";
        break;
			case 'mikkelrev_trompet':
       		vid.src="https://player.vimeo.com/external/359038335.sd.mp4?s=3828059ce0cb2d82bb678c400263fa4207ebaa2f&profile_id=164";
        break;
			case 'perspelmann_trompet':
       		vid.src="https://player.vimeo.com/external/359040809.sd.mp4?s=da127c10ddf41af4790703368557e9808901f1df&profile_id=164";
        break;
		
	}
	

	document.getElementById('play-pause').style.visibility = "visible";
	document.getElementById('videoCheck').style.visibility = "visible";
	document.getElementById('vidCheckbox').style.visibility = "visible";
	document.getElementById('interaktivTxt').style.visibility = "hidden";
	videoClickedNoTranscript()
	/*interval4PlayingEventBool = false;*/
   
	
}



/*En av de 4 instrumentknappene aktiveres*/
function CI_instrumenter_velgInstrument(instr,nr){
	
	
	
	if (myModus == "ove" && markerModus==true){
		
		CI_instrumenter_nullstill()
		
	}
	
	if (myModus == "ove" && markerModus==false){
		
		fasitKlikket = false;
		ValgtInstrument = instr;
		CI_instrumenter_resetMarkeringInstrument()
		vid.pause();
		

		
		CI_framework_deaktiverFasit()
		
		
		if (ValgtInstrument == RiktigInstrument){
			document.getElementById("ID"+instr).style.backgroundColor=ciColorGreen;
			
			if (firstClickInstrument == false){
				if (firstClickSang == true){
					if (ValgtSang == RiktigSang){
						antRiktig = antRiktig + 1;
						document.getElementById('statCelle'+oppgNr).style.backgroundColor=ciColorGreen;
						document.getElementById('statCelle'+oppgNr).innerHTML = statCelleRiktig;
					} else {
						document.getElementById('statCelle'+oppgNr).style.backgroundColor=ciColorRed;
						document.getElementById('statCelle'+oppgNr).innerHTML = statCelleFeil;
					}
				}
			}
			
		} else {
			document.getElementById("ID"+instr).style.backgroundColor=ciColorRed;
			
			if (firstClickInstrument == false){
				if (firstClickSang == true){
					document.getElementById('statCelle'+oppgNr).style.backgroundColor=ciColorRed;
					document.getElementById('statCelle'+oppgNr).innerHTML = statCelleFeil;
				}
			}	
		}
		
		firstClickInstrument = true;
		
		if (oppgNr==20){
			if (firstClickSang == true && firstClickInstrument == true){
				CI_framework_showResultat()
				CI_framework_deactivateStartButton()
			}
		} else {
			if (firstClickSang == true && firstClickInstrument == true){
				CI_framework_activateStartButton()
			}
		}
		
		
		document.getElementById('respons').innerHTML="<strong>Resultat:</strong><br><br>Du fikk "+antRiktig+" riktige av "+oppgNr+" mulige";
	}	
}



function CI_instrumenter_markselected(element){
	CI_instrumenter_resetMarkering()
	document.getElementById('ID'+element).style.backgroundColor = ciColorBlue ;  
		
}

function CI_instrumenter_resetMarkering(){
	sangMenuElement = document.querySelectorAll("div.navInstrument");
	for (var m = 0 ; m < sangMenuElement.length ; m++)  {
		sangMenuElement.item(m).style.backgroundColor = '#eaeaea' ;
	}
}

function CI_instrumenter_resetMarkeringSang(){
	sangMenuElement = document.querySelectorAll("div.navInstrument");
	for (var m = 0 ; m < 4 ; m++)  {
		sangMenuElement.item(m).style.backgroundColor = '#eaeaea' ;
	}
}

function CI_instrumenter_resetMarkeringInstrument(){
	sangMenuElement = document.querySelectorAll("div.navInstrument");
	for (var m = 4 ; m < sangMenuElement.length ; m++)  {
		sangMenuElement.item(m).style.backgroundColor = '#eaeaea' ;
	}
}

/*********************************************************************************** NULLSTILL*/
function CI_instrumenter_nullstill(){
	
	vid.pause();
	CI_instrumenter_lagNyTabell()
	oppgNr = 0;
		
	CI_instrumenter_resetMarkering()
	
	CI_framework_AktiverMarkerModus(8,'instrument_check')
	CI_framework_aktiverAlleBokser(8,'navInstrument')
	
	for (i = 0; i <8; i++) {
		document.getElementsByClassName('navInstrument')[i].style.cursor="default";
	}
	
	/*Sjekker om utvalg er gjort - slik at oppgave kan starte - START*/
	if (aTabellSang.length > 0 && aTabellInstrument.length > 0){
		CI_framework_activateStartButton()
		$("#nesteBtn").addClass("blink");
	} else {
		CI_framework_deactivateStartButton()
		$("#nesteBtn").removeClass("blink");
	}
	
	CI_framework_startToStartBtn()
	vid.pause();
	vid.style.visibility="hidden";
	document.getElementById('play-pause').style.visibility = "hidden";
	document.getElementById('videoCheck').style.visibility = "hidden";
	document.getElementById('vidCheckbox').style.visibility = "hidden";
	
}

function CI_instrumenter_gjenta(){
	console.log("gjenta sang: "+RiktigSang+"_"+RiktigInstrument)
	CI_instrumenter_spillsang(RiktigSang+"_"+RiktigInstrument)
}

function CI_instrumenter_klikkFasit(){
	
	fasitKlikket = true;
	CI_framework_FasitButtonClicked()
	
	document.getElementById('ID'+RiktigSang).style.backgroundColor = ciColorYellow;
	document.getElementById('ID'+RiktigInstrument).style.backgroundColor = ciColorYellow;
	
	if (firstClickSang == false || firstClickInstrument == false){
			document.getElementById('statCelle'+oppgNr).style.backgroundColor=ciColorOne; 
			document.getElementById('statCelle'+oppgNr).innerHTML = statCelleUlost;
	}
	
	firstClickSang = true;
	firstClickInstrument = true;
}


/****************************************************************************** END NULLSTILL*/

function CI_instrumenter_lagNyTabell(){
	
	aTabellSang=[];
	aTabellInstrument=[];
	
	checkButtonsSang = document.getElementsByName('nameSang');
	checkButtonsInstrument = document.getElementsByName('nameInstrument');
	
	for (i = 0; i < 4; i++) {
		if (checkButtonsSang[i].checked == true) {
			aTabellSang.push(i)
		}
		if (checkButtonsInstrument[i].checked == true) {
			aTabellInstrument.push(i)
		}
	}
	
	console.log("LagNyTabell: aTabellSang " + aTabellSang)
	console.log("LagNyTabell: aTabellInstrument " + aTabellInstrument)

}



/***************************************************************************************** VELG FANE*/

function runSangerBtn(){
    			console.log('run sanger')	
				document.location.hash = "sanger";
		}

/***************************************************************************************** END VELG FANE*/
