/* ═══════════════════════════════════════════
   MODULE: SETNING (Sentences)
   ═══════════════════════════════════════════ */
const SETNING_DATA = {
  M: {
    words: ["mat", "musikk", "medisin", "melk", "mamma", "marsipan", "mygg", "m\u00f8te", "matpakke", "mel", "middag", "maleri"],
    audioFiles: ["mat", "musikk", "medisin", "melk", "mamma", "marsipan", "mygg", "mote", "matpakke", "mel", "middag", "maleri"],
    sentences: [
      ["Mat er godt.", "Jeg er glad i god mat.", "Det tar lang tid \u00e5 lage gourmetmat.", "Alle setter pris p\u00e5 god mat.", "Det er alltid hyggelig \u00e5 spise god mat sammen med andre."],
      ["Musikk er viktig.", "Jeg liker \u00e5 h\u00f8re p\u00e5 musikk.", "Musikk med god rytme er lettest \u00e5 h\u00f8re.", "Musikk gir meg en god f\u00f8lelse i kroppen.", "Jeg husker at jeg alltid likte musikk p\u00e5 skolen."],
      ["Jeg trenger medisin.", "Har du sett medisinen min?", "Jeg m\u00e5 g\u00e5 og hente ut medisin.", "P\u00e5 apoteket har de all mulig medisin.", "Du m\u00e5 ha med resept for \u00e5 hente ut medisin."],
      ["Jeg liker melk.", "Melk er sunt.", "Melken kommer fra kua.", "Melk finnes i mange varianter.", "Hvilken type melk liker du best?"],
      ["Mamma er best.", "Mamma er ikke hjemme.", "Jeg skal ringe mamma i morgen.", "Mamma er alltid der n\u00e5r jeg trenger henne.", "Man f\u00e5r ikke bli mamma om man ikke vet og kan ordne alt!"],
      ["Marsipan er godt.", "Marsipan er laget av mandler.", "Vi lager alltid marsipan til jul.", "Det er mange kalorier i marsipan.", "Marsipan finnes i mange forskjellige farger."],
      ["Mygg er plagsomt.", "Myggen biter.", "Om h\u00f8sten er det mye mygg.", "Stikk fra mygg gir mye kl\u00f8e.", "Noen reagerer allergisk p\u00e5 myggstikk."],
      ["Det er et viktig m\u00f8te.", "Alle sammen har g\u00e5tt p\u00e5 m\u00f8te.", "Hvem er det du skal p\u00e5 m\u00f8te sammen med?", "Er det mange m\u00f8ter i forbindelse med jobben din?", "Det tar ofte lang tid \u00e5 avvikle et m\u00f8te hvor det er mange personer."],
      ["Husk matpakken din!", "Har du sett matpakken min?", "Det var en veldig stor matpakke.", "Jeg har med matpakke p\u00e5 jobb hver dag.", "Matpakke er vanlig i Norge."],
      ["Mel gir oss br\u00f8d.", "Mel f\u00e5r vi fra korn.", "Sammalt mel er det sunneste.", "Det finnes mange forskjellige sorter mel.", "Mel er en viktig ingrediens i det norske kj\u00f8kken."],
      ["Middag er godt.", "Hva vil du ha til middag?", "Middag er et viktig m\u00e5ltid.", "Vi spiser alltid middag sammen i familien v\u00e5r.", "Vil du g\u00e5 ut p\u00e5 restaurant og spise middag sammen med meg?"],
      ["Jeg skal kj\u00f8pe et maleri.", "Utstillinga hadde mange malerier.", "Mona Lisa er et av verdens mest kjente malerier.", "Vil du se mitt nye maleri?", "Dette maleriet er veldig verdifullt."]
    ]
  },
  K: {
    words: ["katt", "kake", "kakao", "knapp", "kaffe", "kalender", "kald", "klokke", "kamera", "kopp", "komfyr", "kamerat"],
    audioFiles: ["katt", "kake", "kakao", "knapp", "kaffe", "kalender", "kald", "klokke", "kamera", "kopp", "komfyr", "kamerat"],
    sentences: [
      ["Katt er et husdyr.", "En katt liker melk.", "En katt er ikke lett \u00e5 temme.", "Det er mange barn som \u00f8nsker seg katt.", "I mange borettslag er det ikke lov til \u00e5 ha katt."],
      ["Kake er godt.", "Mange liker kake.", "Jeg synes bl\u00f8tkake er godt.", "De fleste serverer kake n\u00e5r det er bursdag.", "Mange barn \u00f8nsker \u00e5 ha sjokoladekake n\u00e5r de skal feire bursdag."],
      ["Kakao er godt.", "Kakao er turdrikke.", "Kakao laget av kokesjokolade er best.", "N\u00e5r vi g\u00e5r p\u00e5 tur om vinteren, er det godt \u00e5 ha med kakao.", "Mange synes at kakao med krem er en god drikke n\u00e5r det er kaldt."],
      ["En gul knapp.", "Jakker har knapper.", "I strikkejakker har vi mange knapper.", "Knapper finnes i mange ulike varianter.", "Sm\u00e5 barn strever ofte med \u00e5 kneppe igjen knapper i jakka si."],
      ["Kaffe med fl\u00f8te.", "Jeg liker svart kaffe.", "Det er godt med sjokolade til kaffen.", "Mange vil gjerne ha noe godt sammen med kaffen.", "Jeg tar gjerne en kopp kaffe til middag."],
      ["Kalender er greit \u00e5 ha.", "Jeg har en kalender.", "Jeg har krysset av dagen p\u00e5 min kalender.", "P\u00e5 min kalender er det en side for hver m\u00e5ned i \u00e5ret.", "Du kan lage din egen kalender med bilder du har tatt selv."],
      ["Kald drikke.", "Is er kaldt.", "Om vinteren blir jeg ofte kald.", "Jeg m\u00e5 ha p\u00e5 meg ullkl\u00e6r s\u00e5 jeg ikke blir kald.", "P\u00e5 koldtbord serveres det ofte b\u00e5de varm og kald mat."],
      ["En klokke viser tiden.", "Mange har klokke p\u00e5 veggen.", "N\u00e5r man har klokke, kan man passe tiden.", "I stedet for klokke bruker mange ungdommer mobilen.", "Mange kirker har klokker som spiller melodier til bestemte tider."],
      ["Jeg har et kamera.", "Med kameraet kan jeg ta bilder.", "Mange har mobil med et innebygd kamera.", "Jeg har kj\u00f8pt meg et helt nytt og fint digitalt kamera.", "Med mitt gamle kamera har jeg tatt mange fine bilder av barna mine."],
      ["En kopp kaffe.", "Kan jeg f\u00e5 en kopp te?", "Skal vi ta en kopp te sammen?", "En kopp kaffe og et stykke kake, takk!", "Det er hyggelig \u00e5 g\u00e5 p\u00e5 kaf\u00e9 og ta en kopp kaffe sammen."],
      ["Vi har komfyr p\u00e5 kj\u00f8kkenet.", "Vi koker mat p\u00e5 komfyren.", "En komfyr kan ha mange kokeplater.", "Vi bruker som regel komfyren n\u00e5r vi skal lage varm middag.", "I de fleste kj\u00f8kken st\u00e5r det en komfyr som ogs\u00e5 har stekeovn."],
      ["Jeg har en kamerat.", "En kamerat er god \u00e5 ha.", "Jeg har mange gode kamerater.", "Det er mange kamerater som drar p\u00e5 tur sammen.", "Det er moro \u00e5 v\u00e6re sammen en hel gjeng med gode kamerater."]
    ]
  },
  T: {
    words: ["tog", "TV", "telefon", "takk", "trafikk", "tannb\u00f8rste", "tre", "trimme", "terrasse", "tur", "tannkrem", "teater"],
    audioFiles: ["tog", "tv", "telefon", "takk", "trafikk", "tannborste", "tre", "trimme", "terrasse", "tur", "tannkrem", "teater"],
    sentences: [
      ["Der kommer et tog!", "Jeg liker \u00e5 reise med tog.", "Det er ingen sitteplasser ledig p\u00e5 toget.", "Toget er ofte forsinket om morgenen.", "Mange foretrekker \u00e5 reise med tog fremfor \u00e5 reise med fly."],
      ["Vi skal se p\u00e5 TV.", "Jeg skal se nyhetene p\u00e5 TV.", "Er det fint program p\u00e5 TVen i kveld?", "De spennende filmene p\u00e5 TV sendes sent p\u00e5 kvelden.", "Noen mener man blir sl\u00f8v av \u00e5 se for mye p\u00e5 TV."],
      ["Jeg venter en telefon.", "Han snakker i telefonen hele dagen.", "Jeg liker ikke \u00e5 snakke i telefon.", "Jeg holder kontakten med familie og venner gjennom telefonen.", "Det er irriterende \u00e5 bli vekket av en telefon n\u00e5r man sover middag."],
      ["Takk for mat!", "Jeg sier takk for all hjelp.", "Barna m\u00e5 l\u00e6re \u00e5 takke for maten.", "Takk for gaven jeg fikk til bursdagen min!", "Takk og pris for at du har kommet hjem i god behold!"],
      ["Det er mye trafikk.", "Det er lite trafikk der jeg bor.", "I helga er det stor trafikk ut av byen.", "Det er st\u00f8rst trafikk om morgenen og etter arbeidstid.", "P\u00e5 veier med stor trafikk er det ofte trafikkulykker."],
      ["Jeg har en myk tannb\u00f8rste.", "Noen liker tannb\u00f8rste med hard bust.", "Barna vil ha fargerike tannb\u00f8rster.", "Det er viktig \u00e5 skifte tannb\u00f8rste f\u00f8r den er utslitt.", "Jeg bruker tannb\u00f8rste og tannkrem morgen og kveld."],
      ["Jeg teller til tre!", "Vil du ha tre eller fire?", "Det st\u00e5r et vakkert tre i hagen.", "Barna klatrer i et stort tre med mange greiner.", "Husker du eventyret om \u00abDe tre bukkene Bruse\u00bb?"],
      ["Skal du trimme?", "Jeg liker \u00e5 trimme hver dag.", "Mange trimmer alt for lite.", "Hun trimmer tre ganger i uka med l\u00f8petur i skogen.", "Det krever selvdisiplin \u00e5 trimme regelmessig."],
      ["Huset har terrasse.", "Vi sitter p\u00e5 terrassen.", "Om sommeren spiser vi middag p\u00e5 terrassen.", "Vi skal bygge ny terrasse fordi den gamle er for liten.", "Det er hyggelig \u00e5 ha selskap p\u00e5 terrassen p\u00e5 varme sommerkvelder."],
      ["Vil du g\u00e5 tur?", "Ut p\u00e5 tur, aldri sur!", "Jeg gikk en lang tur i g\u00e5r.", "Han liker \u00e5 g\u00e5 p\u00e5 tur i ukjent terreng.", "\u00c5 g\u00e5 p\u00e5 tur i helgene gir avkopling, mosjon og helsegevinst."],
      ["Kj\u00f8p tannkrem!", "Puss tennene dine med tannkrem!", "Du f\u00e5r frisk pust med tannkrem.", "I butikken f\u00e5r man kj\u00f8pt mange typer tannkrem.", "Jeg bruker \u00e5 pusse tennene med tannkrem for \u00e5 unng\u00e5 hull i tennene."],
      ["Jeg liker teater.", "Byen har f\u00e5tt nytt teater.", "I kveld skal vi i teateret \u00e5 se en komedie.", "Teateret setter opp dramaer, komedier og musikaler.", "Det er vanskelig for unge skuespillere \u00e5 f\u00e5 ansettelse ved et teater."]
    ]
  },
  S: {
    words: ["sol", "smile", "syltet\u00f8y", "sko", "skole", "sitteplass", "sur", "spise", "spagetti", "sn\u00f8", "sulten", "sydentur"],
    audioFiles: ["sol", "smile", "syltetoy", "sko", "skole", "sitteplass", "sur", "spise", "spagetti", "sno", "sulten", "sydentur"],
    sentences: [
      ["Det er sol i dag.", "Det er godt n\u00e5r sola varmer.", "Det veksler mellom sol og regn.", "Pass p\u00e5 at du ikke f\u00e5r for mye sol.", "I ferien \u00f8nsker vi at det skal v\u00e6re sol hver eneste dag."],
      ["Kan du smile?", "Han smiler p\u00e5 bildet.", "Smil til verden og verden smiler til deg!", "Jeg smiler og hilser vennlig p\u00e5 naboene.", "Noen g\u00e5r p\u00e5 \u00absmilekurs\u00bb for \u00e5 l\u00e6re \u00e5 smile i jobben."],
      ["Syltet\u00f8y er godt.", "Send meg syltet\u00f8yet!", "Vil du ha syltet\u00f8y p\u00e5 br\u00f8dskiven?", "Jeg koker syltet\u00f8y av b\u00e6rene jeg har i hagen.", "For mye syltet\u00f8y kan gj\u00f8re skade p\u00e5 tennene."],
      ["Hun kj\u00f8per nye sko.", "Jeg har bare gamle sko.", "Hun har mange par sko i skapet.", "Barna vokser fort ut av skoene sine.", "Helene p\u00e5 de fine skoene var altfor h\u00f8ye og ikke gode \u00e5 g\u00e5 i."],
      ["Vi har ny skole.", "Alle barn skal g\u00e5 p\u00e5 skole.", "Det er viktig \u00e5 ha det bra p\u00e5 skolen.", "Det er mange flinke l\u00e6rere som underviser i skolen.", "Jeg har g\u00e5tt p\u00e5 mange skoler, men den beste skolen var barneskolen."],
      ["Jeg kj\u00f8per sitteplass.", "Dette er en god sitteplass.", "Sitteplassene p\u00e5 toget er nummerert.", "Det er for lite sitteplasser p\u00e5 bussen.", "Du m\u00e5 kj\u00f8pe sitteplass p\u00e5 toget hvis du ikke vil st\u00e5."],
      ["Du er sur.", "Jeg er aldri sur.", "Hvorfor er du s\u00e5 sur og sint?", "Han blir sur n\u00e5r han ikke f\u00e5r det som han vil.", "Hvis du er sur mot andre, blir du ikke m\u00f8tt med vennlighet."],
      ["Vi skal spise.", "Hva spiser du til middag?", "Vi skal spise p\u00e5 en fin restaurant.", "Vi m\u00e5 spise flere sm\u00e5 m\u00e5ltider hver dag.", "Mange mennesker i verden f\u00e5r ikke nok \u00e5 spise."],
      ["Barna er glad i spagetti.", "Vi skal ha spagetti til middag.", "Spagetti med kj\u00f8ttsaus er popul\u00e6rt.", "Det finnes mange oppskrifter med spagetti.", "Jeg blir lei av \u00e5 spise spagetti hvis jeg har det for ofte til middag."],
      ["Det er mye sn\u00f8.", "Det slutter ikke \u00e5 sn\u00f8.", "V\u00e6rmeldinga melder sn\u00f8 hele uka.", "Alle barn er glade n\u00e5r det sn\u00f8r for f\u00f8rste gang.", "I Norge har vi vinter med mye sn\u00f8 over nesten hele landet."],
      ["Jeg er sulten.", "Sulten gnager.", "Jeg er ikke sulten om morgenen.", "Etter den lange turen var alle veldig sultne.", "Mange barn g\u00e5r sultne til sengs fordi de har for lite mat."],
      ["Vi skal p\u00e5 sydentur.", "Jeg har bestilt sydentur.", "I sommerferien reiser vi p\u00e5 sydentur.", "Mange planlegger sydentur ett \u00e5r i forveien.", "Reisebyr\u00e5et anbefaler billige sydenturer utenom sesongen."]
    ]
  },
  L: {
    words: ["lys", "l\u00e6rer", "leppestift", "lat", "lue", "l\u00f8rdagskveld", "laks", "lampe", "lysp\u00e6re", "l\u00f8nn", "limstift", "lammel\u00e5r"],
    audioFiles: ["lys", "laerer", "leppestift", "lat", "lue", "lordagskveld", "laks", "lampe", "lyspaere", "lonn", "limstift", "lammelar"],
    sentences: [
      ["Sl\u00e5 p\u00e5 et lys.", "Det er for lite lys her.", "Du kan tenne et lys i kirken.", "Om sommeren er det lyst hele natten.", "Det er for lite lys om vinteren, men du kan kj\u00f8pe en dagslyslampe."],
      ["Jeg er l\u00e6rer.", "Hva heter l\u00e6reren din?", "Hvor kommer l\u00e6reren din fra?", "Hvor mange l\u00e6rere jobber p\u00e5 skolen?", "Jenta mi har skiftet l\u00e6rer hvert \u00e5r p\u00e5 ungdomsskolen."],
      ["R\u00f8d leppestift.", "Jeg trenger ny leppestift.", "Hun bruker leppestift hver dag.", "Jeg har kj\u00f8pt ny leppestift med en fin r\u00f8d farge.", "Mange velger \u00e5 bruke en leppepomade i stedet for leppestift."],
      ["Du er lat.", "Jeg er ikke lat.", "Jeg trenger en lat ferie.", "I min jobb kan en ikke v\u00e6re lat.", "Noen dager er latere enn andre dager."],
      ["Ta med deg en lue!", "Jeg m\u00e5 kj\u00f8pe meg ny lue.", "Jeg liker ikke \u00e5 g\u00e5 med lue.", "Jeg synes ullue er best \u00e5 bruke p\u00e5 fjellet.", "Jeg svetter alltid n\u00e5r jeg g\u00e5r p\u00e5 ski med lue."],
      ["L\u00f8rdagskveld er koselig.", "Hvor var du l\u00f8rdagskveld?", "Jeg gleder meg til neste l\u00f8rdagskveld.", "Det er alltid noe \u00e5 se p\u00e5 tv p\u00e5 en l\u00f8rdagskveld.", "Neste l\u00f8rdagskveld skal jeg ut p\u00e5 byen sammen med mine venner."],
      ["Laks er norsk.", "Jeg er glad i laks.", "Oppdrettslaks er fet fisk.", "Oppdrettslaks er den beste middagsmaten.", "Jeg lager ofte laks n\u00e5r jeg skal ha gjester."],
      ["En fin lampe.", "Kan du tenne lampen?", "Er det en lampebutikk i n\u00e6rheten?", "Vi trenger mer lys og m\u00e5 kj\u00f8pe nye lamper.", "Hvor mange lamper trenger vi for \u00e5 f\u00e5 godt leselys."],
      ["Kj\u00f8p en lysp\u00e6re!", "Har du en lysp\u00e6re?", "Jeg har alltid ekstra lysp\u00e6re i skapet.", "Lysp\u00e6rer finnes i mange styrker og st\u00f8rrelser.", "Du m\u00e5 huske \u00e5 skifte lysp\u00e6re i fj\u00f8set f\u00f8r det blir kveld."],
      ["L\u00f8nn er viktig.", "Jeg f\u00e5r l\u00f8nnen inn p\u00e5 konto.", "Den nye jobben har h\u00f8yere l\u00f8nn.", "H\u00f8y l\u00f8nn er viktig for veldig mange.", "Mange velger yrke etter hvor h\u00f8y l\u00f8nn det er."],
      ["Kj\u00f8p en limstift!", "Jeg finner ingen limstift.", "Jeg m\u00e5 ha med limstift p\u00e5 skolen i morgen.", "Jeg bruker limstift for \u00e5 feste bilder p\u00e5 takkekort.", "Limstifter t\u00f8rker fort ut, s\u00e5 det er ikke vits i \u00e5 kj\u00f8pe mange."],
      ["Lammel\u00e5r er godt.", "Jeg er veldig glad i lammel\u00e5r.", "Lammel\u00e5r er aller best n\u00e5r de er ferske.", "Lammel\u00e5r med r\u00f8dvin er skikkelig god festmat.", "Vegetarianere som ikke spiser lammel\u00e5r, g\u00e5r glipp av god mat."]
    ]
  },
  Mix: {
    words: ["jobb", "butikk", "br\u00f8dskive", "buss", "avis", "fotballkamp", "bil", "PC", "fjernkontroll", "sport", "gave", "bakgrunnst\u00f8y"],
    audioFiles: ["jobb", "butikk", "brodskive", "buss", "avis", "fotballkamp", "bil", "pc", "fjernkontroll", "sport", "gave", "bakgrunnsstoy"],
    sentences: [
      ["Jeg skal p\u00e5 jobb.", "Hvor jobber du?", "Jeg sykler alltid til jobb.", "Jeg har en spennende jobb.", "Jeg skal ikke p\u00e5 jobb i morgen."],
      ["Vi handler i butikk.", "Butikken er stengt.", "Skal du p\u00e5 butikken?", "I hvilken butikk har du kj\u00f8pt denne.", "Mange butikker er \u00e5pne til klokka 10 om kvelden."],
      ["Br\u00f8dskive er godt.", "Grov br\u00f8dskive er sunt.", "Hva har du p\u00e5 br\u00f8dskiva?", "Jeg spiser to br\u00f8dskiver til frokost.", "Jeg liker br\u00f8dskive med leverpostei og r\u00f8dbeter."],
      ["Skal du ta buss?", "Bussen er i rute.", "Hver helg g\u00e5r det nattbuss.", "Det g\u00e5r en buss hver halve time.", "Det er alltid fullt p\u00e5 bussen om morgenen."],
      ["Jeg leser avisen.", "Kj\u00f8per du avisen?", "Avisen kommer hver morgen.", "Jeg leser to aviser hver dag.", "Noen liker \u00e5 lese aviser p\u00e5 nett."],
      ["Det er fotballkamp p\u00e5 TV.", "Skal du se p\u00e5 fotballkampen?", "Det er alltid fotballkamp p\u00e5 TV.", "Er du interessert i \u00e5 se fotballkampen?", "Noen TV-kanaler sender fotballkamper hele d\u00f8gnet."],
      ["Jeg har ny bil.", "Hvor parkerte du bilen?", "Jeg liker \u00e5 kj\u00f8re bil.", "Bilen min har kj\u00f8rt ganske langt.", "Bilen min m\u00e5 snart p\u00e5 EU kontroll."],
      ["Jeg har ny PC.", "Jeg har b\u00e6rbar PC.", "Det er dyrt \u00e5 kj\u00f8pe ny PC.", "Jeg bruker ofte PC p\u00e5 jobben.", "Jeg har installert mange programmer p\u00e5 min PC."],
      ["Bruker du fjernkontroll?", "Hvor er fjernkontrollen?", "Jeg finner aldri fjernkontrollen.", "Jeg legger fra meg fjernkontrollen over alt.", "Vi m\u00e5 kj\u00f8pe nye batterier til fjernkontrollen."],
      ["Jeg elsker sport.", "Jeg ser alltid sporten.", "Driver du med sport?", "Hvilken sport liker du best?", "Jeg leser alltid sportssidene i avisen."],
      ["Jeg fikk den i gave.", "Jeg skal kj\u00f8pe en gave.", "Hva \u00f8nsker du deg i gave?", "Jeg har glemt gaven din.", "Hvor mange gaver fikk du til jul?"],
      ["Her er det bakgrunnst\u00f8y.", "Bakgrunnst\u00f8y plager meg.", "Jeg h\u00f8rer ikke stemmer i bakgrunnst\u00f8y.", "Jeg m\u00e5 munnavlese i bakgrunnst\u00f8y.", "I bakgrunnst\u00f8y er jeg avhengig av munnavlesning for \u00e5 oppfatte tale."]
    ]
  }
};

