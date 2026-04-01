
const ENDPOINT = window.LTAS_ENDPOINT || "";
const TOURNAMENT_START_UTC = "2026-06-11T19:00:00Z";
const CACHE_PREFIX = "LTAS_CACHE_V7_";
const VIEW_REFRESH_MS = 30000;
const HOME_REFRESH_MS = 30000;

const TEAM_TRANSLATIONS={"Turkey":["🇹🇷","Türkiye"],"Australia":["🇦🇺","Avustralya"],"Paraguay":["🇵🇾","Paraguay"],"United States":["🇺🇸","ABD"],"Mexico":["🇲🇽","Meksika"],"South Africa":["🇿🇦","Güney Afrika"],"South Korea":["🇰🇷","Güney Kore"],"Czech Republic":["🇨🇿","Çekya"],"Bosnia and Herzegovina":["🇧🇦","Bosna Hersek"],"Switzerland":["🇨🇭","İsviçre"],"Canada":["🇨🇦","Kanada"],"Qatar":["🇶🇦","Katar"],"Netherlands":["🇳🇱","Hollanda"],"England":["🏴","İngiltere"],"France":["🇫🇷","Fransa"],"Germany":["🇩🇪","Almanya"],"Spain":["🇪🇸","İspanya"],"Portugal":["🇵🇹","Portekiz"],"Belgium":["🇧🇪","Belçika"],"Brazil":["🇧🇷","Brezilya"],"Argentina":["🇦🇷","Arjantin"],"Uruguay":["🇺🇾","Uruguay"],"Chile":["🇨🇱","Şili"],"Colombia":["🇨🇴","Kolombiya"],"Japan":["🇯🇵","Japonya"],"Saudi Arabia":["🇸🇦","Suudi Arabistan"],"Ivory Coast":["🇨🇮","Fildişi Sahili"],"DR Congo":["🇨🇩","Kongo DC"],"Cape Verde":["🇨🇻","Yeşil Burun"],"Curaçao":["🇨🇼","Curaçao"],"New Zealand":["🇳🇿","Yeni Zelanda"],"Ecuador":["🇪🇨","Ekvador"],"Norway":["🇳🇴","Norveç"],"Senegal":["🇸🇳","Senegal"],"Egypt":["🇪🇬","Mısır"],"Iran":["🇮🇷","İran"],"Sweden":["🇸🇪","İsveç"],"Tunisia":["🇹🇳","Tunus"],"Iraq":["🇮🇶","Irak"],"Poland":["🇵🇱","Polonya"],"Croatia":["🇭🇷","Hırvatistan"],"Serbia":["🇷🇸","Sırbistan"],"Denmark":["🇩🇰","Danimarka"],"Austria":["🇦🇹","Avusturya"],"Morocco":["🇲🇦","Fas"],"Algeria":["🇩🇿","Cezayir"],"Cameroon":["🇨🇲","Kamerun"],"Nigeria":["🇳🇬","Nijerya"],"Ghana":["🇬🇭","Gana"],"Mali":["🇲🇱","Mali"],"Costa Rica":["🇨🇷","Kosta Rika"],"Panama":["🇵🇦","Panama"],"Jamaica":["🇯🇲","Jamaika"],"Honduras":["🇭🇳","Honduras"],"El Salvador":["🇸🇻","El Salvador"],"Venezuela":["🇻🇪","Venezuela"],"Bolivia":["🇧🇴","Bolivya"],"Peru":["🇵🇪","Peru"],"Romania":["🇷🇴","Romanya"],"Greece":["🇬🇷","Yunanistan"],"Ukraine":["🇺🇦","Ukrayna"],"Slovakia":["🇸🇰","Slovakya"],"Slovenia":["🇸🇮","Slovenya"],"Wales":["🏴","Galler"],"Scotland":["🏴","İskoçya"],"Ireland":["🇮🇪","İrlanda"],"Finland":["🇫🇮","Finlandiya"],"Iceland":["🇮🇸","İzlanda"],"Georgia":["🇬🇪","Gürcistan"],"Armenia":["🇦🇲","Ermenistan"],"Azerbaijan":["🇦🇿","Azerbaycan"],"Uzbekistan":["🇺🇿","Özbekistan"],"Jordan":["🇯🇴","Ürdün"],"United Arab Emirates":["🇦🇪","BAE"],"Bahrain":["🇧🇭","Bahreyn"],"Oman":["🇴🇲","Umman"],"China":["🇨🇳","Çin"],"India":["🇮🇳","Hindistan"],"Indonesia":["🇮🇩","Endonezya"],"Thailand":["🇹🇭","Tayland"],"Vietnam":["🇻🇳","Vietnam"],"Malaysia":["🇲🇾","Malezya"],"Philippines":["🇵🇭","Filipinler"],"DRAW":["➖","Beraberlik"]};
const STAGE_ORDER=["Son 32","Son 16","Çeyrek Final","Yarı Final","Üçüncülük","Final"];

