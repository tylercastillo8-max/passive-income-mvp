const DEFAULT_PHASES = [
  'Kickoff and access collection',
  'Discovery and priorities review',
  'First draft or implementation pass',
  'Feedback window',
  'Final delivery and handoff'
];

const SERVICE_PRESETS = {
  web: {
    label: 'Website or landing page project',
    deliverables: ['Project brief', 'Sitemap or page list', 'Design direction', 'Launch checklist', 'Post-launch handoff notes'],
    access: ['Domain/DNS login or invite', 'Website/CMS login', 'Brand assets', 'Analytics/Search Console access if available'],
    questions: ['What pages are required for launch?', 'Who approves copy and design?', 'What action should visitors take first?']
  },
  marketing: {
    label: 'Marketing campaign or content project',
    deliverables: ['Campaign goal summary', 'Audience notes', 'Content calendar', 'Draft review tracker', 'Performance recap'],
    access: ['Brand guidelines', 'Social or email platform invite', 'Past campaign examples', 'Approved offers and promotions'],
    questions: ['What audience segment matters most?', 'What tone should the campaign use?', 'Which metric defines success?']
  },
  operations: {
    label: 'Operations, automation, or internal systems project',
    deliverables: ['Workflow map', 'Tool inventory', 'Automation checklist', 'Testing notes', 'Admin handoff guide'],
    access: ['Tool logins or admin invites', 'Current SOPs', 'Sample data', 'List of team stakeholders'],
    questions: ['Which manual step is most painful?', 'Who owns the process after handoff?', 'What edge cases should be tested?']
  }
};

export function normalizeText(value, fallback = '') {
  const text = String(value || '').trim().replace(/\s+/g, ' ');
  return text || fallback;
}

export function parseList(value) {
  return String(value || '')
    .split(/\n|,/)
    .map((item) => normalizeText(item))
    .filter(Boolean);
}

export function addBusinessDays(startDate, businessDays) {
  const date = new Date(`${startDate}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  let remaining = Number(businessDays) || 0;
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    const day = date.getUTCDay();
    if (day !== 0 && day !== 6) {
      remaining -= 1;
    }
  }

  return date.toISOString().slice(0, 10);
}

export function formatDate(value) {
  if (!value) return 'TBD';
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return 'TBD';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export function buildWelcomeKit(input = {}) {
  const preset = SERVICE_PRESETS[input.projectType] || SERVICE_PRESETS.web;
  const businessName = normalizeText(input.businessName, 'Your Studio');
  const clientName = normalizeText(input.clientName, 'Client');
  const projectName = normalizeText(input.projectName, preset.label);
  const ownerName = normalizeText(input.ownerName, 'Project lead');
  const startDate = normalizeText(input.startDate, new Date().toISOString().slice(0, 10));
  const timelineDays = Math.max(5, Math.min(90, Number(input.timelineDays) || 15));
  const customDeliverables = parseList(input.deliverables);
  const customAccess = parseList(input.accessItems);
  const deliverables = customDeliverables.length ? customDeliverables : preset.deliverables;
  const accessItems = customAccess.length ? customAccess : preset.access;
  const endDate = addBusinessDays(startDate, timelineDays);
  const midpointDate = addBusinessDays(startDate, Math.ceil(timelineDays / 2));
  const responseWindow = Math.max(1, Math.min(10, Number(input.responseWindow) || 2));
  const contactEmail = normalizeText(input.contactEmail, 'hello@example.com');

  const phases = DEFAULT_PHASES.map((phase, index) => ({
    title: phase,
    date: index === 0 ? startDate : addBusinessDays(startDate, Math.ceil((timelineDays / (DEFAULT_PHASES.length - 1)) * index))
  }));

  return {
    businessName,
    clientName,
    projectName,
    ownerName,
    projectTypeLabel: preset.label,
    startDate,
    endDate,
    midpointDate,
    responseWindow,
    contactEmail,
    deliverables,
    accessItems,
    questions: preset.questions,
    phases,
    kickoffEmail: buildKickoffEmail({ businessName, clientName, projectName, ownerName, startDate, contactEmail, responseWindow, accessItems }),
    markdown: buildMarkdown({ businessName, clientName, projectName, ownerName, startDate, endDate, midpointDate, responseWindow, contactEmail, deliverables, accessItems, questions: preset.questions, phases })
  };
}

function buildKickoffEmail({ businessName, clientName, projectName, ownerName, startDate, contactEmail, responseWindow, accessItems }) {
  return `Subject: ${projectName} kickoff — next steps\n\nHi ${clientName},\n\nI'm excited to get started on ${projectName} with you. Our target kickoff date is ${formatDate(startDate)}.\n\nTo keep everything moving, please send or invite me to the items below before kickoff:\n${accessItems.map((item) => `- ${item}`).join('\n')}\n\nDuring the project, feedback within ${responseWindow} business day${responseWindow === 1 ? '' : 's'} will help us stay on schedule.\n\nIf anything is unclear, reply here or email ${contactEmail}.\n\nThanks,\n${ownerName}\n${businessName}`;
}

function buildMarkdown({ businessName, clientName, projectName, ownerName, startDate, endDate, midpointDate, responseWindow, contactEmail, deliverables, accessItems, questions, phases }) {
  return `# ${projectName} Welcome Kit\n\nPrepared by **${businessName}** for **${clientName}**.\n\n## Project snapshot\n\n- Project lead: ${ownerName}\n- Kickoff date: ${formatDate(startDate)}\n- Target handoff: ${formatDate(endDate)}\n- Midpoint check-in: ${formatDate(midpointDate)}\n- Preferred response window: ${responseWindow} business day${responseWindow === 1 ? '' : 's'}\n- Contact: ${contactEmail}\n\n## Expected deliverables\n\n${deliverables.map((item) => `- [ ] ${item}`).join('\n')}\n\n## Access and assets needed\n\n${accessItems.map((item) => `- [ ] ${item}`).join('\n')}\n\n## Timeline\n\n${phases.map((phase) => `- **${formatDate(phase.date)}:** ${phase.title}`).join('\n')}\n\n## Kickoff questions\n\n${questions.map((question) => `- ${question}`).join('\n')}\n\n## Simple working agreement\n\n- Send feedback in one consolidated note when possible.\n- Flag blockers early so the schedule can be adjusted.\n- Keep final approvals in writing so everyone has the same record.\n\n---\nGenerated with WelcomeKit. This is an operational template, not legal, financial, tax, or professional advice.`;
}

export { SERVICE_PRESETS };
