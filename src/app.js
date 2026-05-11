import { buildWelcomeKit, SERVICE_PRESETS } from './generator.js';

const form = document.querySelector('[data-kit-form]');
const preview = document.querySelector('[data-preview]');
const emailPreview = document.querySelector('[data-email-preview]');
const copyMarkdownButton = document.querySelector('[data-copy-markdown]');
const copyEmailButton = document.querySelector('[data-copy-email]');
const downloadButton = document.querySelector('[data-download]');
const presetSelect = document.querySelector('#projectType');
const waitlistForm = document.querySelector('[data-waitlist-form]');
const waitlistMessage = document.querySelector('[data-waitlist-message]');

let currentKit = buildWelcomeKit();

function formDataToObject() {
  return Object.fromEntries(new FormData(form).entries());
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

function renderKit() {
  currentKit = buildWelcomeKit(formDataToObject());
  preview.innerHTML = markdownToHtml(currentKit.markdown);
  emailPreview.textContent = currentKit.kickoffEmail;
}

function markdownToHtml(markdown) {
  const lines = markdown.split('\n');
  let html = '';
  let inList = false;

  for (const line of lines) {
    if (line.startsWith('# ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2>${escapeHtml(line.slice(2))}</h2>`;
    } else if (line.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3>${escapeHtml(line.slice(3))}</h3>`;
    } else if (line.startsWith('- ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${escapeHtml(line.slice(2)).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`;
    } else if (line.trim() === '---') {
      if (inList) { html += '</ul>'; inList = false; }
      html += '<hr>';
    } else if (line.trim()) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p>${escapeHtml(line).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
    }
  }

  if (inList) html += '</ul>';
  return html;
}

async function copyText(text, button) {
  await navigator.clipboard.writeText(text);
  const original = button.textContent;
  button.textContent = 'Copied';
  setTimeout(() => { button.textContent = original; }, 1200);
}

function downloadMarkdown() {
  const filename = `${currentKit.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'welcome-kit'}.md`;
  const blob = new Blob([currentKit.markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function populatePresetHelp() {
  const help = document.querySelector('[data-preset-help]');
  const preset = SERVICE_PRESETS[presetSelect.value];
  help.textContent = preset ? `Default kit for: ${preset.label}` : '';
}

form.addEventListener('input', () => {
  populatePresetHelp();
  renderKit();
});

copyMarkdownButton.addEventListener('click', () => copyText(currentKit.markdown, copyMarkdownButton));
copyEmailButton.addEventListener('click', () => copyText(currentKit.kickoffEmail, copyEmailButton));
downloadButton.addEventListener('click', downloadMarkdown);

if (waitlistForm) {
  waitlistForm.addEventListener('submit', (event) => {
    event.preventDefault();
    waitlistMessage.textContent = 'Thanks — this static placeholder is ready to connect to your email provider before launch.';
    waitlistForm.reset();
  });
}

populatePresetHelp();
renderKit();