const state={
  tab:"home",
  views:{ home:null, leaderboard:null, matches:null, groups:null, knockout:null, predictions:null },
  loading:{ home:true, leaderboard:false, matches:false, groups:false, knockout:false, predictions:false }
};

const navTabs=[...document.querySelectorAll(".nav-tab")];
const panels=[...document.querySelectorAll(".panel")];
const statusBar=document.getElementById("status-bar");

navTabs.forEach(btn=>btn.addEventListener("click",()=>switchTab(btn.dataset.tab)));
document.querySelectorAll(".quick-link").forEach(btn=>btn.addEventListener("click",()=>switchTab(btn.dataset.jump)));
document.getElementById("shareBtn").addEventListener("click",async()=>{
  const meta=getMeta();
  const url=meta?.shareUrl||window.location.href;
  const title=meta?.tabTitle||document.title;
  try{
    if(navigator.share){await navigator.share({title,url});}
    else if(navigator.clipboard){await navigator.clipboard.writeText(url);alert("Site linki kopyalandı.");}
  }catch(_){}
});

function switchTab(tab){
  state.tab=tab;
  renderTabs();
  renderCurrentPanel();
  if(tab!=="home" && !state.views[tab]) fetchView(tab);
  window.scrollTo({top:0,behavior:"smooth"});
}

function renderTabs(){
  navTabs.forEach(btn=>btn.classList.toggle("active",btn.dataset.tab===state.tab));
  panels.forEach(panel=>panel.classList.toggle("active",panel.id===state.tab));
  document.getElementById("home").classList.toggle("active",state.tab==="home");
}

function getMeta(){
  return state.views.home?.meta || null;
}

function applyMeta(meta){
  if(!meta) return;
  document.title=meta.tabTitle||"L.T.A.S. 🇹🇷 World Cup'26 🏆";
  document.getElementById("site-title").textContent=meta.title||"L.T.A.S. World Cup 2026";
  document.getElementById("site-subtitle").textContent=meta.subtitle||"";
  document.getElementById("site-status").textContent=meta.status||"Canlı";
  document.getElementById("leader-name").textContent=meta.leader||"-";
  document.getElementById("user-count").textContent=String(meta.userCount||0);
  document.getElementById("match-progress").textContent=`${meta.playedMatchCount||0} / ${meta.totalMatchCount||0}`;
  document.getElementById("last-sync").textContent=timeAgoTR(meta.lastSyncRaw||meta.lastSync);
  const formBtn=document.getElementById("formBtn");
  if(meta.formUrl){formBtn.href=meta.formUrl;} else {formBtn.href="#";}
}

function renderHome(){
  const home=state.views.home;
  const meta=home?.meta;
  applyMeta(meta);
  if(meta){
    document.getElementById("leader-points").textContent=`${home.leaderboard?.[0]?.points||0} puan`;
  }
  renderFeaturedMatch();
  renderTodayMatches();
  renderLeaderPulse();
  updateCountdowns();
}

