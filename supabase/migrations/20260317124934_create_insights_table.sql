/*
  # Create Insights (Blog) Table

  ## Summary
  Creates the `insights` table which powers the Securepath Insights section —
  a thought-leadership blog covering POPIA, GDPR, Cybersecurity, Compliance,
  and related topics.

  ## New Tables

  ### `insights`
  - `id` — UUID primary key, auto-generated
  - `slug` — URL-safe unique identifier for routing (e.g. "popia-compliance-schools")
  - `title` — Article headline
  - `subtitle` — Supporting headline / standfirst
  - `excerpt` — Short preview text (2–3 sentences) used on archive cards
  - `content` — Full article body stored as JSONB array of section objects
    Each section: { heading, body (array of paragraphs), list_items (optional) }
  - `category` — Primary category label: POPIA | GDPR | Cybersecurity | Compliance | Data Governance | Privacy | Regulatory
  - `tags` — Array of string tags for secondary classification
  - `author` — Author display name
  - `published_at` — Publication timestamp
  - `read_time_minutes` — Estimated reading time in minutes
  - `published` — Boolean flag; only published=true rows are shown publicly
  - `cover_image_url` — URL to cover/preview image
  - `created_at` — Row creation timestamp
  - `updated_at` — Last modification timestamp

  ## Security
  - RLS enabled; public SELECT for published posts only
  - No public write access (service_role writes only)

  ## Seed Data
  - First post: "POPIA Compliance for Schools in South Africa" (from client datasheet)
*/

CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  excerpt text NOT NULL,
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  category text NOT NULL DEFAULT 'Compliance',
  tags text[] NOT NULL DEFAULT '{}',
  author text NOT NULL DEFAULT 'Securepath Consulting',
  published_at timestamptz NOT NULL DEFAULT now(),
  read_time_minutes integer NOT NULL DEFAULT 5,
  published boolean NOT NULL DEFAULT false,
  cover_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS insights_slug_idx ON insights (slug);
