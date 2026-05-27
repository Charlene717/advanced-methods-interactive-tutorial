/* Advanced Methods Quiz — App Logic */
const SK = 'advmethods_quiz_v2';
const LK = 'advmethods_quiz_lang';
const D = window.QUIZ_DATA.advmethods;
let lang = localStorage.getItem(LK) || 'zh';
let state = JSON.parse(localStorage.getItem(SK) || '{}');
let view = 'index';
let mode = 'practice';
let curChapter = null;
let curList = [];
let curIdx = 0;

function save(){ localStorage.setItem(SK, JSON.stringify(state)); }
function setLang(l){ lang=l; localStorage.setItem(LK,l); document.documentElement.lang = l==='zh'?'zh-Hant':'en'; document.querySelectorAll('[data-zh][data-en]').forEach(el=>{el.textContent = el.dataset[l];}); render(); }
function t(zh,en){ return lang==='zh'?zh:en; }
function getQ(chId,qi){ return (state[chId]||{})[qi] || null; }
function setQ(chId,qi,st){ if(!state[chId]) state[chId] = {}; state[chId][qi] = st; save(); }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

function renderIndex(){
  document.getElementById('indexView').classList.remove('hidden');
  document.getElementById('quizView').classList.add('hidden');
  document.getElementById('modeBadge').classList.add('hidden');
  document.getElementById('statBox').classList.add('hidden');
  const cards = document.getElementById('chCards');
  cards.innerHTML = '';
  let allDone=0, allWrong=0, allTotal=0;
  D.chapters.forEach(ch=>{
    const qs = D.questions[ch.id] || [];
    const chSt = state[ch.id] || {};
    let done=0, wrong=0;
    qs.forEach((_,qi)=>{ if(chSt[qi]&&chSt[qi].answered){ done++; if(!chSt[qi].correct) wrong++; }});
    allTotal += qs.length; allDone += done; allWrong += wrong;
    const total = qs.length;
    let status='', badge='';
    if(done===0){ status=t('未開始','Not started'); }
    else if(done===total){ status=t('已完成','Done'); badge='done'; }
    else { status=`${done}/${total} ${t('進行中','in progress')}`; badge='ip'; }
    const div = document.createElement('div');
    div.className = 'ycard';
    div.innerHTML = `
      <div class="ytitle">Ch ${ch.num} · ${lang==='zh'?ch.title:ch.title_en} <span class="ycount">(${total} ${t('題','Q')})</span></div>
      <div class="ystatus">${badge?`<span class="badge-status ${badge}">${status}</span>`:status}${wrong>0?` · <span style="color:var(--red);">${wrong} ${t('錯','wrong')}</span>`:''}</div>
      <div class="action-row">
        <button class="chip practice" data-ch="${ch.id}" data-mode="practice">📝 ${t('練習','Practice')}</button>
        <button class="chip exam" data-ch="${ch.id}" data-mode="exam">🎓 ${t('考試','Exam')}</button>
      </div>`;
    cards.appendChild(div);
  });
  document.querySelectorAll('.chip[data-ch]').forEach(b=>b.onclick = ()=>{
    if(b.dataset.mode==='exam'){ delete state[b.dataset.ch]; save(); }
    startChapter(b.dataset.ch, b.dataset.mode);
  });
  document.getElementById('gpFill').style.width = (allTotal>0?100*allDone/allTotal:0)+'%';
  document.getElementById('gpText').textContent = `${allDone} / ${allTotal}`;
  document.getElementById('wrongCount').textContent = allWrong;
}

function startChapter(chId, m){
  mode = m;
  curChapter = chId;
  const qs = D.questions[chId] || [];
  curList = qs.map((_,qi)=>({chId, idx:qi}));
  curIdx = 0;
  for(let i=0;i<curList.length;i++){
    const s = getQ(curList[i].chId, curList[i].idx);
    if(!s || !s.answered){ curIdx = i; break; }
  }
  view = 'quiz'; renderQuiz();
}

function startSpecial(name){
  if(name==='wrong'){
    curList = [];
    D.chapters.forEach(ch=>{ const qs = D.questions[ch.id]||[]; qs.forEach((_,qi)=>{ const s=getQ(ch.id,qi); if(s&&s.answered&&!s.correct) curList.push({chId:ch.id, idx:qi}); }); });
    mode = 'practice'; curChapter = 'wrong';
  } else if(name==='random'){
    const all = [];
    D.chapters.forEach(ch=>{ const qs = D.questions[ch.id]||[]; qs.forEach((_,qi)=>all.push({chId:ch.id, idx:qi})); });
    shuffle(all);
    curList = all.slice(0,20);
    mode = 'practice'; curChapter = 'random';
  } else if(name==='final'){
    const all = [];
    D.chapters.forEach(ch=>{ const qs = D.questions[ch.id]||[]; qs.forEach((_,qi)=>all.push({chId:ch.id, idx:qi})); });
    shuffle(all);
    curList = all.slice(0,50);
    curList.forEach(it=>{ if(state[it.chId]) delete state[it.chId][it.idx]; });
    delete state.__finalRevealed; save();
    mode = 'exam'; curChapter = 'final';
  }
  if(curList.length===0){ alert(t('沒有題目可顯示。','No questions to display.')); return; }
  curIdx = 0; view = 'quiz'; renderQuiz();
}