function renderFeaturedMatch(){
  const root=document.getElementById("featuredMatch");
  const badge=document.getElementById("featuredBadge");
  const match=state.views.home?.featuredMatch || state.views.home?.meta?.featuredMatch;

  if(state.loading.home && !match){
    root.innerHTML='<div class="skeleton-block"></div>';
    badge.textContent='Bağlanıyor';
    return;
  }

  if(!match){
    root.innerHTML=`<div class="fm-line"><div class="fm-team">Henüz öne çıkan maç yok</div></div>`;
    badge.textContent='Bekleniyor';
    return;
  }

  badge.textContent=match.isLive?'Şimdi Canlı':(match.isTurkeyMatch?'Türkiye Maçı':'Yaklaşan');
  if(match.isLive) badge.innerHTML='<span class="live-dot"></span> Şimdi Canlı';

  root.innerHTML=`<div class="featured-match-main"><div class="fm-line"><div class="fm-teams"><div class="fm-team">${escapeHtml(teamDisplay(match.home_team))}</div><div class="fm-team">${escapeHtml(teamDisplay(match.away_team))}</div><div class="fm-meta"><span class="pill">${escapeHtml(formatLongDate(match.utc_date||match.kickoff_tr))}</span><span class="pill">${escapeHtml(statusLabelTR(match.status))}</span>${match.group_name?`<span class="pill">Grup ${escapeHtml(match.group_name)}</span>`:""}</div></div><div class="fm-score">${displayScore(match.home_score)} - ${displayScore(match.away_score)}</div></div></div>`;
}

function renderTodayMatches(){
  const root=document.getElementById("todayMatches");
  const count=document.getElementById("todayCount");
  const rows=state.views.home?.todayMatches || [];
  count.textContent=rows.length ? `${rows.length} maç` : (state.loading.home ? "yükleniyor" : "0 maç");

  if(state.loading.home && !rows.length){
    root.innerHTML='<div class="mini-match"></div><div class="mini-match"></div><div class="mini-match"></div>';
    return;
  }

  if(!rows.length){
    root.innerHTML=`<div class="mini-match"><div class="mm-time">-</div><div class="mm-teams">Bugün maç görünmüyor</div><div class="pill">Takvim</div></div>`;
    return;
  }

  root.innerHTML=rows.slice(0,6).map(match=>`<div class="mini-match"><div class="mm-time">${escapeHtml(formatOnlyTime(match.utc_date||match.kickoff_tr))}</div><div class="mm-teams">${escapeHtml(teamDisplay(match.home_team))} vs ${escapeHtml(teamDisplay(match.away_team))}</div><div class="pill">${match.isLive?'<span class="live-dot"></span> Canlı':escapeHtml(statusLabelTR(match.status))}</div></div>`).join('');
}

function renderLeaderPulse(){
  const root=document.getElementById("leaderPulse");
  const rows=state.views.home?.leaderboard || [];
  const leader=rows[0]?.name || '-';
  const points=rows[0]?.points || 0;
  const second=rows[1]?.name || null;
  const secondPts=rows[1]?.points || 0;

  if(state.loading.home && !rows.length){
    root.innerHTML='<div class="skeleton-lines"><div></div><div></div><div></div></div>';
    return;
  }

  const lastSeenLeader=localStorage.getItem("ltas_last_leader");
  let changeText='Zirve sabit görünüyor.';
  if(lastSeenLeader && lastSeenLeader!==leader) changeText=`Yeni lider: ${leader}`;
  if(leader && leader!=="-") localStorage.setItem("ltas_last_leader",leader);

  const diff=second?Math.max(0,points-secondPts):0;
  root.innerHTML=`<div class="lp-title">${escapeHtml(leader)}</div><div class="lp-sub">${points} puan • ${second?`${diff} puan farkla önde`:'zirvede tek başına'}</div><div class="lp-sub">${escapeHtml(changeText)}</div>`;
}

function updateCountdowns(){
  document.getElementById("tournamentCountdown").textContent=countdownText(TOURNAMENT_START_UTC);
  const turkeyMatch=state.views.home?.turkeyNextMatch || state.views.home?.meta?.turkeyNextMatch;
  if(turkeyMatch && turkeyMatch.utc_date){
    document.getElementById("turkeyCountdown").textContent=countdownText(turkeyMatch.utc_date);
    document.getElementById("turkeyCountdownSub").textContent=`${teamDisplay(turkeyMatch.home_team)} vs ${teamDisplay(turkeyMatch.away_team)} • ${formatLongDate(turkeyMatch.utc_date)}`;
  }else{
    document.getElementById("turkeyCountdown").textContent='-';
    document.getElementById("turkeyCountdownSub").textContent='Türkiye maçı bekleniyor';
  }
}

function renderCurrentPanel(){
  if(state.tab==="leaderboard") renderLeaderboard();
  if(state.tab==="matches") renderMatches();
  if(state.tab==="groups") renderGroups();
  if(state.tab==="knockout") renderKnockout();
  if(state.tab==="predictions") renderPredictions();
  if(state.tab==="home") renderHome();
}