/* Tab labels for display */
const SETNING_TAB_LABELS = { M: 'M-ord', K: 'K-ord', T: 'T-ord', S: 'S-ord', L: 'L-ord', Mix: 'Mix' };

/* Column layout: indices for enstavelse, tostavelse, trestavelse */
const SETNING_COL_EN = [0, 3, 6, 9];    // 1-syllable words
const SETNING_COL_TO = [1, 4, 7, 10];   // 2-syllable words
const SETNING_COL_TRE = [2, 5, 8, 11];  // 3+ syllable words

let setningCurrentGroup = 'M';
let setningAudioType = 'setning'; // 'ord' or 'setning'
let setningCheckedLevels = [1, 2, 3, 4, 5]; // which sentence levels are enabled
let setningCurrentLevel = 1; // the level used for current exercise item

function initSetning() {
  S.mode.setning = 'lytte';
  renderSetningTabs();
  renderSetningGrid();
  setningRestoreLevelCheckboxes();
}

function renderSetningTabs() {
  const c = document.getElementById('setning-tabs');
  c.innerHTML = '';
  Object.keys(SETNING_DATA).forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (g === setningCurrentGroup ? ' active' : '');
    btn.textContent = SETNING_TAB_LABELS[g];
    btn.addEventListener('click', () => {
      c.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setningCurrentGroup = g;
      renderSetningGrid();
    });
    c.appendChild(btn);
  });
}

