/* ===== PruTech Salesforce — project popup (modal) ===== */
(() => {
  'use strict';
  const modal = document.getElementById('briefModal');
  if (!modal) return;
  const body = document.getElementById('briefModalBody');

  const P = {
    'aging-services': {
      cat: 'Aging Services', sector: 'State & Local', built: 'Salesforce Government Cloud Plus',
      title: 'Aging Services CRM',
      tag: 'Unified platform for aging-services coordination across provider networks.',
      overview: 'Agencies configure permissions and forms, providers deliver services through modern interfaces, and seniors manage their own profiles. The system handles intake, assessments, enrollment, service tracking, referrals and compliance — connecting staff, hundreds of providers and hundreds of thousands of constituents.',
      stats: [['834','Providers'],['300K','Seniors served'],['27','Program types']],
      caps: ['Agency admin for provider permissions and forms','Dynamic forms that adapt to programs','Multi-program enrollment with referrals','Service-unit tracking for reimbursement','QR code check-in at centers and events','Senior self-service portal'],
      whys: ['Agency ownership enables fast updates','Unified data improves reporting','Modern interfaces boost productivity','Automated workflows cut manual effort','Audit trails ensure compliance','Scales local to statewide'],
      pdf: 'SF%20Projects%20Data/PruTech_SolutionBrief_Aging-Services_Client-Relationship-Management.pdf',
      page: 'sf-projects/aging-services.html'
    },
    'call-center': {
      cat: 'Call Center Operations', sector: 'Federal', built: 'Salesforce Service Cloud',
      title: 'Call Center Operations Platform',
      tag: 'Transform operations with unified case management for government service delivery.',
      overview: 'Call-center teams manage complex workflows — contact verification, medical screening, document validation and multi-stakeholder coordination. Agents get unified access to cases and family relationships, with omnichannel routing and full interaction history across the service lifecycle.',
      stats: [['Omni','Channel routing'],['Real-time','Dashboards'],['Service Cloud','Platform']],
      caps: ['Unified case management with family grouping','Omnichannel routing & workload distribution','Medical screening workflow integration','Multi-stage status tracking','Document validation tools','Language-based agent routing'],
      whys: ['Reduce processing time','Improve service quality through visibility','Ensure compliance with audit trails','Enable data-driven decisions','Scale without added overhead','Maintain complete interaction history'],
      pdf: 'SF%20Projects%20Data/PruTech_SolutionBrief_CallCenter-Operations.pdf',
      page: 'sf-projects/call-center.html'
    },
    'early-childhood': {
      cat: 'Education', sector: 'State & Local', built: 'Salesforce Public Sector Solutions',
      title: 'Early Childhood Education Management',
      tag: 'Comprehensive platform for managing early-childhood programs from provider to student.',
      overview: 'Unifies provider management, contract administration, budget oversight, enrollment, attendance and invoice reconciliation into one system. Providers use self-service portals while agencies keep full oversight with automated workflows, compliance monitoring and integration with student, eligibility and financial systems.',
      stats: [['5M+','Records migrated'],['18','Integrated modules'],['4','Legacy systems consolidated']],
      caps: ['Provider contract and budget management','Student enrollment and attendance tracking','Automated invoice processing','Developmental screening submission','Incident reporting workflows','Seat-capacity planning'],
      whys: ['Eliminate manual data entry','Accelerate provider payments','Ensure regulatory compliance','Improve transparency','Enable data-driven decisions','Scale local to statewide'],
      pdf: 'SF%20Projects%20Data/PruTech_SolutionBrief_Early-Childhood-Education-Management%201.pdf',
      page: 'sf-projects/early-childhood.html'
    },
    'evidence-tracking': {
      cat: 'Justice', sector: 'State', built: 'Salesforce Service Cloud',
      title: 'Evidence Management & Tracking',
      tag: 'Complete evidence lifecycle management for labs, victim services and law enforcement.',
      overview: 'End-to-end tracking with complete chain of custody from collection through long-term retention. Role-based access serves six personas, and an anonymous victim portal with PIN-based access lets individuals track status without login. Barcode/QR integration and automated notifications keep everything efficient and victim-centered.',
      stats: [['100%','Compliance achieved'],['7,000+','Items tracked'],['1,000+','User accounts']],
      caps: ['Chain of custody with identity & timestamps','Anonymous PIN-based victim portal','Barcode/QR scanning with wireless','Role-based access for six personas','Automated email & SMS notifications','Precise warehouse location tracking'],
      whys: ['Meet legislative retention mandates','Eliminate paper-based tracking','Empower victims with transparency','Ensure compliance with audit trails','Support trauma-informed care','Scale across facilities'],
      pdf: 'SF%20Projects%20Data/PruTech_SolutionBrief_EvidenceTrackingandManagement_.pdf',
      page: 'sf-projects/evidence-tracking.html'
    },
    'housing-placement': {
      cat: 'Housing', sector: 'State & Local', built: 'Salesforce Public Sector Solutions',
      title: 'Affordable Housing Placement',
      tag: 'Transform how your agency manages affordable housing from application to placement.',
      overview: 'Connects developers, agencies and residents in one ecosystem. Developers submit properties and manage applicant pools, agencies keep compliance oversight with automated approvals, and residents browse listings, apply and track status through a public portal.',
      stats: [['99%','Faster lottery'],['50%','More participation'],['35%','Fewer manual errors']],
      caps: ['Portal for property submissions & applications','Searchable public housing listings','Automated waitlist & lottery management','Compliance oversight dashboard','Multi-language & accessibility support','Application screening & document management'],
      whys: ['Increase transparency, cut processing time','Improve access for underserved communities','Provide equitable housing pathways','Ensure regulatory compliance','Reduce manual workload','Scale local to statewide'],
      pdf: 'SF%20Projects%20Data/PruTech_SolutionBrief_HousingPlacement_.pdf',
      page: 'sf-projects/housing-placement.html'
    },
    'pbm-licensing': {
      cat: 'Regulatory', sector: 'State', built: 'Salesforce Public Sector Solutions',
      title: 'PBM Licensing & Permitting',
      tag: 'Transform regulatory oversight with digital licensing and automated compliance workflows.',
      overview: 'Modernizes pharmacy benefit manager licensing and permitting. Organizations apply online, communicate with reviewers in real time and track status. Agencies gain automated routing, dual-level reviews with audit trails and SSO — covering applications through renewals, annual assessments and profile updates.',
      stats: [['85%','Faster processing'],['100%','Digital applications'],['90%','Less manual work']],
      caps: ['Online application portal with documents','Automated two-level review workflows','Real-time applicant–staff communication','Integrated payment processing','SSO for secure agency access','Digital license generation'],
      whys: ['Eliminate paper workflows','Accelerate approvals','Improve transparency','Reduce staff burden','Ensure compliance with audit trails','24/7 access for applicants'],
      pdf: 'SF%20Projects%20Data/PruTech_SolutionBrief_PBM-Licensing-Permitting_.pdf',
      page: 'sf-projects/pbm-licensing.html'
    },
    'public-engagement': {
      cat: 'Public Health', sector: 'Local', built: 'Salesforce',
      title: 'Case Management & Canvassing',
      tag: 'Transform public outreach and service delivery with unified case management and field operations.',
      overview: 'Unifies case management, mobile canvassing and analytics. Field teams run door-to-door outreach with native mobile apps and offline mapping, case managers track full client lifecycles, and leaders get real-time dashboards and integrated analytics.',
      stats: [['65%','Faster data entry'],['3X','System consolidation'],['290+','Concurrent users']],
      caps: ['Native iOS app with offline mapping','Complete case lifecycle tracking','ESRI mapping & geocoding integration','Appointment scheduling with providers','Configurable surveys & forms','Role-based hierarchical security'],
      whys: ['Eliminate manual coordination','Enable offline field operations','Track outreach to outcomes','Ensure HIPAA compliance','Integrate existing platforms','Scale to hundreds of users'],
      pdf: 'SF%20Projects%20Data/PruTech_SolutionBrief_PublicEngagementUnit.pdf',
      page: 'sf-projects/public-engagement.html'
    },
    'regulatory-licensing': {
      cat: 'Regulatory', sector: 'State', built: 'Salesforce Experience Cloud',
      title: 'Regulatory Licensing Portal',
      tag: 'Transform licensing operations with digital self-service and automated workflows.',
      overview: 'Agencies modernize licensing and regulatory operations. Regulated entities apply online with dynamic forms, document management and payments. Staff get structured data for compliance review and enforcement, and a template-based module deploys new license types without custom development.',
      stats: [['Self-service','Portal'],['Template','Configuration'],['Experience Cloud','Platform']],
      caps: ['Online registration & self-service','Dynamic forms with document management','Integrated payment processing','Structured data for compliance review','Enforcement & reporting tools','Template-based new license types'],
      whys: ['Eliminate paper & manual entry','Deploy license types without code','Accelerate review cycles','Improve applicant transparency','Ensure compliant records','24/7 self-service access'],
      pdf: 'SF%20Projects%20Data/PruTech_SolutionBrief_Regulatory-Licensing-Portal.pdf',
      page: 'sf-projects/regulatory-licensing.html'
    }
  };

  const li = a => a.map(x => `<li>${x}</li>`).join('');
  const st = a => a.map(s => `<div><b>${s[0]}</b><span>${s[1]}</span></div>`).join('');

  function open(slug) {
    const p = P[slug];
    if (!p) return;
    body.innerHTML =
      `<span class="modal__cat">${p.cat} &middot; ${p.sector}</span>
       <h3>${p.title}</h3>
       <p class="modal__tag">${p.tag}</p>
       <p class="modal__built">Built on ${p.built}</p>
       <p class="modal__overview">${p.overview}</p>
       <div class="modal__stats">${st(p.stats)}</div>
       <div class="modal__cols">
         <div><h4>Key capabilities</h4><ul class="ticks">${li(p.caps)}</ul></div>
         <div><h4>Why it matters</h4><ul class="ticks">${li(p.whys)}</ul></div>
       </div>
       <div class="modal__cta">
         <a class="btn" href="${p.pdf}" target="_blank" rel="noopener">Download full brief (PDF)</a>
         <a class="btn btn--ghost" href="${p.page}">Open full page</a>
       </div>`;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close() { modal.hidden = true; document.body.style.overflow = ''; }

  /* popup disabled — project cards now navigate straight to their detail page via their href */

  /* ---- projects strip: constant speed + auto-center when few items ---- */
  const wrap = document.querySelector('.brief-marquee');
  const track = document.querySelector('.brief-marquee__track');
  const SPEED = 95; // pixels per second

  function updateMarquee() {
    if (!wrap || !track) return;
    wrap.classList.remove('is-static');
    const half = track.scrollWidth / 2;
    if (half <= wrap.clientWidth + 4) {
      wrap.classList.add('is-static');            // fits on screen → stop & center
    } else {
      track.style.animationDuration = (half / SPEED).toFixed(1) + 's';
    }
  }

  /* ---- filter the projects strip by government level ---- */
  const filters = document.getElementById('briefFilters');
  if (filters) {
    const LEVELS = {
      'aging-services': ['state', 'local'],
      'call-center': ['federal'],
      'early-childhood': ['state', 'local'],
      'evidence-tracking': ['state'],
      'housing-placement': ['state', 'local'],
      'pbm-licensing': ['state'],
      'public-engagement': ['local'],
      'regulatory-licensing': ['state']
    };
    const cards = [...document.querySelectorAll('.brief-marquee .brief[data-slug]')];
    const tabs = [['all', 'All work'], ['federal', 'Federal'], ['state', 'State'], ['local', 'Local']];
    tabs.forEach(([key, label], i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      if (i === 0) b.className = 'active';
      b.addEventListener('click', () => {
        [...filters.children].forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        cards.forEach(c => {
          const lv = LEVELS[c.dataset.slug] || [];
          c.style.display = (key === 'all' || lv.includes(key)) ? '' : 'none';
        });
        updateMarquee();
      });
      filters.appendChild(b);
    });
  }

  updateMarquee();
  addEventListener('resize', updateMarquee);
})();