function renderLeaderboard(){
  const root=document.getElementById("leaderboard");
  const payload=state.views.leaderboard;
  if(state.loading.leaderboard && !payload){
    root.innerHTML=panelSkeleton('Puan Durumu');
    return;
  }
  const rows=(payload?.leaderboard||[]).slice().sort((a,b)=>(a.rank||99)-(b.rank||99));
  root.innerHTML=`<div class="section-card card"><div class="section-head"><h2>Puan Durumu</h2><span class="pill">Sıfır puanlılar dahil</span></div><div class="table-shell"><div class="table-head lb-grid"><div>Derece</div><div>İsim</div><div>Puan</div><div>Kusursuz</div><div>Doğru Lider</div></div>${rows.map(row=>`<div class="table-row lb-grid"><div><span class="medal-chip">${escapeHtml(row.medal||row.rank||"-")}</span></div><div><strong>${escapeHtml(row.name||"-")}</strong></div><div>${escapeHtml(String(row.points??0))}</div><div>${escapeHtml(String(row.perfect??0))}</div><div>${escapeHtml(String(row.winners??0))}</div></div>`).join("")}</div></div>`;
}

function renderMatches(){
  const root=document.getElementById("matches");
  const payload=state.views.matches;
  if(state.loading.matches && !payload){
    root.innerHTML=panelSkeleton('Maç Takvimi');
    return;
  }
  const grouped=groupMatchesByDay(payload?.matches||[]);
  const days=Object.keys(grouped);
  root.innerHTML=`<div class="section-card card"><div class="section-head"><h2>Maç Takvimi</h2><span class="pill">${(payload?.matches||[]).length} maç</span></div>${days.map(day=>`<section class="matches-day"><h3>${escapeHtml(day)}</h3><div class="match-list">${grouped[day].map(match=>`<div class="match-line ${match.isLive?"live":""}"><div class="match-time">${escapeHtml(formatOnlyTime(match.utc_date||match.kickoff_tr))}</div><div class="match-team">${escapeHtml(teamDisplay(match.home_team))}</div><div class="match-score">${displayScore(match.home_score)} - ${displayScore(match.away_score)}</div><div class="match-team">${escapeHtml(teamDisplay(match.away_team))}</div><div class="match-status pill">${match.isLive?'<span class="live-dot"></span> Şimdi Canlı':escapeHtml(statusLabelTR(match.status))}</div></div>`).join("")}</div></section>`).join("")}</div>`;
}

function renderGroups(){
  const root=document.getElementById("groups");
  const payload=state.views.groups;
  if(state.loading.groups && !payload){
    root.innerHTML=panelSkeleton('Gruplar');
    return;
  }
  const grouped={};
  (payload?.standings||[]).forEach(row=>{if(!grouped[row.group]) grouped[row.group]=[];grouped[row.group].push(row);});
  const groups=Object.keys(grouped).sort((a,b)=>a.localeCompare(b,"tr"));
  root.innerHTML=`<div class="group-grid">${groups.map(group=>`<div class="card group-card"><div class="group-header"><h3>Grup ${escapeHtml(group)}</h3><span class="pill">Canlı Tablo</span></div><div class="group-head"><div>#</div><div>Takım</div><div>O</div><div style="text-align:right">P</div></div>${grouped[group].sort((a,b)=>a.position-b.position).map(row=>`<div class="group-row"><div><strong>${escapeHtml(String(row.position))}</strong></div><div>${escapeHtml(teamDisplay(row.team))}</div><div>${escapeHtml(String(row.played||0))}</div><div style="text-align:right"><strong>${escapeHtml(String(row.points||0))}</strong></div></div>`).join("")}</div>`).join("")}</div>`;
}

