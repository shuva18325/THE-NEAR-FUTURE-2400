const { chromium } = require('playwright-core');
const fs=require('fs');
(async()=>{
  const body=fs.readFileSync(__dirname+'/index.html','utf8');
  fs.writeFileSync('/tmp/w3.html',`<!doctype html><html><head><meta charset="utf-8"></head><body>${body}</body></html>`);
  const errs=[];
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',args:['--no-sandbox']});
  const p=await b.newPage();
  p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await p.goto('file:///tmp/w3.html');
  await p.click('#btn-start');
  // jump straight to pod for a clean amenities test
  await p.evaluate(()=>{ G.wallet=500; enterPod(); });
  await p.waitForTimeout(50);
  const r=await p.evaluate(()=>{
    const out={};
    // NEWS: open, step through all segments, close
    openNews(); out.newsSegs=_newsState.segs.length;
    while(_newsState.i<_newsState.segs.length-1) nextNews();
    nextNews(); // final -> closes
    out.newsClosed=!document.getElementById('overlay-news').classList.contains('on');
    // ETHER: open, visit each site
    openEther(); const sites=etherSites().map(s=>s.id);
    let etherOk=true; sites.forEach(id=>{_etherCur=id; renderEther(); if(!document.getElementById('ether-page').innerHTML)etherOk=false;});
    out.etherSites=sites.length; out.etherOk=etherOk; closeOverlay('overlay-ether');
    // FAMILY: call Tomas, check wallet drop + dialogue + offledger bump
    const w0=G.wallet, ol0=G.offLedger;
    openFamily(); callFamily('tomas',false);
    out.walletDropped=G.wallet<w0; out.gotDialog=!!G.famState.tomas.dialog; out.offledgerUp=G.offLedger>ol0;
    // call again same day should be blocked
    const w1=G.wallet; callFamily('tomas',false); out.callBlockedSameDay=(G.wallet===w1);
    return out;
  });
  await b.close();
  console.log(JSON.stringify(r,null,2));
  console.log('pageerrors:', errs.length? errs.join(' | ') : 'none');
  process.exit(errs.length?1:0);
})();
