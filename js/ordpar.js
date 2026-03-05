/* ═══════════════════════════════════════════
   MODULE: ORDPAR (Word Pairs)
   ═══════════════════════════════════════════ */
const ORDPAR_DATA = [
  { name: "S + vokal", type: "-s-", data: [["søk","øk"],["sånn","ånd"],["si","i"],["sagn","agn"],["sår","år"],["sak","ak"],["selv","el"],["sand","and"],["sen","en"],["sær","er"],["sett","ett"],["som","om"],["sopp","opp"],["sunn","unn"],["søm","øm"],["sul","ul"],["selv","el"],["sør","ør"],["så","å"],["sull","ull"]] },
  { name: "Vokal + S", type: "s-", data: [["vis","vi"],["les","le"],["rus","ru"],["dis","di"],["meis","mei"],["ris","ri"],["los","lo"],["flis","fli"],["tøys","tøy"],["ros","ro"],["is","i"],["brus","bru"],["lås","lå"],["taus","tau"],["frøs","frø"],["vas","hva"],["dus","du"],["lys","ly"],["røys","røy"],["gås","gå"]] },
  { name: "N + vokal", type: "-n-", data: [["ni","i"],["narr","arr"],["nord","ord"],["nask","ask"],["nett","ett"],["natt","at"],["naust","aust"],["nek","ek"],["norm","orm"],["nål","ål"],["nes","es"],["nær","er"],["når","år"],["nekte","ekte"],["nikke","ikke"],["neie","eie"],["nese","ese"],["nære","ære"],["nøde","øde"],["nise","ise"]] },
  { name: "Vokal + N", type: "n-", data: [["han","ha"],["din","di"],["land","la"],["ren","re"],["min","mi"],["ran","ra"],["sin","si"],["syn","sy"],["grein","grei"],["vin","vi"],["brun","bru"],["svin","svi"],["dun","du"],["lyn","ly"],["bryn","bry"],["lån","lå"],["gryn","gry"],["gjøn","gjø"],["klin","kli"],["tren","tre"]] },
  { name: "S og N", type: "s-n-", data: [["sag","nag"],["si","ni"],["sær","nær"],["sett","nett"],["sår","når"],["sull","null"],["sal","nal"],["snegl","negl"],["sut","nut"],["så","nå"],["snek","nek"],["savn","navn"],["ses","nes"],["satt","natt"],["snor","nord"],["sy","ny"],["sei","nei"],["sot","not"],["Sam","nam"],["snakke","nakke"]] },
  { name: "T + vokal", type: "-t-", data: [["tatt","at"],["tau","au"],["tro","ro"],["ti","i"],["telt","elt"],["tarm","arm"],["tinn","inn"],["Tor","ord"],["tran","ran"],["tett","ett"],["trø","rød"],["trå","rå"],["tung","ung"],["tur","ur"],["tog","og"],["tyr","yr"],["tær","er"],["tøm","øm"],["tår","år"],["tøy","øy"]] },
  { name: "Vokal + T", type: "t-", data: [["feit","fei"],["hvit","vi"],["snøt","snø"],["lot","lo"],["leit","lei"],["lit","li"],["blått","blå"],["greit","grei"],["krot","kro"],["heit","hei"],["mot","mo"],["bløt","blø"],["rot","ro"],["flaut","flau"],["nyt","ny"],["skjøt","sjø"],["bot","bo"],["støt","stø"],["låt","lå"],["høyt","høy"]] },
  { name: "T og N", type: "t-n-", data: [["tatt","natt"],["ti","ni"],["tøff","nøff"],["tett","nett"],["Tor","nord"],["tål","nål"],["tær","nær"],["tår","når"],["tatt","natt"],["taust","naust"],["tøs","nøs"],["tese","nese"],["tikk","nikk"],["tam","nam"],["tupp","nupp"],["type","nype"],["tusse","nusse"],["tavle","navle"],["teppe","neppe"],["tappe","nappe"]] },
  { name: "S og T", type: "s-t-", data: [["sa","ta"],["si","ti"],["sand","tann"],["sær","tær"],["sett","tett"],["sår","tår"],["sopp","topp"],["salg","talg"],["sut","tut"],["sør","tør"],["sang","tang"],["sull","tull"],["søm","tøm"],["syr","tyr"],["saus","taus"],["sur","tur"],["sak","tak"],["synd","tynn"],["sau","tau"],["se","te"]] },
  { name: "D + vokal", type: "-d-", data: [["dis","is"],["dale","ale"],["dau","au"],["døv","øv"],["de","i"],["deg","ei"],["dør","ør"],["der","er"],["djerv","jerv"],["dum","om"],["dram","ram"],["drev","rev"],["dose","ose"],["dur","ur"],["dask","ask"],["dorm","orm"],["dyr","yr"],["datt","at"],["dum","om"],["drake","rake"]] },
  { name: "Vokal + D", type: "d-", data: [["bad","ba"],["leid","lei"],["syd","sy"],["flod","flo"],["rad","ra"],["sed","se"],["vad","hva"],["led","le"],["flid","fli"],["greid","grei"],["tid","ti"],["lad","la"],["rud","ru"],["eid","ei"],["bod","bo"],["bed","be"],["Aud","au"],["brud","bru"],["lyd","ly"],["råd","rå"]] },
  { name: "D og S", type: "d-s-", data: [["dag","sag"],["dus","sus"],["ditt","sitt"],["dal","sal"],["del","sel"],["dokk","sokk"],["din","sin"],["dau","sau"],["deg","seg"],["dur","sur"],["dør","sør"],["den","send"],["dyr","syr"],["dom","som"],["der","sær"],["døm","søm"],["dekk","sekk"],["dikt","sikt"],["dorg","sorg"],["døl","søl"]] },
  { name: "D og T", type: "d-t-", data: [["der","tær"],["di","ti"],["dam","tam"],["dull","tull"],["dør","tør"],["dor","Tor"],["døv","tøv"],["dal","tal"],["dau","tau"],["dur","tur"],["dyr","tyr"],["dom","tom"],["den","tenn"],["døm","tøm"],["diske","tiske"],["dunge","tunge"],["daske","taske"],["dikke","tikke"],["dette","tette"],["disse","tisse"]] },
  { name: "M + vokal", type: "-m-", data: [["matt","at"],["mor","or"],["mark","ark"],["mi","i"],["mel","el"],["mos","os"],["mann","and"],["mil","il"],["mai","ai"],["minn","inn"],["mei","ei"],["møy","øy"],["mørk","ørk"],["mal","al"],["marg","arg"],["mær","er"],["mane","ane"],["meie","eie"],["manke","anke"],["maske","aske"]] },
  { name: "P + vokal", type: "-p-", data: [["pil","il"],["park","ark"],["Pål","ål"],["pall","all"],["puff","uff"],["pass","ass"],["pen","en"],["pai","ai"],["pakt","akt"],["plast","last"],["prek","rek"],["plukk","lukk"],["pakk","akk"],["plag","lag"],["pris","ris"],["plass","lass"],["plei","lei"],["prim","rim"],["prek","rek"],["part","art"]] },
  { name: "P og M", type: "p-m-", data: [["park","mark"],["pan","man"],["popp","mopp"],["pilt","milt"],["pi","mi"],["patt","matt"],["på","må"],["pal","mal"],["pål","mål"],["pe","med"],["pest","mest"],["pott","mått"],["pus","mus"],["per","mer"],["pinn","minn"],["putt","mutt"],["pakt","makt"],["pilt","milt"],["pur","mur"],["pil","mil"]] },
  { name: "B + vokal", type: "-b-", data: [["bark","ark"],["bord","ord"],["båt","åt"],["bil","il"],["band","and"],["batt","at"],["bås","ås"],["bær","er"],["ball","all"],["ber","er"],["bind","inn"],["bår","år"],["bask","ask"],["belg","elg"],["bet","et"],["bi","i"],["bør","ør"],["bøy","øy"],["bau","au"],["belt","elt"]] },
  { name: "B og M", type: "b-m-", data: [["bett","mett"],["bask","mask"],["best","mest"],["bår","mår"],["batt","matt"],["bær","mær"],["be","med"],["bål","mål"],["by","my"],["bor","mor"],["bil","mil"],["bot","mot"],["bal","mal"],["be","me"],["bøy","møy"],["busk","musk"],["band","mann"],["bur","mur"],["bunk","munk"],["ber","mer"]] },
  { name: "B og P", type: "b-p-", data: [["bisk","pisk"],["bar","par"],["bil","pil"],["ball","pall"],["bytt","pytt"],["ber","Per"],["bind","pinn"],["be","pe"],["best","pest"],["bisk","pisk"],["bull","pull"],["bol","pol"],["bort","port"],["bark","park"],["bes","pes"],["bunn","pund"],["bart","part"],["bris","pris"],["bur","pur"],["bøs","pøs"]] },
  { name: "SJ + vokal", type: "-sj-", data: [["sjal","al"],["skyt","yt"],["sjakt","akt"],["skjegg","egg"],["sky","y"],["skinn","inn"],["sjarm","arm"],["sjark","ark"],["ski","i"],["sjask","ask"],["skei","ei"],["skjul","ul"],["skjelv","elv"],["skilt","ilt"],["sjøl","øl"],["sjau","au"],["sjakk","akk"],["skjær","er"],["skjør","ør"],["Sjur","ur"]] },
  { name: "S og SJ", type: "s-sj-", data: [["si","ski"],["sild","skill"],["sur","Sjur"],["sær","skjær"],["sel","sjel"],["sønn","skjønn"],["sopp","shop"],["sei","skei"],["sal","sjal"],["sør","skjør"],["sinn","skinn"],["sau","sjau"],["silt","skilt"],["send","skjenn"],["sakk","sjakk"],["sø","sjø"],["sagt","sjakt"],["så","sjå"],["sele","skjele"],["senke","skjenke"]] },
  { name: "B og D", type: "b-d-", data: [["bur","dur"],["bær","der"],["bra","dra"],["busk","dusk"],["bann","dann"],["bunk","dunk"],["Bill","dill"],["ball","dall"],["bytt","dytt"],["bau","dau"],["ber","der"],["besk","desk"],["bin","din"],["bæ","dæ"],["bår","dår"],["byr","dyr"],["bekk","dekk"],["bar","dar"],["bord","dor"],["band","dann"]] },
  { name: "B og G", type: "b-g-", data: [["be","ge"],["bast","gast"],["bang","gang"],["bla","glad"],["ble","gle"],["blod","glo"],["bli","gli"],["ba","ga"],["blø","glø"],["bra","gra"],["bo","god"],["brøt","grøt"],["bre","gre"],["brann","grann"],["bom","gom"],["bru","gru"],["bass","gass"],["bår","går"],["bakk","gakk"],["bal","gal"]] },
  { name: "B og V", type: "b-v-", data: [["be","ved"],["bil","hvil"],["Bill","vill"],["bar","var"],["båt","våt"],["bekk","vekk"],["band","vann"],["batt","vatt"],["båss","Voss"],["bær","vær"],["ball","vald"],["ber","ver"],["bin","vin"],["Bård","vår"],["bekk","vekk"],["bask","vask"],["best","vest"],["by","vy"],["belg","velg"],["bisk","visk"]] },
  { name: "D og G", type: "d-g-", data: [["dal","gal"],["drønn","grønn"],["datt","gatt"],["dra","gra"],["dått","gått"],["dram","gram"],["ditt","gitt"],["dår","går"],["dass","gass"],["dår","går"],["dull","gull"],["det","ge"],["diss","giss"],["dokk","gokk"],["dasse","gasse"],["dane","gane"],["dumme","gomme"],["dreie","greie"],["drue","grue"],["disse","gisse"]] },
  { name: "D og N", type: "d-n-", data: [["di","ni"],["dam","nam"],["do","no"],["du","nu"],["dæ","næ"],["då","nå"],["det","ned"],["dass","nass"],["datt","natt"],["dill","nill"],["der","nær"],["dusk","nusk"],["dytt","nytt"],["der","nær"],["dår","når"],["dor","nord"],["dal","nal"],["dett","nett"],["dull","null"],["dokk","nok"]] },
  { name: "E og Ø", type: "e-o-", data: [["selv","sølv"],["fler","flør"],["kjel","kjøl"],["send","sønn"],["ber","bør"],["lev","løv"],["kler","klør"],["lek","løk"],["med","mø"],["merke","mørke"],["neste","nøste"],["rester","røster"],["renne","rønne"],["tenne","tønne"],["gler","glør"],["mer","mør"],["stev","støv"],["ble","blø"],["spre","sprø"],["ser","sør"]] },
];