function renderKnockout(){
  const root=document.getElementById("knockout");
  const payload=state.views.knockout;
  if(state.loading.knockout && !payload){
    root.innerHTML=panelSkeleton('Turnuva Ağacı');
    return;
  }
  const grouped={};
  (payload?.knockout||[]).forEach(row=>{if(!grouped[row.stage]) grouped[row.stage]=[];grouped[row.stage].push(row);});
  root.innerHTML=`<div class="section-card card"><div class="section-head"><h2>Turnuva Ağacı</h2><span class="pill">Bracket Görünümü</span></div><div class="bracket-shell"><div class="bracket">${STAGE_ORDER.map(stage=>`<div class="bracket-col"><div class="bracket-stage">${escapeHtml(stage)}</div>${((grouped[stage]||[]).sort((a,b)=>(a.slot_order||99)-(b.slot_order||99)).map(row=>`<div class="bracket-card"><div class="bracket-slot">${escapeHtml(row.slot_label||"-")}</div><div class="bracket-time">${escapeHtml(formatLongDate(row.utc_date||row.kickoff_tr,false,true))}</div>${teamRow(teamDisplay(row.home_team),row.home_score,!row.home_team)}${teamRow(teamDisplay(row.away_team),row.away_score,!row.away_team)}</div>`).join(""))||`<div class="bracket-card"><div class="bracket-slot">Henüz eşleşme yok</div></div>`}</div>`).join("")}</div></div></div>`;
}

function renderPredictions(){
  const root=document.getElementById("predictions");
  const payload=state.views.predictions;
  if(state.loading.predictions && !payload){
    root.innerHTML=panelSkeleton('Tahminler');
    return;
  }
  const rows=payload?.predictions||[];
  root.innerHTML=`<div class="pred-grid">${rows.map((user,i)=>`<div class="card pred-card" data-pred-index="${i}"><div class="pred-card-top"><div><div class="pred-user">${escapeHtml(user.user||"-")}</div><div class="pred-full">${escapeHtml(user.full_name||"")}</div></div><div class="pred-toggle">Detayı Aç</div></div><div class="pred-body">${(user.groups||[]).map(g=>`<div class="pred-group"><div class="pred-group-title">Grup ${escapeHtml(g.group)}</div><div class="pred-lines"><div>1. ${escapeHtml(teamDisplay(g.r1))}</div><div>2. ${escapeHtml(teamDisplay(g.r2))}</div><div>3. ${escapeHtml(teamDisplay(g.r3))}</div><div>4. ${escapeHtml(teamDisplay(g.r4))}</div></div></div>`).join("")}</div></div>`).join("")}</div>`;
  root.querySelectorAll(".pred-card").forEach(card=>{card.addEventListener("click",()=>{card.classList.toggle("open");const btn=card.querySelector(".pred-toggle");if(btn) btn.textContent=card.classList.contains("open")?"Detayı Kapat":"Detayı Aç";});});
}

function panelSkeleton(title){
  return `<div class="section-card card"><div class="section-head"><h2>${escapeHtml(title)}</h2><span class="pill">yükleniyor</span></div><div class="skeleton-lines"><div></div><div></div><div></div><div></div></div></div>`;
}

function groupMatchesByDay(matches){
  const sorted=matches.slice().sort((a,b)=>String(a.utc_date||"").localeCompare(String(b.utc_date||"")));
  const grouped={};
  sorted.forEach(match=>{const dayLabel=formatLongDate(match.utc_date||match.kickoff_tr,true,false);if(!grouped[dayLabel]) grouped[dayLabel]=[];grouped[dayLabel].push(match);});
  return grouped;
}

