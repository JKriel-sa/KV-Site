/* ==========================================================================
   Proposal generator — the universal client intake
   _shared/00-global-spec.md §3. Identical across all four services on purpose:
   the same field ids everywhere means the four inboxes stay comparable.

   Deliberately short. This is the least interesting part of the form to fill
   in and the easiest place to lose someone, so it asks only what we need to
   reply to them and what changes the price. Role, budget band, decision
   timeline and referral source were all dropped: none fed a formula, and four
   extra questions at the front cost more enquiries than they ever returned.
   ========================================================================== */
window.PG_INTAKE = {
  title: 'Your details',
  short: 'Details',
  note: 'Six questions, then on to the interesting part.',
  fields: [
    { id: 'client_name', label: 'Your name', type: 'text', req: 1, half: 1,
      autocomplete: 'name' },
    { id: 'client_company', label: 'Company', type: 'text', half: 1,
      autocomplete: 'organization' },
    { id: 'client_email', label: 'Email', type: 'email', req: 1, half: 1,
      autocomplete: 'email' },
    { id: 'client_phone', label: 'Phone', type: 'tel', req: 1, half: 1,
      autocomplete: 'tel' },

    { id: 'project_name', label: 'Project name', type: 'text', req: 1, half: 1,
      placeholder: 'What should we call this?' },
    { id: 'target_completion_date', label: 'When do you need it by?', type: 'date',
      req: 1, half: 1 },

    { id: 'project_summary', label: 'Tell us about it', type: 'textarea', req: 1,
      rows: 3,
      help: 'A couple of sentences is plenty.' },

    { id: 'client_status', label: 'Have we worked together before?', type: 'select',
      half: 1,
      help: 'Asked only because it can lower the price.',
      opts: [
        ['new', 'First time'],
        ['returning', 'We have worked together before'],
        ['bundle', 'Part of a multi-service project'],
        ['non_profit', 'We are a registered non-profit']
      ] }
  ]
};
