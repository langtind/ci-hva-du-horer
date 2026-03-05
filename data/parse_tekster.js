// Parse tekster_raw.js and produce structured JSON
const fs = require('fs');
const path = require('path');

const jsContent = fs.readFileSync(path.join(__dirname, 'tekster_raw.js'), 'utf8');
const htmlContent = fs.readFileSync(path.join(__dirname, 'tekster_raw.html'), 'utf8');
const sangerJs = fs.readFileSync(path.join(__dirname, 'sanger_raw.js'), 'utf8');
const instrumenterJs = fs.readFileSync(path.join(__dirname, 'instrumenter_raw.js'), 'utf8');
const sangerHtml = fs.readFileSync(path.join(__dirname, 'sanger_raw.html'), 'utf8');
const instrumenterHtml = fs.readFileSync(path.join(__dirname, 'instrumenter_raw.html'), 'utf8');

// Extract all setningsArrays and tidskodeArrays
function extractArrays(content) {
  const items = {};

  // Match setningsArray definitions
  const setningsRegex = /(\w+)_setningsArray\s*=\s*(\[[\s\S]*?\]);/g;
  let match;
  while ((match = setningsRegex.exec(content)) !== null) {
    const name = match[1];
    if (!items[name]) items[name] = {};
    try {
      items[name].sentences = eval(match[2]);
    } catch(e) {
      items[name].sentences = match[2];
    }
  }

  // Match tidskodeArray definitions (handle _mann and _dame variants too)
  const tidskodeRegex = /(\w+)_tidskodeArray(?:_(mann|dame))?\s*=\s*(\[[\s\S]*?\]);\s/g;
  while ((match = tidskodeRegex.exec(content)) !== null) {
    const name = match[1];
    const variant = match[2] || null;
    if (!items[name]) items[name] = {};
    try {
      const arr = eval(match[3]);
      if (variant) {
        if (!items[name].timecodes) items[name].timecodes = {};
        items[name].timecodes[variant] = arr;
      } else {
        items[name].timecodes = arr;
      }
    } catch(e) {
      if (variant) {
        if (!items[name].timecodes) items[name].timecodes = {};
        items[name].timecodes[variant] = match[3];
      } else {
        items[name].timecodes = match[3];
      }
    }
  }

  return items;
}

// Extract video URLs from switch statements
function extractVideoUrls(content) {
  const urls = {};
  const switchRegex = /case\s+'(\w+)':\s*[\s\S]*?vid\.src\s*=\s*'([^']+)'/g;
  let match;
  while ((match = switchRegex.exec(content)) !== null) {
    if (!urls[match[1]]) urls[match[1]] = {};
    urls[match[1]].videoUrl = match[2];
  }
  return urls;
}

// Extract video URLs with mann/dame variants for sanger
function extractSangerVideoUrls(content) {
  const urls = {};
  // Find the withTranscript function switch
  const withTranscriptMatch = content.match(/function CI_musikk_sanger_setSang_withTranscript[\s\S]*?end switch/);
  const noTranscriptMatch = content.match(/function CI_musikk_sanger_setSang_noTranscript[\s\S]*?end switch/);

  // Parse vid.src assignments with mann/dame context
  const blocks = content.split(/case\s+'/);
  for (const block of blocks) {
    const nameMatch = block.match(/^(\w+)':/);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    if (!urls[name]) urls[name] = { mann: {}, dame: {} };

    // Find mann vid.src
    const mannMatch = block.match(/myStemme\s*==\s*"mann"[\s\S]*?vid\.src\s*=\s*'([^']+)'/);
    if (mannMatch) urls[name].mann = mannMatch[1];

    // Find dame vid.src
    const dameMatch = block.match(/myStemme\s*==\s*"dame"[\s\S]*?vid\.src\s*=\s*'([^']+)'/);
    if (dameMatch) urls[name].dame = dameMatch[1];

    // Simple vid.src (no mann/dame)
    if (!mannMatch && !dameMatch) {
      const simpleMatch = block.match(/vid\.src\s*=\s*'([^']+)'/);
      if (simpleMatch) urls[name].url = simpleMatch[1];
    }
  }
  return urls;
}

