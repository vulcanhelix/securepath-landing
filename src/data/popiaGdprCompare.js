// POPIA vs GDPR comparison content — drives /compare/popia-vs-gdpr/:topic pages.
export const compareTopics = [
  {
    slug: 'consent',
    name: 'Consent',
    seoDescription:
      'How consent requirements differ between POPIA and GDPR: definitions, opt-in standards, withdrawal, direct marketing, and children’s consent.',
    intro:
      'Both POPIA and GDPR treat consent as one lawful basis among several — not the default. But the standards for what counts as valid consent, and when you need it, differ in important ways.',
    rows: [
      {
        aspect: 'Definition',
        popia: 'Voluntary, specific and informed expression of will (s1). No explicit "unambiguous" requirement, but the Regulator interprets it strictly.',
        gdpr: 'Freely given, specific, informed and unambiguous indication by statement or clear affirmative action (Art 4(11)). Pre-ticked boxes invalid.',
      },
      {
        aspect: 'Burden of proof',
        popia: 'Responsible party must prove consent exists (s11(2)(b)).',
        gdpr: 'Controller must be able to demonstrate consent (Art 7(1)).',
      },
      {
        aspect: 'Withdrawal',
        popia: 'Data subject may withdraw consent at any time (s11(2)(b)); processing before withdrawal remains lawful.',
        gdpr: 'Withdrawal must be as easy as giving consent (Art 7(3)); processing before withdrawal remains lawful.',
      },
      {
        aspect: 'Direct marketing',
        popia: 'Electronic direct marketing to non-customers requires prior opt-in consent, requested once only via the prescribed Form 4 (s69).',
        gdpr: 'Governed with ePrivacy rules; soft opt-in for existing customers, otherwise consent. No prescribed form.',
      },
      {
        aspect: 'Children',
        popia: 'Processing a child’s personal information generally prohibited without competent person’s consent (s34–35). Child = under 18.',
        gdpr: 'Parental consent needed for information society services below age 16 (member states may lower to 13) (Art 8).',
      },
    ],
    takeaway:
      'If you market electronically in South Africa, POPIA’s section 69 opt-in and Form 4 mechanics are stricter than most GDPR-based playbooks assume. Map consent flows per jurisdiction rather than reusing an EU template.',
  },
  {
    slug: 'data-subject-rights',
    name: 'Data Subject Rights',
    seoDescription:
      'Data subject rights under POPIA vs GDPR compared: access, correction, deletion, objection, portability, and automated decision-making.',
    intro:
      'The two laws grant broadly similar rights, but GDPR goes further in several areas — notably portability and erasure — while POPIA ties several rights to its Promotion of Access to Information Act (PAIA) machinery.',
    rows: [
      {
        aspect: 'Access',
        popia: 'Right to confirmation and a copy of the record (s23), exercised via PAIA request procedures; a prescribed fee may apply.',
        gdpr: 'Right of access with a free first copy (Art 15); one month to respond.',
      },
      {
        aspect: 'Correction & deletion',
        popia: 'Right to correction, destruction or deletion of inaccurate, irrelevant, excessive, outdated or unlawfully obtained information (s24).',
        gdpr: 'Rectification (Art 16) plus the broader right to erasure / "right to be forgotten" (Art 17).',
      },
      {
        aspect: 'Objection',
        popia: 'Right to object on reasonable grounds to processing based on legitimate interests, and absolute right to object to direct marketing (s11(3)).',
        gdpr: 'Right to object to legitimate-interest processing and absolute objection right for direct marketing (Art 21).',
      },
      {
        aspect: 'Portability',
        popia: 'No express data portability right.',
        gdpr: 'Right to receive data in a structured, machine-readable format and transmit it (Art 20).',
      },
      {
        aspect: 'Automated decisions',
        popia: 'Protection against decisions based solely on automated processing that produce legal effects (s71).',
        gdpr: 'Similar protection with explicit safeguards and meaningful-information requirements (Art 22).',
      },
    ],
    takeaway:
      'A GDPR-grade rights programme will usually satisfy POPIA — but the PAIA request procedure, prescribed forms and fees are uniquely South African and need their own workflow.',
  },
  {
    slug: 'breach-notification',
    name: 'Breach Notification',
    seoDescription:
      'Breach notification duties under POPIA section 22 vs GDPR articles 33-34: thresholds, deadlines, and who must be told.',
    intro:
      'This is one of the sharpest differences between the two regimes: GDPR runs on a 72-hour clock, while POPIA says "as soon as reasonably possible" — with no materiality threshold for notifying the Regulator.',
    rows: [
      {
        aspect: 'Trigger',
        popia: 'Reasonable grounds to believe personal information has been accessed or acquired by an unauthorised person (s22).',
        gdpr: 'Any personal data breach, unless unlikely to result in risk to individuals (Art 33).',
      },
      {
        aspect: 'Regulator deadline',
        popia: 'As soon as reasonably possible after discovery — no fixed hour count, but delay must be justifiable.',
        gdpr: 'Within 72 hours of becoming aware, with reasons required for any delay.',
      },
      {
        aspect: 'Notifying individuals',
        popia: 'Data subjects must be notified unless identity cannot be established — there is no risk-based exemption.',
        gdpr: 'Only where the breach is likely to result in a high risk to individuals (Art 34).',
      },
      {
        aspect: 'Content',
        popia: 'Sufficient information to allow protective measures: description, possible consequences, measures taken, recommendations, identity of the intruder if known.',
        gdpr: 'Nature of breach, categories and approximate numbers, DPO contact, likely consequences, measures taken or proposed.',
      },
    ],
    takeaway:
      'POPIA’s duty to notify affected individuals is broader than GDPR’s — there is no "low risk" carve-out. Build your incident runbook to the stricter standard.',
  },
  {
    slug: 'international-transfers',
    name: 'International Transfers',
    seoDescription:
      'Cross-border data transfer rules under POPIA section 72 vs GDPR chapter V: adequacy, contracts, binding corporate rules, and consent.',
    intro:
      'Both laws restrict sending personal information across borders, but the mechanics differ: GDPR has a formal adequacy and SCC ecosystem; POPIA relies on a shorter list of conditions in section 72.',
    rows: [
      {
        aspect: 'Default rule',
        popia: 'Transfer prohibited unless one of the s72 conditions applies.',
        gdpr: 'Transfer prohibited outside the EEA unless a Chapter V mechanism applies.',
      },
      {
        aspect: 'Adequate protection',
        popia: 'Recipient bound by law, binding corporate rules or agreement providing substantially similar protection, including onward-transfer limits.',
        gdpr: 'Commission adequacy decisions; standard contractual clauses; binding corporate rules; certifications.',
      },
      {
        aspect: 'Consent route',
        popia: 'Transfer allowed with data subject consent (s72(1)(b)).',
        gdpr: 'Explicit consent available only as a narrow derogation (Art 49).',
      },
      {
        aspect: 'Contract necessity',
        popia: 'Transfer allowed where necessary for a contract with or in the interest of the data subject.',
        gdpr: 'Similar contractual-necessity derogations under Art 49.',
      },
    ],
    takeaway:
      'For SA companies using EU or US cloud providers, a s72-compliant agreement (often an amended DPA with SCC-style terms) is the practical mechanism. Do not assume an EU SCC pack automatically satisfies s72 — check the onward-transfer clause.',
  },
  {
    slug: 'penalties',
    name: 'Penalties and Enforcement',
    seoDescription:
      'POPIA fines and offences vs GDPR administrative penalties: maximum amounts, criminal liability, and enforcement practice.',
    intro:
      'GDPR’s headline fines are far larger, but POPIA adds something GDPR lacks: criminal offences with potential imprisonment for certain violations.',
    rows: [
      {
        aspect: 'Maximum fine',
        popia: 'Administrative fine up to R10 million (s109); certain offences carry fines and/or imprisonment up to 10 years.',
        gdpr: 'Up to €20 million or 4% of worldwide annual turnover, whichever is higher (Art 83).',
      },
      {
        aspect: 'Criminal liability',
        popia: 'Yes — obstruction, breach of conditions relating to account numbers, and unlawful acts by responsible parties can be criminal offences (s100–106).',
        gdpr: 'GDPR itself imposes administrative fines; member states may add criminal sanctions nationally.',
      },
      {
        aspect: 'Enforcement body',
        popia: 'Information Regulator (South Africa) — enforcement notices, infringement notices, fines.',
        gdpr: 'National supervisory authorities coordinated by the EDPB.',
      },
      {
        aspect: 'Civil claims',
        popia: 'Data subjects may sue for damages including for distress, without proving intent or negligence (s99, strict liability with defences).',
        gdpr: 'Right to compensation for material and non-material damage (Art 82).',
      },
    ],
    takeaway:
      'Do not read POPIA’s R10m cap as "cheaper risk": section 99 strict-liability civil claims and criminal exposure for account-number breaches change the calculus, especially for financial services.',
  },
  {
    slug: 'officers',
    name: 'Information Officer vs DPO',
    seoDescription:
      'POPIA Information Officer vs GDPR Data Protection Officer: who must appoint one, registration, duties, and liability.',
    intro:
      'Every South African organisation has an Information Officer by default — the head of the body — while GDPR only requires a DPO in defined cases. The roles look similar but are legally quite different.',
    rows: [
      {
        aspect: 'Who must have one',
        popia: 'Every public and private body — automatically the head (CEO or equivalent), who may delegate to a deputy.',
        gdpr: 'Only public authorities, large-scale systematic monitoring, or large-scale special-category processing (Art 37).',
      },
      {
        aspect: 'Registration',
        popia: 'Must be registered with the Information Regulator before taking up duties.',
        gdpr: 'Contact details published and communicated to the supervisory authority; no registration regime.',
      },
      {
        aspect: 'Independence',
        popia: 'An internal accountability role — no statutory independence requirement.',
        gdpr: 'Must be independent, adequately resourced, and must not be penalised for performing DPO tasks.',
      },
      {
        aspect: 'Core duties',
        popia: 'Encourage and ensure compliance, handle requests, work with the Regulator, develop a compliance framework, PAIA manual.',
        gdpr: 'Inform and advise, monitor compliance, advise on DPIAs, cooperate with the supervisory authority.',
      },
    ],
    takeaway:
      'If you operate in both regimes, one person can hold both roles — but the POPIA IO must be registered and carries direct accountability the GDPR DPO deliberately does not.',
  },
  {
    slug: 'lawful-basis',
    name: 'Lawful Basis for Processing',
    seoDescription:
      'Lawful processing conditions under POPIA section 11 vs GDPR article 6: consent, contract, legal obligation, legitimate interests.',
    intro:
      'Both laws require a justification for every processing activity, and the menus are nearly identical — the differences are in the details and terminology.',
    rows: [
      {
        aspect: 'The menu',
        popia: 'Consent; contract necessity; legal obligation; protection of legitimate interests of the data subject; public law duty; legitimate interests of the responsible party or third party (s11).',
        gdpr: 'Consent; contract; legal obligation; vital interests; public task; legitimate interests (Art 6).',
      },
      {
        aspect: 'Legitimate interests',
        popia: 'Available, and the data subject may object on reasonable grounds — no formal balancing-test documentation requirement.',
        gdpr: 'Requires a documented balancing test (LIA); objection right under Art 21.',
      },
      {
        aspect: 'Special categories',
        popia: '"Special personal information" (religion, race, health, sex life, biometrics, criminal behaviour) prohibited unless an s27 exception applies.',
        gdpr: 'Art 9 special categories prohibited unless an exception applies; criminal data separately restricted (Art 10).',
      },
    ],
    takeaway:
      'Map each processing activity to a POPIA s11 ground and a GDPR Art 6 ground in the same record — they align closely enough that one register can serve both.',
  },
  {
    slug: 'scope-and-application',
    name: 'Scope and Application',
    seoDescription:
      'Who and what POPIA and GDPR apply to: territorial scope, juristic persons, household exemptions, and key definitions.',
    intro:
      'The biggest surprise for teams coming from GDPR: POPIA protects companies too. Its definition of "personal information" covers juristic persons, which changes how you treat B2B data in South Africa.',
    rows: [
      {
        aspect: 'Whose data',
        popia: 'Natural AND juristic persons — company information can be personal information.',
        gdpr: 'Natural persons only.',
      },
      {
        aspect: 'Territorial reach',
        popia: 'Responsible parties domiciled in SA, or using means in SA to process (unless only forwarding through SA).',
        gdpr: 'EU establishments, plus non-EU entities offering goods/services to or monitoring people in the EU (Art 3).',
      },
      {
        aspect: 'Key actors',
        popia: 'Responsible party (≈ controller) and operator (≈ processor).',
        gdpr: 'Controller and processor.',
      },
      {
        aspect: 'Exemptions',
        popia: 'Purely personal/household activity, de-identified data, certain state security and journalistic purposes.',
        gdpr: 'Household exemption, plus national carve-outs for journalism, research, and law enforcement (separate directive).',
      },
    ],
    takeaway:
      'B2B marketers: your South African prospect database of company names and generic emails is still regulated under POPIA. EU-style "B2B is fair game" assumptions do not transfer.',
  },
];

export const getCompareTopic = (slug) => compareTopics.find((t) => t.slug === slug);