function renderQuiz(){
  document.getElementById('indexView').classList.add('hidden');
  document.getElementById('quizView').classList.remove('hidden');
  const mb = document.getElementById('modeBadge'); mb.classList.remove('hidden');
  mb.classList.toggle('exam', mode==='exam'); mb.classList.toggle('practice', mode!=='exam');
  mb.textContent = mode==='exam'?t('考試 EXAM','EXAM'):t('練習 PRACTICE','PRACTICE');
  const sb = document.getElementById('statBox'); sb.classList.remove('hidden');
  document.getElementById('qCur').textContent = curIdx+1;
  document.getElementById('qTotal').textContent = curList.length;

  document.getElementById('sidebar').classList.toggle('exam', mode==='exam');
  let title;
  if(curChapter==='wrong') title = t('🔁 錯題複習','🔁 Wrong Review');
  else if(curChapter==='random') title = t('🎲 隨機練習','🎲 Random');
  else if(curChapter==='final') title = t('🎓 期末模擬考','🎓 Final Exam');
  else { const ch = D.chapters.find(c=>c.id===curChapter); title = `Ch ${ch.num} — ${lang==='zh'?ch.title:ch.title_en}`; }
  document.getElementById('sideTitle').innerHTML = title;

  const grid = document.getElementById('qGrid'); grid.innerHTML = '';
  curList.forEach((it,i)=>{
    const s = getQ(it.chId, it.idx);
    const btn = document.createElement('button');
    btn.className = 'gbtn'; btn.textContent = i+1;
    if(i===curIdx) btn.classList.add('cur');
    if(s && s.answered){
      if(mode==='exam'&&curChapter==='final'&&!state.__finalRevealed){ btn.classList.add('answered-exam'); }
      else { btn.classList.add(s.correct?'right':'wrong'); }
    }
    btn.onclick = ()=>{ curIdx=i; renderQuiz(); };
    grid.appendChild(btn);
  });

  const it = curList[curIdx];
  const q = D.questions[it.chId][it.idx];
  const s = getQ(it.chId, it.idx);
  const stem = lang==='zh'?q.stem:q.stem_en;
  const opts = q.type==='tf' ?
    [{l:'T', text:lang==='zh'?'是 / 正確':'True'}, {l:'F', text:lang==='zh'?'否 / 錯誤':'False'}] :
    ['A','B','C','D'].filter(L=>q[L]!==undefined).map(L=>({l:L, text:lang==='zh'?q[L]:q[L+'_en']}));
  const ansArr = Array.isArray(q.ans)?q.ans:[q.ans];
  const userAns = s && s.answered ? (Array.isArray(s.picked)?s.picked:[s.picked]) : [];
  const showFb = s && s.answered && (mode==='practice' || (mode==='exam'&&curChapter!=='final') || (mode==='exam'&&curChapter==='final'&&state.__finalRevealed));

  let optsHtml = '';
  opts.forEach(o=>{
    let cls = 'opt';
    if(s && s.answered){
      cls += ' disabled';
      const isCorrect = ansArr.includes(o.l);
      const isPicked = userAns.includes(o.l);
      if(showFb){ if(isCorrect) cls += ' correct'; else if(isPicked) cls += ' wrong'; }
      else if(isPicked) cls += ' sel';
    }
    optsHtml += `<div class="${cls}" data-l="${o.l}"><span class="opt-letter">${o.l}.</span> <span>${o.text}</span></div>`;
  });

  let fbHtml = '';
  if(showFb){
    const ok = s.correct;
    fbHtml = `<div class="feedback show ${ok?'correct':'wrong'}"><strong>${ok?t('✅ 答對','✅ Correct'):t('❌ 答錯，正解：','❌ Wrong. Answer: ')+ansArr.join(', ')}</strong>${lang==='zh'?q.exp:q.exp_en}</div>`;
  }

  const chMeta = D.chapters.find(c=>c.id===it.chId);
  const typeLabel = {single:t('單選','Single'), multi:t('多選','Multi'), tf:t('是非','T/F')}[q.type];
  const marked = s && s.marked;
  const examHint = mode==='exam' && curChapter==='final' && !state.__finalRevealed;

  document.getElementById('qContent').innerHTML = `
    <div class="qpanel ${mode==='exam'?'exam':''}">
      ${examHint?`<div class="exam-warning">🎓 ${t('考試模式：答完最後一題按「完成考試」一次公布答案。','Exam: answers revealed after Finish Exam.')}</div>`:''}
      <div class="qtop">
        <span class="qbadge ${mode==='exam'?'exam':''}">Ch ${chMeta.num} · ${lang==='zh'?chMeta.title:chMeta.title_en}</span>
        <span class="qtype">${typeLabel}</span>
        <button class="qmark ${marked?'on':''}" id="markBtn">${marked?'★':'☆'} ${t('收藏','Mark')}</button>
      </div>
      <div class="qstem">${stem}</div>
      <div class="opts" id="optsBox">${optsHtml}</div>
      ${fbHtml}
      <div class="qfoot">
        <button class="btn btn-ghost" id="prevBtn" ${curIdx===0?'disabled':''}>← ${t('上一題','Prev')}</button>
        ${q.type==='multi' && !(s&&s.answered) ? `<button class="btn btn-primary" id="submitBtn">${t('送出','Submit')}</button>` : ''}
        <button class="btn btn-primary" id="nextBtn">${curIdx===curList.length-1?(mode==='exam'&&curChapter==='final'?t('完成考試','Finish Exam'):t('完成','Done')):t('下一題 →','Next →')}</button>
        <button class="btn btn-exit" id="exitBtn">${t('離開','Exit')}</button>
      </div>
    </div>
    ${mode==='exam'&&curChapter==='final'&&state.__finalRevealed?renderExamResult():''}`;

  let multiSel = [];
  document.querySelectorAll('#optsBox .opt').forEach(el=>{
    el.onclick = ()=>{
      if(el.classList.contains('disabled')) return;
      const L = el.dataset.l;
      if(q.type==='multi'){
        el.classList.toggle('sel');
        if(multiSel.includes(L)) multiSel = multiSel.filter(x=>x!==L);
        else multiSel.push(L);
      } else {
        const correct = ansArr.includes(L);
        setQ(it.chId, it.idx, {answered:true, picked:L, correct});
        renderQuiz();
      }
    };
  });

  document.getElementById('markBtn').onclick = ()=>{
    const cur = getQ(it.chId,it.idx) || {};
    cur.marked = !cur.marked;
    setQ(it.chId, it.idx, cur);
    renderQuiz();
  };
  document.getElementById('prevBtn').onclick = ()=>{ if(curIdx>0){curIdx--; renderQuiz();} };
  document.getElementById('nextBtn').onclick = ()=>{
    if(curIdx<curList.length-1){ curIdx++; renderQuiz(); }
    else {
      if(mode==='exam' && curChapter==='final'){ state.__finalRevealed = true; save(); renderQuiz(); }
      else { view='index'; render(); }
    }
  };
  document.getElementById('exitBtn').onclick = ()=>{ view='index'; render(); };
  const sb2 = document.getElementById('submitBtn');
  if(sb2){
    sb2.onclick = ()=>{
      multiSel.sort();
      const correct = JSON.stringify(multiSel)===JSON.stringify([...ansArr].sort());
      setQ(it.chId, it.idx, {answered:true, picked:multiSel, correct});
      renderQuiz();
    };
  }
}

