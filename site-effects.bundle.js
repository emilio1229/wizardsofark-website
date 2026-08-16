(function(){
  'use strict';

  // Respect reduced motion & mobile: bail early
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width:720px)').matches;
  if(prefersReduced || isMobile){
    document.documentElement.classList.add('site-with-sides');
    // expose minimal API
    window.__WIZARDS_ANIM = { disable: ()=>{}, enable: ()=>{} };
    return;
  }

  const css = getComputedStyle(document.documentElement);
  const maxOrbs = parseInt(css.getPropertyValue('--max-orbs-desktop')) || 12;
  const maxOrbsMobile = parseInt(css.getPropertyValue('--max-orbs-mobile')) || 5;
  const orbCount = isMobile ? maxOrbsMobile : maxOrbs;

  // Create orb layer
  const orbLayer = document.createElement('div'); orbLayer.className = 'orb-layer'; document.body.appendChild(orbLayer);
  const orbs = [];
  for(let i=0;i<orbCount;i++){
    const el = document.createElement('div'); el.className = 'orb' + (Math.random()>0.6 ? ' small' : ''); orbLayer.appendChild(el);
    orbs.push({ el, x: Math.random()*innerWidth, y: Math.random()*innerHeight, vx:(Math.random()-0.5)*0.12, vy:(Math.random()-0.5)*0.06, scale:0.6+Math.random()*0.9 });
  }

  function placeOrbs(){
    orbs.forEach(o=>{
      o.el.style.left = o.x + 'px';
      o.el.style.top = o.y + 'px';
      o.el.style.opacity = (0.06 + Math.random()*0.12).toFixed(2);
      o.el.style.transform = `translate3d(-50%,-50%,0) scale(${o.scale})`;
    });
  }
  placeOrbs();

  let last = performance.now(), rafId;
  function tick(now){
    const dt = Math.min(40, now - last); last = now;
    orbs.forEach(o=>{
      o.x += o.vx*dt; o.y += o.vy*dt;
      if(o.x < -120) o.x = innerWidth + 120; if(o.x > innerWidth + 120) o.x = -120;
      if(o.y < -120) o.y = innerHeight + 120; if(o.y > innerHeight + 120) o.y = -120;
      const bob = Math.sin((now/1000) + (o.x*0.001)) * 6;
      o.el.style.left = (o.x) + 'px';
      o.el.style.top = (o.y + bob) + 'px';
    });
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  // Cursor glow
  const cursor = document.createElement('div'); cursor.className = 'cursor-glow'; document.body.appendChild(cursor);
  document.addEventListener('mousemove', e=>{ cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; cursor.style.opacity = 0.9; }, {passive:true});

  // Side runes
  function makeSide(side){
    const container = document.createElement('div'); container.className = 'side-rune ' + side;
    const stack = document.createElement('div'); stack.className = 'rune-stack';
    for(let i=0;i<6;i++){ const r = document.createElement('div'); r.className = 'rune'; stack.appendChild(r); }
    container.appendChild(stack); document.body.appendChild(container);
  }
  makeSide('left'); makeSide('right');

  // Rune trail
  const trail = document.createElement('div'); trail.className = 'rune-trail';
  for(let i=0;i<3;i++){ const g = document.createElement('div'); g.className = 'trail-glyph'; trail.appendChild(g); }
  document.body.appendChild(trail);

  let lastScroll = window.scrollY;
  window.addEventListener('scroll', ()=>{
    const dy = Math.abs(window.scrollY - lastScroll);
    if(dy > 8){ trail.classList.add('pop'); clearTimeout(window._runePop); window._runePop = setTimeout(()=>trail.classList.remove('pop'), 420); }
    lastScroll = window.scrollY;
  }, {passive:true});

  // Visibility handling
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){ cancelAnimationFrame(rafId); orbLayer.style.display = 'none'; cursor.style.display = 'none'; }
    else { orbLayer.style.display = ''; cursor.style.display = ''; rafId = requestAnimationFrame(tick); }
  });

  // Lightbox hookup (defensive)
  window.addEventListener('load', ()=>{
    document.querySelectorAll('.home-gallery a').forEach(a=>{ a.onclick = (e)=>{ e.stopPropagation(); }; });
    if(window.lightbox && typeof lightbox.option === 'function'){
      lightbox.option({ resizeDuration: 150, wrapAround: true, fadeDuration: 150, imageFadeDuration: 150, positionFromTop: 50 });
    }
  });

  // Expose a simple API to toggle animations
  window.__WIZARDS_ANIM = {
    disable: ()=>{
      cancelAnimationFrame(rafId);
      orbLayer.remove();
      cursor.remove();
      document.querySelectorAll('.side-rune, .rune-trail').forEach(n=>n.remove());
    },
    enable: ()=>{ location.reload(); }
  };

  // mark document for CSS fallbacks
  document.documentElement.classList.add('site-with-sides');
})();