CREATE INDEX IF NOT EXISTS insights_published_idx ON insights (published);
CREATE INDEX IF NOT EXISTS insights_published_at_idx ON insights (published_at DESC);
CREATE INDEX IF NOT EXISTS insights_category_idx ON insights (category);

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published insights"
  ON insights FOR SELECT
  TO anon, authenticated
  USING (published = true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM insights WHERE slug = 'popia-compliance-schools-south-africa'
  ) THEN
    INSERT INTO insights (
      slug,
      title,
      subtitle,
      excerpt,
      content,
      category,
      tags,
      author,
      published_at,
      read_time_minutes,
      published,
      cover_image_url
    ) VALUES (
      'popia-compliance-schools-south-africa',
      'POPIA Compliance for Schools in South Africa',
      'What every principal, bursar, and information officer needs to know',
      'Since July 2021, all South African schools have been legally required to comply with POPIA — yet most remain dangerously exposed. The 2023 matric results case and the 2025 regulatory tightening make clear that the Information Regulator is willing to act. Here is what the risks are and exactly what schools need to do.',
      '[
        {
          "heading": "Why It Matters",
          "body": [
            "Since July 1, 2021, all South African schools must comply with POPIA. Non-compliance carries penalties up to R10 million or 10 years'' imprisonment. Every school is a ''Responsible Party'' under the Act — ignorance is not an excuse.",
            "The stakes are not hypothetical. The Department of Basic Education published the 2023 matric results without securing consent from students over 18, or from parents and guardians of those under 18. The Information Regulator ruled this non-compliant and ordered the DBE to cease newspaper publication and adopt privacy-compliant alternatives. Schools are under the same law, held to the same standard."
          ]
        },
        {
          "heading": "The Key Challenges",
          "subheadings": [
            {
              "title": "1. Handling children''s data — and getting consent right",
              "body": "This is the most high-profile area of failure. Photos on websites, newsletters, social media posts, and WhatsApp class groups routinely expose learner data without proper consent. The DBE matric case is a direct warning for schools operating in exactly the same way."
            },
            {
              "title": "2. Photos and social media",
              "body": "Taking photos of learners for Facebook, newsletters, or the school website requires explicit consent. Parents should be able to opt out of any category without it affecting their child''s enrolment. Most schools have no formal process for this, making it one of the most common areas of inadvertent non-compliance."
            },
            {
              "title": "3. Confusing compliance with just having a security policy",
              "body": "A security policy or access management policy does not constitute a compliance framework. The POPIA compliance framework must specify exactly what steps are being taken to comply with POPIA — in particular each of the conditions of lawful processing."
            },
            {
              "title": "4. Overlooking the human and organisational side",
              "body": "Organisations often emphasise the technical measures they have in place to prevent data breaches but overlook the organisational measures. The Information Regulator has stressed that organisations also need to pay attention to the operational measures taken — and particularly the conduct of their employees. Staff sharing learner information over unsecured WhatsApp groups is a classic school-specific example."
            },
            {
              "title": "5. Third-party vendors and school management software",
              "body": "Schools must review their POPIA policy with software vendors, sign data processing agreements, verify security measures (encryption, access controls, backup procedures), check where data is stored, and confirm breach notification obligations. Many schools use unvetted apps for attendance, communication, and administration without any of these controls in place."
            },
            {
              "title": "6. Low digital literacy and resource constraints",
              "body": "The South African context must be situated within broader challenges facing developing countries — namely, limited enforcement capacity, low digital literacy, and infrastructural constraints. Smaller public schools in particular struggle to resource compliance meaningfully."
            },
            {
              "title": "7. The 2025 regulatory tightening",
              "body": "In April 2025, the Information Regulator published amendments to POPIA Regulations, introducing new responsibilities for information officers and simplifying processes for objecting to data processing, requesting corrections or deletions, and obtaining consent. Schools that set and forgot their 2021 compliance work need to revisit it urgently."
            }
          ]
        },
        {
          "heading": "What Schools Should Do",
          "subheadings": [
            {
              "title": "Appoint and register an Information Officer",
              "body": "The principal typically serves as the Information Officer and must be registered with the Information Regulator. This is a legal requirement, not optional. The IO can then designate Deputy Information Officers (DIOs) to assist with day-to-day compliance functions. The most practical approach for most schools is a hybrid model: outsource the DIO function to a reputable specialist for the technical compliance work — framework development, impact assessments, vendor due diligence, breach response, and IR liaison — while appointing an internal POPIA champion as a point of contact."
            },
            {
              "title": "Conduct a data audit",
              "body": "Map exactly what personal information the school collects — learner names, ID numbers, addresses, medical conditions, academic records, photographs, and parent and staff details all fall under POPIA. Medical data and biometrics are ''special personal information'' requiring extra protection."
            },
            {
              "title": "Fix enrolment forms",
              "body": "Include POPIA notices, purpose statements, and explicit photo and biometrics consent with opt-out options. Parents should be able to decline social media or marketing use without it affecting their child''s enrolment."
            },
            {
              "title": "Secure physical and digital records",
              "body": "Paper records must be locked in secure filing cabinets. Digital records must be password-protected with access restricted to authorised staff only."
            },
            {
              "title": "Train all staff",
              "body": "The number one cause of reported POPIA incidents is human error. Every staff member handling learner or parent data needs to understand what they can and cannot do."
            },
            {
              "title": "Have a breach response plan",
              "body": "Under the 2025 regulations, all security compromises must be reported to the Information Regulator as soon as you are reasonably sure — not after a full investigation."
            },
            {
              "title": "Build a proper compliance framework",
              "body": "Not just a policy document. The IR''s own initiative assessments look for personal information impact assessments and compliance frameworks that demonstrate specifically how the organisation addresses risks and the steps it has taken."
            }
          ]
        },
        {
          "heading": "The Bottom Line",
          "body": [
            "Schools sit in a uniquely exposed position — they hold sensitive data on minors, involve dozens of staff, and interact with hundreds of parents across multiple digital channels. The DBE matric results case is a clear warning that the Information Regulator is willing to act against educational institutions.",
            "The good news is that the basics — proper consent, sensible access controls, staff awareness, and a formal compliance framework — are achievable without enormous cost. The risk of doing nothing, however, keeps growing. Securepath Consulting offers a practical, school-specific POPIA compliance programme designed to take schools from exposed to compliant, with a hybrid model that preserves internal ownership while providing the specialist expertise that educators should not be expected to develop alone."
          ]
        }
      ]'::jsonb,
      'POPIA',
      ARRAY['POPIA', 'Schools', 'Data Protection', 'South Africa', 'Information Officer', 'Compliance', 'Education'],
      'Securepath Consulting',
      '2025-03-17 09:00:00+02',
      6,
      true,
      'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200'
    );
  END IF;
END $$;