function renderExamResult(){
  let correct=0, total=curList.length;
  curList.forEach(it=>{ const s=getQ(it.chId,it.idx); if(s&&s.correct) correct++; });
  const pct = total>0?Math.round(100*correct/total):0;
  const medal = pct>=90?'🥇':pct>=75?'🥈':pct>=60?'🥉':'📚';
  return `<div class="exam-result"><h3>${medal} ${t('考試結束','Exam Finished')}</h3><div class="score">${correct} / ${total} (${pct}%)</div><div style="color:var(--soft);font-size:14px;">${t('答對','Correct')}：${correct} ・ ${t('答錯','Wrong')}：${total-correct}</div><div style="margin-top:14px;color:var(--soft);font-size:13px;">${t('使用左側題號可瀏覽各題解答。','Use the left numbers to review.')}</div></div>`;
}

function render(){
  if(view==='index'){ delete state.__finalRevealed; save(); renderIndex(); }
  else renderQuiz();
}

document.getElementById('langBtn').onclick = ()=> setLang(lang==='zh'?'en':'zh');
document.getElementById('gpReset').onclick = ()=>{
  if(confirm(t('確定要清除所有作答紀錄？','Clear all answer history?'))){ state = {}; save(); render(); }
};
document.getElementById('reviewWrong').onclick = ()=> startSpecial('wrong');
document.getElementById('randomAll').onclick = ()=> startSpecial('random');
document.getElementById('finalExam').onclick = ()=>{
  if(confirm(t('期末考會清除涉及題目的舊紀錄並隨機抽 50 題。要開始嗎？','Final exam will clear involved question history and pick 50 random. Continue?'))){
    startSpecial('final');
  }
};

setLang(lang);