let ordparCurrentType = 0;

function initOrdpar() {
  S.mode.ordpar = 'lytte';
  const select = document.getElementById('ordpar-select');
  select.innerHTML = '';
  ORDPAR_DATA.forEach((t, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = t.name;
    if (i === ordparCurrentType) opt.selected = true;
    select.appendChild(opt);
  });
  renderOrdparTable();
}

function ordparSelectType(val) {
  ordparCurrentType = parseInt(val);
  resetExercise('ordpar');
  const pairDisplay = document.getElementById('pair-display');
  if (pairDisplay) pairDisplay.style.display = 'none';
  renderOrdparTable();
}

function renderOrdparTable() {
  const wrap = document.getElementById('ordpar-table-wrap');
  const data = ORDPAR_DATA[ordparCurrentType];
  let html = '<table class="ordpar-table">';
  data.data.forEach((pair, pairIdx) => {
    html += '<tr>';
    pair.forEach((word, wordIdx) => {
      html += `<td class="ordpar-word" onclick="ordparWordClick(${pairIdx},${wordIdx})">${word}</td>`;
    });
    html += '</tr>';
  });
  html += '</table>';
  wrap.innerHTML = html;
}

function ordparWordClick(pairIdx, wordIdx) {
  if ((S.mode.ordpar || 'lytte') === 'lytte') {
    const typePrefix = ORDPAR_DATA[ordparCurrentType].type;
    playAudio(`audio/ordpar/${S.voice}/${typePrefix}ord${pairIdx + 1}-${wordIdx + 1}.mp3`, 'ordpar');
    // Highlight clicked cell
    document.querySelectorAll('.ordpar-word.selected').forEach(c => c.classList.remove('selected'));
    const cells = document.querySelectorAll('.ordpar-table .ordpar-word');
    const idx = pairIdx * 2 + wordIdx;
    if (cells[idx]) cells[idx].classList.add('selected');
  }
}

