import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { addBusinessDays, buildWelcomeKit, parseList } from '../src/generator.js';

describe('WelcomeKit generator', () => {
  it('parses comma and newline separated lists', () => {
    assert.deepEqual(parseList('Logo files, CMS login\nAnalytics access'), ['Logo files', 'CMS login', 'Analytics access']);
  });

  it('adds business days while skipping weekends', () => {
    assert.equal(addBusinessDays('2026-05-15', 1), '2026-05-18');
    assert.equal(addBusinessDays('2026-05-15', 5), '2026-05-22');
  });

  it('builds a complete kit with custom values', () => {
    const kit = buildWelcomeKit({
      projectType: 'operations',
      businessName: 'Ops Studio',
      clientName: 'Client LLC',
      projectName: 'Automation cleanup',
      ownerName: 'Taylor',
      startDate: '2026-06-01',
      timelineDays: '10',
      responseWindow: '1',
      contactEmail: 'taylor@example.com',
      deliverables: 'Workflow map, Handoff guide',
      accessItems: 'Zapier invite\nSample data'
    });

    assert.equal(kit.endDate, '2026-06-15');
    assert.match(kit.markdown, /Automation cleanup Welcome Kit/);
    assert.match(kit.markdown, /\[ \] Workflow map/);
    assert.match(kit.kickoffEmail, /Subject: Automation cleanup kickoff/);
    assert.match(kit.kickoffEmail, /feedback within 1 business day/);
  });
});
