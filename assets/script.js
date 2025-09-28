(function(){
  // Theme
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if(saved === 'light') root.classList.add('light');
  document.getElementById('themeToggle').addEventListener('click', ()=>{
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Publications load
  const pubList = document.getElementById('pubList');
  const yearFilter = document.getElementById('yearFilter');
  const venueFilter = document.getElementById('venueFilter');
  const search = document.getElementById('pubSearch');
  const bibToggle = document.getElementById('bibtexToggle');
  let pubs = [], showBib=false;

  fetch('assets/publications.json')
    .then(r=>r.json())
    .then(data=>{
      pubs = data;
      // build filters
      const years = [...new Set(pubs.map(p=>p.year))].sort((a,b)=>b-a);
      years.forEach(y=>{ const o=document.createElement('option'); o.value=o.textContent=y; yearFilter.appendChild(o); });
      const venues = [...new Set(pubs.map(p=>p.venue))].sort();
      venues.forEach(v=>{ const o=document.createElement('option'); o.value=o.textContent=v; venueFilter.appendChild(o); });
      render();
    });

  function render(){
    const q = search.value.toLowerCase();
    const yf = yearFilter.value; const vf = venueFilter.value;
    const filtered = pubs.filter(p=>
      (!yf || String(p.year)===yf) &&
      (!vf || p.venue===vf) &&
      (!q || (p.title+p.venue+p.authors.join(' ')).toLowerCase().includes(q))
    ).sort((a,b)=>b.year-a.year);

    pubList.innerHTML = '';
    filtered.forEach(p=>{
      const li = document.createElement('li');
      li.className = 'pub';
      const left = document.createElement('div');
      const right = document.createElement('div'); right.className='pub-actions';

      left.innerHTML = `
        <div><strong>${p.title}</strong></div>
        <div class="meta">${p.authors.join(', ')}</div>
        <div class="meta">${p.venue} (${p.year}) ${p.award?`<span class="badge">${p.award}</span>`:''}</div>
        ${showBib && p.bibtex ? `<pre class="meta">${escapeHtml(p.bibtex)}</pre>`: ''}
      `;

      right.innerHTML = `
        ${p.pdf?`<a href="${p.pdf}" target="_blank" rel="noreferrer">PDF</a>`:''}
        ${p.code?`<a href="${p.code}" target="_blank" rel="noreferrer">Code</a>`:''}
        ${p.video?`<a href="${p.video}" target="_blank" rel="noreferrer">Video</a>`:''}
        ${p.doi?`<a href="${p.doi}" target="_blank" rel="noreferrer">DOI</a>`:''}
      `;

      li.appendChild(left); li.appendChild(right); pubList.appendChild(li);
    });
  }

  function escapeHtml(s){ return s.replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  search.addEventListener('input', render);
  yearFilter.addEventListener('change', render);
  venueFilter.addEventListener('change', render);
  bibToggle.addEventListener('click', ()=>{ showBib=!showBib; bibToggle.textContent = showBib? 'Hide BibTeX':'Show BibTeX'; render(); });

  // Projects (optional static examples)
  const projects = [
    {title:'SoleFormer', img:'https://picsum.photos/seed/sole/800/400', desc:'Foot-pressure based 3D pose estimation.', link:'#'},
    {title:'SkiTech Dataset', img:'https://picsum.photos/seed/ski/800/400', desc:'Multimodal skiing dataset (video+pressure).', link:'#'},
    {title:'SimDiff', img:'https://picsum.photos/seed/diff/800/400', desc:'Diffusion-based simulation for skill learning.', link:'#'}
  ];
  const grid = document.getElementById('projectGrid');
  projects.forEach(p=>{
    const div = document.createElement('div');
    div.className='cardish';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <p><a href="${p.link}">Learn more →</a></p>
    `;
    grid.appendChild(div);
  });
})();