function ordparStart() {
  const data = ORDPAR_DATA[ordparCurrentType];
  const ex = exercises.ordpar;
  if (!ex || ex.current === -1) {
    initExercise('ordpar', shuffle(Array.from({length: data.data.length}, (_, i) => i)), Math.min(20, data.data.length));
  }
  // Hide table in exercise mode
  document.getElementById('ordpar-table-wrap').style.display = 'none';
  ordparNext();
}

function ordparNext() {
  const ex = exercises.ordpar;
  if (ex.answered >= ex.total) {
    showResult('ordpar');
    resetExercise('ordpar');
    const pd = document.getElementById('pair-display');
    if (pd) pd.style.display = 'none';
    document.getElementById('ordpar-table-wrap').style.display = '';
    return;
  }

  const data = ORDPAR_DATA[ordparCurrentType];
  ex.current = ex.items[ex.answered];
  const pair = data.data[ex.current];
  ex.currentAnswer = Math.random() < 0.5 ? 0 : 1;

  renderProgress('ordpar');

  const display = document.getElementById('pair-display');
  display.style.display = 'flex';
  display.innerHTML = '';
  pair.forEach((word, i) => {
    const opt = document.createElement('div');
    opt.className = 'pair-option';
    opt.textContent = word;
    opt.addEventListener('click', () => ordparGuess(i));
    display.appendChild(opt);
  });

  const btn = document.getElementById('start-btn-ordpar');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-ordpar').disabled = false;

  // Play both words first, then the target word
  const typePrefix = ORDPAR_DATA[ordparCurrentType].type;
  const pairIdx = ex.current + 1;
  const answerIdx = ex.currentAnswer + 1;
  // Play word 1, then word 2, then the answer
  playAudio(`audio/ordpar/${S.voice}/${typePrefix}ord${pairIdx}-1.mp3`, 'ordpar', () => {
    setTimeout(() => {
      playAudio(`audio/ordpar/${S.voice}/${typePrefix}ord${pairIdx}-2.mp3`, 'ordpar', () => {
        setTimeout(() => {
          playAudio(`audio/ordpar/${S.voice}/${typePrefix}ord${pairIdx}-${answerIdx}.mp3`, 'ordpar');
        }, 400);
      });
    }, 400);
  });
}

function ordparRepeat() {
  const ex = exercises.ordpar;
  if (!ex || ex.current === -1) return;
  const typePrefix = ORDPAR_DATA[ordparCurrentType].type;
  const pairIdx = ex.current + 1;
  const answerIdx = ex.currentAnswer + 1;
  playAudio(`audio/ordpar/${S.voice}/${typePrefix}ord${pairIdx}-${answerIdx}.mp3`, 'ordpar');
}

function ordparGuess(chosenIdx) {
  const ex = exercises.ordpar;
  if (!ex || ex.currentAnswer === null) return;
  const opts = document.querySelectorAll('#pair-display .pair-option');
  const isCorrect = chosenIdx === ex.currentAnswer;
  opts[chosenIdx]?.classList.add(isCorrect ? 'correct-cell' : 'wrong-cell');
  if (!isCorrect) opts[ex.currentAnswer]?.classList.add('correct-cell');
  if (isCorrect) ex.correct++;
  ex.history.push(isCorrect);
  ex.answered++;
  ex.currentAnswer = null;
  renderProgress('ordpar');
  setTimeout(() => ordparNext(), 1200);
}