// Extract thumbnail info from HTML
function extractThumbnailInfo(html) {
  const info = {};
  const figRegex = /setIneractiveTxt\('(\w+)'\)[\s\S]*?<img src="([^"]+)"[\s\S]*?<figcaption[^>]*>([\s\S]*?)<\/figcaption>/g;
  let match;
  while ((match = figRegex.exec(html)) !== null) {
    const name = match[1];
    const thumb = match[2];
    const caption = match[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    info[name] = { thumbnail: thumb, caption };
  }
  return info;
}

// Get container info (which div contains which items)
function extractContainerItems(html) {
  const containers = {};
  const divRegex = /id="(\w+)"\s+class="thumbContainer">([\s\S]*?)<\/div>/g;
  let match;
  while ((match = divRegex.exec(html)) !== null) {
    const containerId = match[1];
    const content = match[2];
    const items = [];
    const itemRegex = /setIneractiveTxt\('(\w+)'\)/g;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(content)) !== null) {
      items.push(itemMatch[1]);
    }
    containers[containerId] = items;
  }
  return containers;
}

// Parse tekster
const teksterArrays = extractArrays(jsContent);
const teksterUrls = extractVideoUrls(jsContent);
const teksterThumbs = extractThumbnailInfo(htmlContent);
const teksterContainers = extractContainerItems(htmlContent);

// Build the structured tekster data
function buildTeksterItem(id, type, region, language, speaker) {
  const data = teksterArrays[id] || {};
  const url = teksterUrls[id]?.videoUrl || null;
  const thumb = teksterThumbs[id] || {};

  // Extract vimeo ID from URL
  let vimeoId = null;
  if (url) {
    const m = url.match(/external\/(\d+)\./);
    if (m) vimeoId = m[1];
  }

  return {
    id,
    title: thumb.caption || id,
    type,
    region,
    language,
    vimeoId,
    videoUrl: url,
    thumbnail: thumb.thumbnail || null,
    sentences: data.sentences || [],
    timecodes: data.timecodes || []
  };
}

