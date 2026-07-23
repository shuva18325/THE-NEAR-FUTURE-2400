// Headless smoke test: wrap the artifact-body file in a full HTML doc,
// load it in the pre-installed Chromium, autoplay several days, and fail
// on any console error / page error / thrown exception.
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const body = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const doc = `<!doctype html><html><head><meta charset="utf-8"></head><body>${body}</body></html>`;
  const tmp = path.join(__dirname, '_wrapped.html');
  fs.writeFileSync(tmp, doc);

  const errors = [];
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push('console.error: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.goto('file://' + tmp);

  // start
  await page.click('#btn-start');

  // autoplay: for up to N interactions, click whatever advances the game.
  let daysSeen = new Set();
  for (let i = 0; i < 3000 && errors.length === 0; i++) {
    // read current day
    const day = await page.$eval('#m-day', e => e.textContent).catch(() => '?');
    daysSeen.add(day);

    // ending reached?
    const endingOn = await page.$eval('#scr-ending', e => e.classList.contains('on')).catch(() => false);
    if (endingOn) { console.log('reached ending on day', day); break; }

    // which screen is on?
    const screen = await page.evaluate(() => {
      const on = document.querySelector('.screen.on');
      return on ? on.id : null;
    });

    if (screen === 'scr-commute') {
      // pick first affordable route option
      const clicked = await page.evaluate(() => {
        const opt = [...document.querySelectorAll('#route-opts .opt')].find(o => o.onclick);
        if (opt) { opt.click(); return true; } return false;
      });
      if (clicked) {
        // then click the continue button if present
        await page.waitForTimeout(20);
        await page.evaluate(() => { const b = document.getElementById('commute-go'); if (b) b.click(); });
      }
    } else if (screen === 'scr-desk') {
      // desk: pull, query, compare all, deny-if-mismatch else approve
      const done = await page.evaluate(() => {
        // if lunch/overtime card is showing (no stamp bar buttons but doc-view has .opt)
        const opt = document.querySelector('#doc-view .opt, #doc-view .btn-row button');
        if (opt) { opt.click(); return 'branch'; }
        // if a case is open
        if (window.G && window.G.openCase) {
          const c = window.G.openCase;
          if (!c.queried) { queryDb(); return 'query'; }
          // compare all unchecked fields
          let compared = false;
          c.docs.forEach((d, di) => d.fields.forEach((f, fi) => { if (!f.checked) { compareField(di, fi); compared = true; } }));
          if (compared) return 'compare';
          // flag mismatches
          let flagged = false;
          c.docs.forEach((d, di) => d.fields.forEach((f, fi) => { if (f.state === 'mismatch' && !f.flagged) { flagField(di, fi); flagged = true; } }));
          const hasFlags = c.docs.some(d => d.fields.some(f => f.flagged));
          doStamp(hasFlags ? 'DENY' : 'APPROVE', true);
          return 'stamp';
        }
        // no open case: pull next or clock out
        if (window.G && window.G.queue.length && window.G.closed.length < window.G.quota) { pull(); return 'pull'; }
        // clock out via stamp bar
        const btn = [...document.querySelectorAll('#stamp-bar button')].pop();
        if (btn) { btn.click(); return 'clockout'; }
        return 'idle';
      });
    } else if (screen === 'scr-pod') {
      await page.evaluate(() => { const o = document.querySelector('#pod-actions .opt'); if (o) o.click(); });
    } else if (screen === 'scr-summary') {
      await page.evaluate(() => { const b = document.getElementById('next-day'); if (b) b.click(); });
    } else {
      // unknown; try any primary button
      await page.evaluate(() => { const b = document.querySelector('.btn-primary'); if (b) b.click(); });
    }
    await page.waitForTimeout(8);
  }

  const finalDay = await page.$eval('#m-day', e => e.textContent).catch(() => '?');
  console.log('days seen:', [...daysSeen].sort((a,b)=>a-b).join(','));
  console.log('final day reached:', finalDay);
  await browser.close();
  fs.unlinkSync(tmp);

  if (errors.length) {
    console.error('SMOKE TEST FAILED:\n' + errors.slice(0, 20).join('\n'));
    process.exit(1);
  }
  console.log('SMOKE TEST PASSED — no console/page errors across autoplay.');
})();
