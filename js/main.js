/* ===== PruTech — interactions ===== */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- NAV ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const burger = document.getElementById('burger');
  const links = document.querySelector('.nav__links');
  burger && burger.addEventListener('click', () => links.classList.toggle('open'));
  links && links.addEventListener('click', e => { if (e.target.tagName === 'A') links.classList.remove('open'); });

  /* ---------- REVEAL ON SCROLL ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- COUNTERS ---------- */
  const counters = document.querySelectorAll('.metric__num');
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, to = +el.dataset.to; let cur = 0;
      const step = Math.max(1, to / 60);
      const tick = () => { cur += step; if (cur >= to) { el.textContent = to; } else { el.textContent = Math.floor(cur); requestAnimationFrame(tick); } };
      reduce ? (el.textContent = to) : tick();
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cio.observe(c));

  /* ---------- HERO PARTICLE CANVAS ---------- */
  const cv = document.getElementById('heroCanvas');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d');
    let w, h, pts, raf;
    const resize = () => { w = cv.width = cv.offsetWidth; h = cv.height = cv.offsetHeight;
      pts = Array.from({ length: Math.min(90, (w * h) / 16000) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4
      }));
    };
    resize(); addEventListener('resize', resize);
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = 'rgba(52,230,160,.8)';
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
          if (d < 120) {
            ctx.strokeStyle = `rgba(59,141,255,${(1 - d / 120) * .28})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
  }

  /* ---------- TYPEWRITER ENGINE ---------- */
  function typer(el, lines, { loop = true, speed = 22, linePause = 500, endPause = 2600 } = {}) {
    if (!el) return;
    if (reduce) { el.innerHTML = lines.join('\n'); return; }
    let li = 0;
    const writeLine = () => {
      if (li >= lines.length) {
        if (!loop) return;
        setTimeout(() => { el.innerHTML = ''; li = 0; writeLine(); }, endPause);
        return;
      }
      const full = lines[li];
      let ci = 0;
      const tick = () => {
        el.innerHTML = lines.slice(0, li).join('\n') + (li ? '\n' : '') + full.slice(0, ci) + '<span class="caret">▋</span>';
        ci++;
        if (ci <= full.length) setTimeout(tick, speed);
        else { li++; setTimeout(writeLine, linePause); }
      };
      tick();
    };
    writeLine();
  }

  // Hero floating card — rotating, multi-technology, government-focused code
  function codeRotator(el, fileEl, snippets, { speed = 24, hold = 2400 } = {}) {
    if (!el) return;
    if (reduce) {
      if (fileEl) fileEl.textContent = snippets[0].file;
      el.innerHTML = snippets[0].lines.join('\n');
      return;
    }
    let si = 0;
    const typeSnippet = () => {
      const snip = snippets[si];
      if (fileEl) fileEl.textContent = snip.file;
      const lines = snip.lines;
      let li = 0;
      const writeLine = () => {
        if (li >= lines.length) {
          setTimeout(() => { si = (si + 1) % snippets.length; el.innerHTML = ''; typeSnippet(); }, hold);
          return;
        }
        const full = lines[li];
        let ci = 0;
        const tick = () => {
          el.innerHTML = lines.slice(0, li).join('\n') + (li ? '\n' : '') + full.slice(0, ci) + '<span class="caret">▋</span>';
          ci++;
          if (ci <= full.length) setTimeout(tick, speed);
          else { li++; setTimeout(writeLine, 220); }
        };
        tick();
      };
      writeLine();
    };
    typeSnippet();
  }

  codeRotator(document.getElementById('codeStream'), document.getElementById('codeFile'), [
    { file: 'eligibility_service.py', lines: [
      '<span class="c"># Citizen benefits — eligibility API</span>',
      '<span class="k">def</span> <span class="f">check_eligibility</span>(applicant):',
      '    <span class="k">if</span> applicant.income &lt; THRESHOLD:',
      '        <span class="k">return</span> <span class="s">"approved"</span>',
      '    <span class="k">return</span> <span class="s">"manual_review"</span>'
    ]},
    { file: 'main.tf', lines: [
      '<span class="c"># Gov-cloud infrastructure as code</span>',
      '<span class="k">resource</span> <span class="s">"aws_vpc"</span> <span class="s">"gov"</span> {',
      '  cidr_block = <span class="s">"10.0.0.0/16"</span>',
      '  tags = { Compliance = <span class="s">"FedRAMP"</span> }',
      '}'
    ]},
    { file: 'CitizenController.java', lines: [
      '<span class="c">// Secure citizen records service</span>',
      '<span class="k">@GetMapping</span>(<span class="s">"/records/{id}"</span>)',
      '<span class="k">public</span> Record <span class="f">get</span>(<span class="k">@PathVariable</span> Long id) {',
      '  <span class="k">return</span> service.findSecure(id);',
      '}'
    ]},
    { file: 'pipeline.yml', lines: [
      '<span class="c"># Compliant CI/CD pipeline</span>',
      '<span class="k">stages</span>: [build, scan, deploy]',
      '<span class="k">deploy</span>:',
      '  <span class="f">environment</span>: <span class="s">gov-cloud</span>',
      '  <span class="f">approval</span>: required'
    ]}
  ], { speed: 24, hold: 2400 });

  /* ---------- SHOWCASE EDITOR + TERMINAL ---------- */
  const editorEl = document.getElementById('editorStream');
  const termEl = document.getElementById('terminal');
  const editorLines = [
    '<span class="c"># pipeline.yml</span>',
    '<span class="k">stages</span>: [build, test, scan, deploy]',
    '<span class="k">deploy</span>:',
    '  <span class="f">environment</span>: gov-cloud',
    '  <span class="f">approval</span>: required',
    '',
    '<span class="c"># main.tf</span>',
    '<span class="k">resource</span> <span class="s">"aws_instance"</span> <span class="s">"app"</span> {',
    '  ami           = var.hardened_ami',
    '  instance_type = <span class="s">"m6i.large"</span>',
    '  <span class="f">tags</span> = { Compliance = <span class="s">"FISMA"</span> }',
    '}'
  ];

  const termLines = [
    '$ ci deploy --env gov-cloud',
    '=== Deploying 14 components...',
    'Build &amp; unit tests .... <span class="okk">✓</span>',
    'Security scan ......... <span class="okk">✓ 0 critical</span>',
    'Terraform apply ....... <span class="okk">✓</span>',
    'Compliance checks ..... <span class="okk">FedRAMP · FISMA</span>',
    '<span class="okk">Deploy succeeded.</span> Build is green.'
  ];

  function runTerminal() {
    if (!termEl || reduce) { if (termEl) termEl.innerHTML = termLines.join('<br>'); return; }
    let i = 0;
    termEl.innerHTML = '';
    const next = () => {
      if (i >= termLines.length) { setTimeout(() => { termEl.innerHTML = ''; i = 0; next(); }, 3000); return; }
      termEl.innerHTML += (i ? '<br>' : '') + termLines[i];
      i++;
      setTimeout(next, 520);
    };
    next();
  }

  // start editor + terminal only when visible
  if (editorEl) {
    const sio = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        typer(editorEl, editorLines, { speed: 14, linePause: 120, endPause: 4000 });
        runTerminal();
        sio.disconnect();
      });
    }, { threshold: 0.3 });
    sio.observe(editorEl);
  }

  // caret + terminal accent styles injected
  const st = document.createElement('style');
  st.textContent = '.caret{color:#34e6a0;animation:blink 1s steps(1) infinite}@keyframes blink{50%{opacity:0}}.okk{color:#34e6a0}';
  document.head.appendChild(st);

  /* ---------- CASE STUDY SLIDESHOW ---------- */
  const CASES = [
    { cat: 'Cloud Migration', title: 'In-house Orchestration Layer', desc: 'A leading national health insurer needed a partner to migrate on-premises applications to a cloud infrastructure compatible with AWS, Azure and Google Cloud.', url: 'https://www.prutech.com/us/case-studies/cloud-migration/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/08/case-cloud-migration.png' },
    { cat: 'Salesforce Solution', title: 'Legal Defense Trust Portal', desc: 'An independent agency of a major city needed a secure, mobile-friendly, Salesforce-powered portal to uphold ethical standards and ensure public integrity.', url: 'https://www.prutech.com/us/case-studies/salesforce-solution/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/09/Salesforce-Solution-update.png' },
    { cat: 'Public Engagement', title: 'Salesforce Mobile Applications', desc: 'A city-level public engagement unit needed custom, Salesforce-powered iOS mobile apps to improve services for both citizens and staff.', url: 'https://www.prutech.com/us/case-studies/public-engagement/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/08/case-publicengagement.png' },
    { cat: 'Compliance Management', title: 'Mobile Inspection Application', desc: 'A city government agency partnered with PruTech on a Microsoft Dynamics-powered, fully mobile inspection management solution that protects consumers.', url: 'https://www.prutech.com/us/case-studies/compliance-management/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/05/img-comp.png' },
    { cat: 'Data Analysis', title: 'AWS Data Lake', desc: 'A division of a mayoral office built an integrated data platform to analyze the impacts of COVID-19, reduce inequality and promote economic opportunity.', url: 'https://www.prutech.com/us/case-studies/data-analysis/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/06/data-ana-update-img.png' },
    { cat: 'Pandemic Response', title: 'Rapid Response Data Catalog', desc: 'A mayoral office partnered with PruTech to build a standalone data catalog supporting community-focused COVID-19 recovery efforts.', url: 'https://www.prutech.com/us/case-studies/pandemic-response/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/05/CASE-STUDIES_individual_flattened_19.png' },
    { cat: 'Financial Management', title: 'Dynamic Public Portal', desc: 'A city agency partnered with PruTech on an MS Dynamics solution that protects urban communities through effective financial counseling.', url: 'https://www.prutech.com/us/case-studies/financial-management/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/05/img-financial.png' },
    { cat: 'License Registration', title: 'Business Community Portal', desc: 'PruTech built a Salesforce solution that encourages online license registration and provides a communication channel for businesses.', url: 'https://www.prutech.com/us/case-studies/license-registration/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/05/License-Registration-Image.png' },
    { cat: 'Urban Planning', title: 'Public Search Portal', desc: 'A department of urban planning built a Microsoft Dynamics 365 platform from the ground up with an intuitive public search portal.', url: 'https://www.prutech.com/us/case-studies/urban-planning/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/09/Urban-Plannin-update.png' },
    { cat: 'Community Development', title: 'Participant Tracking System', desc: 'A city department of community development built a case tracking system making it easier for contractors to serve participants of activities.', url: 'https://www.prutech.com/us/case-studies/community-development/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/06/community-update-img-1.png' },
    { cat: 'Remote Learning', title: 'Parent-Friendly Application', desc: 'A government education department created a user-friendly app letting parents communicate with schools and track devices for remote learning.', url: 'https://www.prutech.com/us/case-studies/remote-learning/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/06/remote-update-img.png' },
    { cat: 'Cloud Security', title: 'Modernized AWS Environment', desc: 'A boutique travel agency modernized its cloud infrastructure with PruTech, achieving consistent uptime and a stronger security posture.', url: 'https://www.prutech.com/us/case-studies/cloud-security/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/06/cloud-updated-img.png' },
    { cat: 'Economic Equality', title: 'Master Data Management Upgrade', desc: 'A mayoral office upgraded its IBM Master Data Management system to create better master data records and promote wider economic opportunity.', url: 'https://www.prutech.com/us/case-studies/economic-equality/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/08/case-economic-equality.png' },
    { cat: 'Data Security', title: 'Real-Time PII Protection', desc: 'A leading builder of marketing platforms installed a Privacera solution that automatically recognizes and protects personally identifiable information.', url: 'https://www.prutech.com/us/case-studies/data-security/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/09/case-Data-Security.png' },
    { cat: 'Marketing Communications', title: 'AWS Pinpoint Service', desc: 'A publisher of peer-reviewed science journals implemented an AWS solution to improve email campaigns targeting their global network.', url: 'https://www.prutech.com/us/case-studies/marketing-communications/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/06/marketing-updated-img.png' },
    { cat: 'Transforming Operations', title: 'Citizen Self-Service Tool', desc: "A major city's department of consumer and worker protection created a more efficient way to interact with consumers and the businesses they serve.", url: 'https://www.prutech.com/us/case-studies/transforming-operations/', img: 'https://www.prutech.com/us/wp-content/uploads/2023/08/case-transforming-operations.png' }
  ];

  const track = document.getElementById('sliderTrack');
  const dotsWrap = document.getElementById('slideDots');
  if (track) {
    CASES.forEach((c, i) => {
      const s = document.createElement('article');
      s.className = 'slide' + (i === 0 ? ' active' : '');
      s.innerHTML = `<div class="slide__bg" style="background-image:url('${c.img}')"></div>
        <div class="slide__body">
          <span class="slide__cat">${c.cat}</span>
          <h3 class="slide__title">${c.title}</h3>
          <p class="slide__desc">${c.desc}</p>
          <a class="slide__link" href="${c.url}" target="_blank" rel="noopener">Learn more →</a>
        </div>`;
      track.appendChild(s);

      const d = document.createElement('button');
      d.className = i === 0 ? 'active' : '';
      d.setAttribute('aria-label', 'Go to ' + c.cat);
      d.addEventListener('click', () => go(i, true));
      dotsWrap.appendChild(d);
    });

    const slides = [...track.children];
    const dots = [...dotsWrap.children];
    const total = slides.length;
    let idx = 0, timer = null, playing = !reduce;
    const DELAY = 7000;

    function go(n, user) {
      slides[idx].classList.remove('active');
      dots[idx].classList.remove('active');
      idx = (n + total) % total;
      slides[idx].classList.add('active');
      dots[idx].classList.add('active');
      if (user) restart();
    }
    const next = () => go(idx + 1);
    const prev = () => go(idx - 1);
    function start() { if (playing) { timer = setInterval(next, DELAY); } }
    function stop() { clearInterval(timer); }
    function restart() { stop(); start(); }

    document.getElementById('slideNext').addEventListener('click', () => next());
    document.getElementById('slidePrev').addEventListener('click', () => prev());

    const sliderEl = document.getElementById('slider');
    sliderEl.tabIndex = 0;
    sliderEl.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
    let sx = 0;
    track.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    }, { passive: true });

    start();
  }
})();