const result = {
  tekster: {
    categories: [
      {
        speaker: "dame",
        label: "Damestemme",
        subcategories: [
          {
            type: "fortelling",
            label: "Fortellinger",
            items: [
              buildTeksterItem("gullhaar", "fortelling", "Oslo", "bokmaal", "dame"),
              buildTeksterItem("ulveslaget", "fortelling", "Oslo", "bokmaal", "dame"),
              buildTeksterItem("pannekaka", "fortelling", "Vestlandet", "nynorsk", "dame"),
            ]
          },
          {
            type: "vits",
            label: "Vitser",
            regions: [
              {
                region: "Oslo",
                language: "bokmaal",
                items: [
                  buildTeksterItem("hardugulroetter", "vits", "Oslo", "bokmaal", "dame"),
                  buildTeksterItem("boennhoerelse", "vits", "Oslo", "bokmaal", "dame"),
                  buildTeksterItem("flinkforretningsmann", "vits", "Oslo", "bokmaal", "dame"),
                ]
              },
              {
                region: "Vestlandet",
                language: "nynorsk",
                items: [
                  buildTeksterItem("vandrepokal", "vits", "Vestlandet", "nynorsk", "dame"),
                  buildTeksterItem("fotballkamp", "vits", "Vestlandet", "nynorsk", "dame"),
                  buildTeksterItem("psykologar", "vits", "Vestlandet", "nynorsk", "dame"),
                  buildTeksterItem("legevitenskapen", "vits", "Vestlandet", "nynorsk", "dame"),
                  buildTeksterItem("ukjentsoldat", "vits", "Vestlandet", "nynorsk", "dame"),
                  buildTeksterItem("heidertilavdoede", "vits", "Vestlandet", "nynorsk", "dame"),
                ]
              },
              {
                region: "Nord-Norge",
                language: "nynorsk",
                items: [
                  buildTeksterItem("svoemmeren", "vits", "Nordland", "nynorsk", "dame"),
                  buildTeksterItem("aftenboenn", "vits", "Tromsoe", "nynorsk", "dame"),
                  buildTeksterItem("oljedebatten", "vits", "Tromsoe", "nynorsk", "dame"),
                  buildTeksterItem("pensjonisttilvaerelsen", "vits", "Tromsoe", "nynorsk", "dame"),
                  buildTeksterItem("tomatene", "vits", "Tromsoe", "nynorsk", "dame"),
                  buildTeksterItem("elgjakt", "vits", "Helgeland", "nynorsk", "dame"),
                  buildTeksterItem("minbaat", "vits", "Helgeland", "nynorsk", "dame"),
                  buildTeksterItem("utenbedoevelse", "vits", "Helgeland", "nynorsk", "dame"),
                ]
              },
              {
                region: "Stavanger og Soerlandet",
                language: "nynorsk",
                items: [
                  buildTeksterItem("filosofi", "vits", "Stavanger", "nynorsk", "dame"),
                  buildTeksterItem("turistnaeringa", "vits", "Stavanger", "nynorsk", "dame"),
                  buildTeksterItem("kjettingen", "vits", "Soerlandet", "nynorsk", "dame"),
                  buildTeksterItem("litenbil", "vits", "Soerlandet", "nynorsk", "dame"),
                  buildTeksterItem("snoemaaking", "vits", "Soerlandet", "nynorsk", "dame"),
                  buildTeksterItem("daarligvei", "vits", "Soerlandet", "nynorsk", "dame"),
                ]
              }
            ]
          },
          {
            type: "saktekst",
            label: "Saktekster",
            regions: [
              {
                region: "Bokmaal",
                language: "bokmaal",
                items: [
                  buildTeksterItem("bordercollie", "saktekst", "Oslo", "bokmaal", "dame"),
                  buildTeksterItem("kunstigoeye", "saktekst", "Oslo", "bokmaal", "dame"),
                  buildTeksterItem("navleloensgaate", "saktekst", "Oslo", "bokmaal", "dame"),
                  buildTeksterItem("sivertsensmith", "saktekst", "Oslo", "bokmaal", "dame"),
                ]
              },
              {
                region: "Nynorsk",
                language: "nynorsk",
                items: [
                  buildTeksterItem("hund", "saktekst", "Vestlandet", "nynorsk", "dame"),
                  buildTeksterItem("atlanterhavsvegen", "saktekst", "Vestlandet", "nynorsk", "dame"),
                  buildTeksterItem("smaaviltjakt", "saktekst", "Vestlandet", "nynorsk", "dame"),
                ]
              },
              {
                region: "Forskjellige dialekter",
                language: "dialekt",
                items: [
                  buildTeksterItem("kristiansund", "saktekst", "Nordmoere", "dialekt", "dame"),
                  buildTeksterItem("tromsoe", "saktekst", "Tromsoe", "dialekt", "dame"),
                  buildTeksterItem("musikkutdannelse", "saktekst", "Tromsoe", "dialekt", "dame"),
                  buildTeksterItem("utaafly", "saktekst", "Troendelag", "dialekt", "dame"),
                  buildTeksterItem("kniksen", "saktekst", "Bergen", "dialekt", "dame"),
                  buildTeksterItem("sikkerhetpaafly", "saktekst", "bare lyd", "bokmaal", "dame"),
                ]
              }
            ]
          },
          {
            type: "dialog",
            label: "Dialoger",
            items: [
              buildTeksterItem("uteogtriller", "dialog", "Oest-Norge og Troendelag", "dialekt", "dame"),
              buildTeksterItem("heimbygd", "dialog", "Hardanger og Nordfjord", "dialekt", "dame"),
              buildTeksterItem("eple", "dialog", "Hardanger og Nordfjord", "dialekt", "dame"),
            ]
          },
          {
            type: "dikt",
            label: "Dikt",
            items: [
              buildTeksterItem("treetstodferdig", "dikt", "Oslo", "bokmaal", "dame"),
              buildTeksterItem("allemineklaer", "dikt", "Oslo", "bokmaal", "dame"),
            ]
          }
        ]
      },
      {
        speaker: "mann",
        label: "Mannestemme",
        subcategories: [
          {
            type: "fortelling",
            label: "Fortellinger",
            items: [
              buildTeksterItem("bjellepaakatten", "fortelling", "Oslo", "bokmaal", "mann"),
              buildTeksterItem("hvorforbjoernenharkorthale", "fortelling", "Oslo", "bokmaal", "mann"),
            ]
          },
          {
            type: "vits",
            label: "Vitser",
            items: [
              buildTeksterItem("verdenseldsteyrke", "vits", "Oest-Norge", "bokmaal", "mann"),
              buildTeksterItem("fotballspillere", "vits", "Troendelag", "dialekt", "mann"),
              buildTeksterItem("storfisk", "vits", "Troendelag", "dialekt", "mann"),
              buildTeksterItem("harenogskilpadda", "vits", "Troendelag", "dialekt", "mann"),
              buildTeksterItem("roedioeynene", "vits", "Stavanger", "dialekt", "mann"),
              buildTeksterItem("edderkoppisuppa", "vits", "Stavanger", "dialekt", "mann"),
            ]
          },
          {
            type: "saktekst",
            label: "Saktekster",
            items: [
              buildTeksterItem("paasketur", "saktekst", "Oslo", "bokmaal", "mann"),
              buildTeksterItem("hoerselshemmetidentitet", "saktekst", "Oslo", "bokmaal", "mann"),
              buildTeksterItem("infomotsluttenavreisen", "saktekst", "Oslo", "bokmaal", "mann"),
            ]
          }
        ]
      },
      {
        speaker: "barn",
        label: "Barnestemme",
        subcategories: [
          {
            type: "vits",
            label: "Vits",
            items: [
              buildTeksterItem("golvklokka", "vits", "Oslo", "bokmaal", "barn"),
            ]
          },
          {
            type: "dialog",
            label: "Dialog",
            items: [
              buildTeksterItem("teaterlagetiBUL", "dialog", "Troendelag", "dialekt", "barn"),
            ]
          }
        ]
      }
    ]
  },
  musikk: {
    sanger: {
      description: "Songs module - users can listen or practice identifying songs. Each song has mann (male) and dame (female) voice versions, plus 'med tekst' (with lyrics) and 'la la la' (without lyrics) variants.",
      songs: [
        {
          id: "javielsker",
          title: "Ja, vi elsker dette landet",
          sentences: ["Ja, vi elsker dette landet\n som det stiger frem\n", "furet, v\u00e6rbitt over vannet,\n med de tusen hjem.\n","Elsker, elsker det og tenker\n p\u00e5 v\u00e5r far og mor\n","og den saganatt som senker\n dr\u00f8mme p\u00e5 v\u00e5r jord.\n","Og den saganatt som senker,\n senker dr\u00f8mme p\u00e5 v\u00e5r jord."],
          timecodes: {
            mann: [[0.0, 9.1], [9.2, 18.2], [18.3, 27.8], [27.9, 37.0], [37.1, 48.2]],
            dame: [[0.9, 12.9], [13.0, 24.2], [24.3, 34.9], [35.0, 47.0], [47.1, 60.3]]
          },
          videoUrls: {
            tekst_mann: "https://player.vimeo.com/external/352689832.sd.mp4?s=cafa2d9c60fb36f9158e37d24ab53b9a8078278f&profile_id=165",
            tekst_dame: "https://player.vimeo.com/external/353305408.sd.mp4?s=1b4fd88d3f6f7c0cac52e30d6d5a282d32ceff30&profile_id=165",
            lalala_mann: "https://player.vimeo.com/external/356614490.sd.mp4?s=a1baab0a89a518b0e40ed27d29bf3ae79aa07c6d&profile_id=165",
            lalala_dame: "https://player.vimeo.com/external/356639560.sd.mp4?s=4e94f08a443d0f20b6f081e68c2da781d95781f9&profile_id=164"
          }
        },
        {
          id: "jegersaaglad",
          title: "Jeg er s\u00e5 glad hver julekveld",
          sentences: ["Jeg er s\u00e5 glad hver julekveld,\n","for da ble Jesus f\u00f8dt;\n","da lyste stjernen som en sol\n","og engler sang s\u00e5 s\u00f8tt."],
          timecodes: {
            mann: [[0.0, 4.7], [4.8, 9.8], [9.9, 15.2], [15.3, 20.2]],
            dame: [[1.3, 7.2], [7.3, 13.0], [13.1, 19.6], [19.7, 26.5]]
          },
          videoUrls: {
            tekst_mann: "https://player.vimeo.com/external/352689868.sd.mp4?s=8ac6203f939e5c4458aa00d0dda89265863e910d&profile_id=164",
            tekst_dame: "https://player.vimeo.com/external/353305422.sd.mp4?s=d23e5cfe123caf107b2ae6f13bb99354774bbd32&profile_id=165",
            lalala_mann: "https://player.vimeo.com/external/356617444.sd.mp4?s=e593ee83c453ca6d326e34f64ae752541e9608c2&profile_id=165",
            lalala_dame: "https://player.vimeo.com/external/356639597.sd.mp4?s=716b0c7b97e4d302171ca8828e766193d4de8687&profile_id=164"
          }
        },
        {
          id: "mikkelrev",
          title: "Mikkel Rev",
          sentences: ["Mikkel Rev satt og skrev,\n p\u00e5 ei lita tavle.\n", "Tavla sprakk. Mikkel skvatt\n oppi pappas flosshatt\n\n","Mikkel Rev skrev et brev,\n sendte det til m\u00e5nen.\n"," M\u00e5nen sa: Hipp hurra!\n Sendte det til Afrika.\n\n","Afrika, Afrika\n ville ikke ha det.\n","Afrika, Afrika\n sendte det tilbake\n","med ei bl\u00f8tekake."],
          timecodes: {
            mann: [[0.0, 6.0], [6.1, 12.5], [12.6, 19.5], [19.6, 26], [26.1, 33], [33.1, 39], [39.1, 45]],
            dame: [[1.0, 10.2], [10.3, 20.1], [20.2, 29.5], [29.6, 39.1], [39.2, 47.7], [47.8, 56.7], [56.8, 62.6]]
          },
          videoUrls: {
            tekst_mann: "https://player.vimeo.com/external/352689976.sd.mp4?s=fc479bf916a0ff6b88e4613eae8b92cc4f862515&profile_id=165",
            tekst_dame: "https://player.vimeo.com/external/353305489.sd.mp4?s=b3a1821d3e52dd25e48dfe744b9e583e37cdf71b&profile_id=165",
            lalala_mann: "https://player.vimeo.com/external/356614695.sd.mp4?s=16ac8a585ebbc9d40df3c087bfed052f6777adcf&profile_id=165",
            lalala_dame: "https://player.vimeo.com/external/356640544.sd.mp4?s=e21f17282e3c6a2873c994a25dde8e4f1ba3194d&profile_id=165"
          }
        },
        {
          id: "perspelmann",
          title: "Per Spelmann",
          sentences: ["Per Spelmann, han hadde ei einaste ku.\n","Per Spelmann, han hadde ei einaste ku.\n","Han bytte bort kua, fekk fela igjen.\n","Han bytte bort kua, fekk fela igjen.\n","\"Du gamle, gode fiolin, du fiolin, du fela mi!\""],
          timecodes: {
            mann: [[0.0, 5.2], [5.3, 9.9], [10.0, 15.5], [15.6, 20.1], [20.2, 29.0]],
            dame: [[0.9, 6.8], [6.9, 12.9], [13.0, 18.6], [18.7, 24.3], [24.4, 35.0]]
          },
          videoUrls: {
            tekst_mann: "https://player.vimeo.com/external/352690017.sd.mp4?s=a69f502fc54d98e34c57b2fdba9f7c4c47f1de01&profile_id=164",
            tekst_dame: "https://player.vimeo.com/external/353305503.sd.mp4?s=702f11f43ea1a2adf5e83274dd24cc1af5650441&profile_id=165",
            lalala_mann: "https://player.vimeo.com/external/356614741.sd.mp4?s=e8b931791f680e07fc50af953f328248f1a7a288&profile_id=165",
            lalala_dame: "https://player.vimeo.com/external/356640855.sd.mp4?s=56e5d2758e4336b5e1da27086583999cef2912e2&profile_id=165"
          }
        },
        {
          id: "lillelam",
          title: "B\u00e6 b\u00e6 lille lam",
          sentences: ["B\u00e6, b\u00e6, lille lam,\n har du noe ull?\n","Ja, ja, kj\u00e6re barn,\n jeg har kroppen full.\n"," S\u00f8ndagskl\u00e6r til far,\n og s\u00f8ndagskl\u00e6r til mor,\n","og to par str\u00f8mper\n til bitte lille bror."],
          timecodes: {
            mann: [[0.0, 5.4], [5.5, 11.4], [11.5, 16.9], [17.0, 24.8]],
            dame: [[0.9, 8.2], [8.3, 15.8], [15.9, 22.8], [22.9, 32.1]]
          },
          videoUrls: {
            tekst_mann: "https://player.vimeo.com/external/352689764.sd.mp4?s=10c107d063b599b0786d730be7b27f7bbf7869c8&profile_id=165",
            tekst_dame: "https://player.vimeo.com/external/353305383.sd.mp4?s=7c89a999e8f61fc4e971c1390202cec1b41d28d8&profile_id=165",
            lalala_mann: "https://player.vimeo.com/external/356614403.sd.mp4?s=e06512ebe152a16661d7f430864b212568b6de07&profile_id=165",
            lalala_dame: "https://player.vimeo.com/external/356638798.sd.mp4?s=e34b7c4db9feaf1890218b9e16865751eab22d08&profile_id=165"
          }
        },
        {
          id: "blaaballong",
          title: "Jeg vil ha en bl\u00e5 ballong",
          sentences: ["Jeg vil ha en bl\u00e5 ballong,\n","en s\u00e5nn der en fin ballong.\n","En med hatt og nese p\u00e5,\n", "og den skal v\u00e6re bl\u00e5.\n","Den skal v\u00e6re flott og dyr,\n","nesten som et eventyr,\n","flyve som et riktig fly\n","og stige h\u00f8yt i sky."],
          timecodes: {
            mann: [[0.0, 4.0], [4.1, 8.3], [8.4, 12.2], [12.3, 15.7], [15.8, 20.0], [20.1, 24.1], [24.2, 28.0], [28.1, 31.7]],
            dame: [[0.9, 4.8], [4.9, 9.2], [9.3, 12.8], [12.9, 16.7], [16.8, 20.4], [20.5, 24.4], [24.5, 28.0], [28.1, 32.0]]
          },
          videoUrls: {
            tekst_mann: "https://player.vimeo.com/external/352689796.sd.mp4?s=28ff1e3ae449160c870afa3fe0598026f98426d8&profile_id=165",
            tekst_dame: "https://player.vimeo.com/external/353305397.sd.mp4?s=6d4989a8c38fac6d127fec8846c826b147971e13&profile_id=165",
            lalala_mann: "https://player.vimeo.com/external/356614445.sd.mp4?s=58941a653ed618e62cfc7ca70164d3fa9821e3ff&profile_id=165",
            lalala_dame: "https://player.vimeo.com/external/356638838.sd.mp4?s=48cbb0590a5d61d9946085d573fa752a1e7a49a2&profile_id=164"
          }
        },
        {
          id: "kjaerlighetsvisa",
          title: "Kj\u00e6rlighetsvisa",
          sentences: ["N\u00e5r sommardagen ligg utover landet\n","og du og \u00e6 har funne oss ei strand\n","og fire kalde pils ligg nedi vannet\n","og vi e brun og fin og hand i hand,\n","n\u00e5r vi har prata om ei bok vi lika\n","og alt e bra og ikkje te \u00e5 tru:\n","Ingen e s\u00e5 god som du, da.\n","Ingen e s\u00e5 god som du."],
          timecodes: {
            mann: [[0.0, 5.0], [5.1, 10.6], [10.7, 15.8], [15.9, 20.7], [20.8, 26.3], [26.4, 31.8], [31.9, 37.0], [37.1, 42.2]],
            dame: [[1.3, 7.7], [7.8, 13.7], [13.8, 20.1], [20.2, 26.1], [26.2, 32.8], [32.9, 39.1], [39.2, 45.7], [45.8, 52.5]]
          },
          videoUrls: {
            tekst_mann: "https://player.vimeo.com/external/352689895.sd.mp4?s=bac235717244a5d4873609d15f3cfda661eb2a1e&profile_id=164",
            tekst_dame: "https://player.vimeo.com/external/353305441.sd.mp4?s=e1d4d3176b49f2c977ee3ff3503c57b2df555e7b&profile_id=165",
            lalala_mann: "https://player.vimeo.com/external/356614592.sd.mp4?s=6895eae8c1acfac7ea7f2b2703872bbc4fe2ac9b&profile_id=165",
            lalala_dame: "https://player.vimeo.com/external/356640367.sd.mp4?s=9b113156b32ac9ce9d13fad1fcc5fc6ad799907b&profile_id=164"
          }
        },
        {
          id: "lisagikktilskolen",
          title: "Lisa gikk til skolen",
          sentences: ["Lisa gikk til skolen.\nTripp, tripp, tripp det sa.\n","I den nye kjolen\ntrippet hun s\u00e5 glad.\n\n","Per, han stod for presten.\nSp\u00f8r om han var kar!\n","I den nye vesten\nlignet han p\u00e5 far.\n\n","N\u00e5 er Per og Lisa\ngamle m\u00e5 du tro.\n","Men den vesle visa\nsynger begge to."],
          timecodes: {
            mann: [[0.0, 5.8], [5.9, 11.5], [11.6, 17.8], [17.9, 24.0], [24.1, 31.1], [31.2, 38.2]],
            dame: [[1.0, 8.0], [8.1, 15.8], [15.9, 23.4], [23.5, 30.9], [31.0, 38.6], [38.7, 46.6]]
          },
          videoUrls: {
            tekst_mann: "https://player.vimeo.com/external/352689923.sd.mp4?s=21bf8a76c8c22753178e718c8fb24661bbcd4acf&profile_id=164",
            tekst_dame: "https://player.vimeo.com/external/353319855.sd.mp4?s=f5c5f3fc4c43b4d2303b5c145c79e2e2f3c859a7&profile_id=165",
            lalala_mann: "https://player.vimeo.com/external/356614635.sd.mp4?s=8a66dd5a4cb409dea8bf0655b5f4093ac9e9c1b8&profile_id=164",
            lalala_dame: "https://player.vimeo.com/external/356640410.sd.mp4?s=be32e310a5b6bd0bc3e2c589dd6b60d4b5cc9567&profile_id=164"
          }
        },
        {
          id: "lysogvarme",
          title: "Lys og varme",
          sentences: ["N\u00e5r m\u00f8rke no har s\u00e6nka s\u00e6,\n","g\u00e5r \u00e6 stilt igjennom rommet.\n","\u00c5 f\u00f8lelsan d\u00e6m slit i m\u00e6.\n","Ka vil framtida gi?\n\n","\u00c5 den arven vi har gitt d\u00e6,\n","kainn v\u00e6r tung \u00e5 ta me s\u00e6.\n","Vil du sp\u00f8rr oss, vil du last oss?\n","Vil du kall det f\u00f8rr et svik?\n\n","Sola som gikk ned i kveld, ho ska skin f\u00f8rr d\u00e6, min kj\u00e6re.\n","\u00c5 f\u00f8glan som e fri, d\u00e6m ska vis vei \u00e5 aillt ska bli\n","myttji lys \u00e5 myttji varme.\n","Tru \u00e5 h\u00e5p, det kan du f\u00e5 med.\n","Mange t\u00e5ra, tunge stunde, e \u00e6 redd f\u00f8rr at det bli."],
          timecodes: {
            mann: [[0.0, 3.9], [4.0, 8.0], [8.1, 12.5], [12.6, 16.0], [16.1, 21.0], [21.1, 25.1], [25.2, 29.9], [30.0, 34.3], [34.4, 43.3], [43.4, 51.7], [51.8, 56.1], [56.2, 60.0], [60.1, 71.6]],
            dame: [[1.0, 5.6], [5.7, 10.1], [10.2, 14.3], [14.4, 19.3], [19.4, 23.2], [23.3, 27.2], [27.3, 31.5], [31.6, 37.8], [37.9, 46.6], [46.7, 54.6], [54.7, 59.0], [59.1, 63.0], [63.1, 73.7]]
          },
          videoUrls: {
            tekst_mann: "https://player.vimeo.com/external/352689944.sd.mp4?s=09e5dd7c268e71d4930ab8c30c0375ba7e1981b7&profile_id=165",
            tekst_dame: "https://player.vimeo.com/external/353305476.sd.mp4?s=92f8cd1f3ed53a111576f22f29d0f7355edab164&profile_id=165",
            lalala_mann: "https://player.vimeo.com/external/356614661.sd.mp4?s=cb5656e495fddb4b956895109cf0de257f2bf0b1&profile_id=165",
            lalala_dame: "https://player.vimeo.com/external/356640518.sd.mp4?s=7fb5559c3a5a2c8241c66642ea32d1c221e99f29&profile_id=164"
          }
        }
      ]
    },
    instrumenter: {
      description: "Instruments module - users identify which instrument is playing a song. 4 songs x 4 instruments = 16 combinations.",
      songs: ["Ja, vi elsker dette landet", "Jeg er sa glad hver julekveld", "Mikkel Rev", "Per Spelmann"],
      songIds: ["javielsker", "jegersaaglad", "mikkelrev", "perspelmann"],
      instruments: ["fiolin", "gitar", "piano", "trompet"],
      videoUrls: {
        javielsker_fiolin: "https://player.vimeo.com/external/359034629.sd.mp4?s=856b06289e6e8def986266bf5cf20d79f1d72098&profile_id=164",
        jegersaaglad_fiolin: "https://player.vimeo.com/external/359035129.sd.mp4?s=efee759a52752e62fde8c13d7830648c17adca94&profile_id=165",
        mikkelrev_fiolin: "https://player.vimeo.com/external/359038228.sd.mp4?s=576f152216759acfae839d50713df2b7fa6dc151&profile_id=165",
        perspelmann_fiolin: "https://player.vimeo.com/external/359040738.sd.mp4?s=07a4bd52d7e8100f2285a800b2c10ba5dd9c26ab&profile_id=165",
        javielsker_gitar: "https://player.vimeo.com/external/359034663.sd.mp4?s=1b8dda4106f5300ed65bbc721f2c1cf70d381bfe&profile_id=165",
        jegersaaglad_gitar: "https://player.vimeo.com/external/359035157.sd.mp4?s=d0d0087930ae0c6836f773af4d646b267318857c&profile_id=164",
        mikkelrev_gitar: "https://player.vimeo.com/external/359038277.sd.mp4?s=aad6e63d9b3bdf69c549bbf02be2f2d18c5a34e5&profile_id=165",
        perspelmann_gitar: "https://player.vimeo.com/external/359040761.sd.mp4?s=9ae4d8158e505817554b6493ab133968209da5a1&profile_id=165",
        javielsker_piano: "https://player.vimeo.com/external/359034703.sd.mp4?s=9e50c6c705f8ddbf68e9cd3b60deceeecd17b71e&profile_id=164",
        jegersaaglad_piano: "https://player.vimeo.com/external/359035189.sd.mp4?s=cc820f8dccfb3ed8151217ee0359918a27248b79&profile_id=164",
        mikkelrev_piano: "https://player.vimeo.com/external/359038301.sd.mp4?s=63e77574ff1a1f927f63f27d59e0261299cb1fb6&profile_id=165",
        perspelmann_piano: "https://player.vimeo.com/external/359040788.sd.mp4?s=af83f6f48ed6b6de69ed3f2725bf93efb3cf0262&profile_id=164",
        javielsker_trompet: "https://player.vimeo.com/external/359034745.sd.mp4?s=73755dfd020a41146952fc72d4944fca346474e9&profile_id=165",
        jegersaaglad_trompet: "https://player.vimeo.com/external/359035227.sd.mp4?s=d770b7f254bb6a22c3dd08dfc9a012d362d8bbcb&profile_id=164",
        mikkelrev_trompet: "https://player.vimeo.com/external/359038335.sd.mp4?s=3828059ce0cb2d82bb678c400263fa4207ebaa2f&profile_id=164",
        perspelmann_trompet: "https://player.vimeo.com/external/359040809.sd.mp4?s=da127c10ddf41af4790703368557e9808901f1df&profile_id=164"
      }
    }
  }
};

fs.writeFileSync(
  path.join(__dirname, 'tekster-research.json'),
  JSON.stringify(result, null, 2),
  'utf8'
);

console.log('Written tekster-research.json');
console.log('Tekster items:', Object.keys(teksterArrays).length);
console.log('Video URLs found:', Object.keys(teksterUrls).length);