function setningRestoreLevelCheckboxes() {
  for (let i = 1; i <= 5; i++) {
    const cb = document.getElementById('setning-level-' + i);
    if (cb) cb.checked = setningCheckedLevels.includes(i);
  }
}

function setningToggleLevel(level, checked) {
  if (checked) {
    if (!setningCheckedLevels.includes(level)) setningCheckedLevels.push(level);
  } else {
    setningCheckedLevels = setningCheckedLevels.filter(l => l !== level);
  }
  // Ensure at least one level is checked
  if (setningCheckedLevels.length === 0) {
    setningCheckedLevels = [1];
    const cb = document.getElementById('setning-level-1');
    if (cb) cb.checked = true;
  }
  setningCheckedLevels.sort();
}

function setningSetAudioType(type) {
  setningAudioType = type;
  document.querySelectorAll('#setning-audio-type .pill-radio').forEach(r => {
    r.classList.toggle('active', r.dataset.type === type);
  });
}

function setningGetRandomLevel() {
  if (setningCheckedLevels.length === 0) return 1;
  return setningCheckedLevels[Math.floor(Math.random() * setningCheckedLevels.length)];
}

function renderSetningGrid() {
  const grid = document.getElementById('setning-grid');
  const data = SETNING_DATA[setningCurrentGroup];
  grid.innerHTML = '';

  // Column order: enstavelse, tostavelse, trestavelse
  const columns = [
    { label: 'enstavelse', indices: SETNING_COL_EN },
    { label: 'tostavelse', indices: SETNING_COL_TO },
    { label: 'trestavelse', indices: SETNING_COL_TRE }
  ];

  columns.forEach(col => {
    // Column header
    const header = document.createElement('div');
    header.className = 'setning-col-header';
    header.textContent = col.label;
    grid.appendChild(header);
  });

  // 4 rows
  for (let row = 0; row < 4; row++) {
    columns.forEach(col => {
      const wordIdx = col.indices[row];
      const card = document.createElement('div');
      card.className = 'setning-card';
      card.dataset.idx = wordIdx;

      const wordEl = document.createElement('div');
      wordEl.className = 'setning-card-word';
      wordEl.textContent = data.words[wordIdx];
      card.appendChild(wordEl);

      const sentList = document.createElement('div');
      sentList.className = 'setning-card-sentences';
      data.sentences[wordIdx].forEach((sent, si) => {
        const sentEl = document.createElement('div');
        sentEl.className = 'setning-card-sentence';
        sentEl.innerHTML = '<span class="setning-sent-num">' + (si + 1) + '</span><span class="setning-sent-text">' + sent + '</span>';
        sentList.appendChild(sentEl);
      });
      card.appendChild(sentList);

      card.addEventListener('click', () => setningCellClick(wordIdx));
      grid.appendChild(card);
    });
  }

  resetExercise('setning');
}