function teamDisplay(team){const raw=String(team||"").trim();if(!raw) return "Henüz belli değil";const t=TEAM_TRANSLATIONS[raw];if(t) return `${t[0]} ${t[1]}`;return `🏳️ ${raw}`;}
function statusLabelTR(status){const map={SCHEDULED:"Planlandı",TIMED:"Planlandı",IN_PLAY:"Canlı",PAUSED:"Devre Arası",EXTRA_TIME:"Uzatma",PENALTY_SHOOTOUT:"Penaltılar",FINISHED:"Bitti",AWARDED:"Hükmen"};return map[status]||status||"-";}
function displayScore(v){return v===""||v===undefined||v===null?"-":String(v);}
function formatLongDate(input,dayOnly=false,noWeekday=false){if(!input) return "-";const d=new Date(input);if(isNaN(d.getTime())) return String(input);const days=["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];const months=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];const day=d.getDate();const month=months[d.getMonth()];const weekday=days[d.getDay()];const hh=String(d.getHours()).padStart(2,"0");const mm=String(d.getMinutes()).padStart(2,"0");if(dayOnly) return `${day} ${month} ${weekday}`;if(noWeekday) return `${day} ${month} ${hh}.${mm}`;return `${day} ${month} ${weekday} ${hh}.${mm}`;}
function formatOnlyTime(input){if(!input) return "-";const d=new Date(input);if(isNaN(d.getTime())) return String(input).slice(-5).replace(":",".");return `${String(d.getHours()).padStart(2,"0")}.${String(d.getMinutes()).padStart(2,"0")}`;}
function timeAgoTR(input){if(!input) return "-";const d=new Date(input);if(isNaN(d.getTime())) return String(input);const diffSec=Math.max(0,Math.floor((Date.now()-d.getTime())/1000));if(diffSec<60) return "az önce";const min=Math.floor(diffSec/60);if(min<60) return `${min} dakika önce`;const hr=Math.floor(min/60);if(hr<24) return `${hr} saat önce`;const day=Math.floor(hr/24);return `${day} gün önce`;}
function countdownText(input){if(!input) return "-";const target=new Date(input);if(isNaN(target.getTime())) return "-";let diff=Math.floor((target.getTime()-Date.now())/1000);if(diff<=0) return "Başladı";const days=Math.floor(diff/86400);diff-=days*86400;const hours=Math.floor(diff/3600);diff-=hours*3600;const mins=Math.floor(diff/60);return `${days}g ${hours}s ${mins}dk`;}
function teamRow(teamText,score,muted=false){return `<div class="team-row ${muted?"team-row--muted":""}"><div class="team-name">${escapeHtml(teamText||"Henüz belli değil")}</div><div class="team-score">${displayScore(score)}</div></div>`;}
function escapeHtml(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}

function saveViewCache(view,payload){
  try{localStorage.setItem(CACHE_PREFIX+view, JSON.stringify({savedAt:Date.now(),payload}));}catch(_){}
}
function readViewCache(view){
  try{
    const raw=localStorage.getItem(CACHE_PREFIX+view);
    if(!raw) return null;
    const parsed=JSON.parse(raw);
    return parsed.payload || null;
  }catch(_){ return null; }
}

function applyView(view,payload){
  state.views[view]=payload;
  saveViewCache(view,payload);
  if(view==="home") renderHome();
  if(state.tab===view) renderCurrentPanel();
}

async function fetchView(view){
  const normalized = view || "home";
  state.loading[normalized] = true;
  renderCurrentPanel();

  try{
    const res = await fetch(`${ENDPOINT}?view=${normalized}`, { method:"GET" });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    if(json.error) throw new Error(json.message || "Bilinmeyen hata");

    state.views[normalized] = json;
    saveViewCache(normalized, json);
    statusBar.classList.add("hidden");

  } catch(e){
    loadViewViaJsonp(normalized);
    return;
  } finally {
    state.loading[normalized] = false;
    renderCurrentPanel();
    if(normalized === "home") {
      renderHome();
    }
  }

}

function loadViewViaJsonp(view){
  const cbName=`ltasJsonp_${view}_${Date.now()}`;
  window[cbName]=function(json){
    if(!json.error) applyView(view,json);
    cleanup();
    state.loading[view]=false;
    renderCurrentPanel();
  };
  function cleanup(){
    const old=document.getElementById(cbName);
    if(old) old.remove();
    delete window[cbName];
  }
  const s=document.createElement("script");
  s.id=cbName;
  s.src=`${ENDPOINT}?view=${view}&callback=${cbName}&t=${Date.now()}`;
  s.onerror=function(){
    cleanup();
    state.loading[view]=false;
    if(!state.views[view]) showStatus("Canlı veri alınamadı. Son bilinen veri gösteriliyor.");
    renderCurrentPanel();
  };
  document.body.appendChild(s);
}

function showStatus(message){
  statusBar.textContent=message;
  statusBar.classList.remove("hidden");
}

function bootstrap(){
  ["home","leaderboard","matches","groups","knockout","predictions"].forEach(view=>{
    const cached=readViewCache(view);
    if(cached) state.views[view]=cached;
  });

  if(state.views.home){
    applyMeta(state.views.home.meta||null);
    renderHome();
  }else{
    renderHome();
  }

  renderTabs();
  renderCurrentPanel();
  fetchView("home");
}

bootstrap();
setInterval(()=>fetchView("home"), HOME_REFRESH_MS);
setInterval(updateCountdowns, 30000);