function setningCellClick(idx) {
  if ((S.mode.setning || 'lytte') === 'lytte') {
    setningPlayWord(idx);
    setningHighlightCard(idx);
  } else {
    setningGuess(idx);
  }
}

function setningPlayWord(idx) {
  const data = SETNING_DATA[setningCurrentGroup];
  if (setningAudioType === 'ord') {
    playAudio('audio/ord/' + S.voice + '/' + data.audioFiles[idx] + '.mp3', 'setning');
  } else {
    const level = setningGetRandomLevel();
    setningCurrentLevel = level;
    playAudio('audio/setning/' + S.voice + '/' + data.audioFiles[idx] + level + '.mp3', 'setning');
  }
}

function setningHighlightCard(idx) {
  document.querySelectorAll('#setning-grid .setning-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector('#setning-grid .setning-card[data-idx="' + idx + '"]');
  if (card) card.classList.add('selected');
}

function setningStart() {
  const data = SETNING_DATA[setningCurrentGroup];
  const ex = exercises.setning;
  if (!ex || ex.current === -1) {
    initExercise('setning', shuffle(Array.from({length: data.words.length}, (_, i) => i)), Math.min(12, data.words.length));
  }
  setningNext();
}

function setningNext() {
  const ex = exercises.setning;
  if (ex.answered >= ex.total) { showResult('setning'); resetExercise('setning'); return; }
  document.querySelectorAll('#setning-grid .setning-card').forEach(c => c.classList.remove('selected','correct-cell','wrong-cell','highlighted'));
  ex.current = ex.items[ex.answered];
  ex.currentAnswer = ex.current;
  setningCurrentLevel = setningGetRandomLevel();
  renderProgress('setning');
  const btn = document.getElementById('start-btn-setning');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-setning').disabled = false;
  document.getElementById('fasit-btn-setning').disabled = false;
  const data = SETNING_DATA[setningCurrentGroup];
  // In exercise mode always play sentence audio
  playAudio('audio/setning/' + S.voice + '/' + data.audioFiles[ex.current] + setningCurrentLevel + '.mp3', 'setning');
}

function setningRepeat() {
  const ex = exercises.setning;
  if (ex?.currentAnswer !== null) {
    const data = SETNING_DATA[setningCurrentGroup];
    playAudio('audio/setning/' + S.voice + '/' + data.audioFiles[ex.currentAnswer] + setningCurrentLevel + '.mp3', 'setning');
  }
}

function setningFasit() {
  const ex = exercises.setning;
  if (!ex || ex.currentAnswer === null) return;
  const card = document.querySelector('#setning-grid .setning-card[data-idx="' + ex.currentAnswer + '"]');
  if (card) card.classList.add('highlighted');
}

function setningGuess(idx) {
  const ex = exercises.setning;
  if (!ex || ex.currentAnswer === null) return;
  const clickedCard = document.querySelector('#setning-grid .setning-card[data-idx="' + idx + '"]');
  const correctCard = document.querySelector('#setning-grid .setning-card[data-idx="' + ex.currentAnswer + '"]');
  const isCorrect = idx === ex.currentAnswer;
  if (clickedCard) clickedCard.classList.add(isCorrect ? 'correct-cell' : 'wrong-cell');
  if (!isCorrect && correctCard) correctCard.classList.add('highlighted');
  if (isCorrect) ex.correct++;
  ex.history.push(isCorrect);
  ex.answered++;
  ex.currentAnswer = null;
  renderProgress('setning');
  setTimeout(() => setningNext(), 1200);
}
