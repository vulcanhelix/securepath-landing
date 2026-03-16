/*
  # Create Assessments Table

  1. New Tables
    - `assessments`
      - `id` (uuid, primary key) - Unique identifier for each assessment
      - `assessment_type` (text) - Type of assessment (GDPR or POPIA)
      - `client_name` (text) - Name of the person completing the assessment
      - `client_email` (text) - Email address for follow-up
      - `company_name` (text) - Company/organization name
      - `overall_score` (integer) - Total score achieved
      - `max_score` (integer) - Maximum possible score
      - `verdict` (text) - Overall assessment verdict
      - `category_scores` (jsonb) - Breakdown of scores by category
      - `answers` (jsonb) - All question-answer pairs from the assessment
      - `created_at` (timestamptz) - When the assessment was completed
      - `email_sent` (boolean) - Whether notification emails were sent
      - `pdf_generated` (boolean) - Whether PDF report was generated

  2. Security
    - Enable RLS on `assessments` table
    - Add policy for service role to insert assessments
    - Add policy for service role to read assessments

  3. Indexes
    - Index on client_email for quick lookup
    - Index on created_at for date-based queries
    - Index on assessment_type for filtering
*/

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_type text NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  company_name text,
  overall_score integer NOT NULL,
  max_score integer NOT NULL,
  verdict text NOT NULL,
  category_scores jsonb NOT NULL DEFAULT '{}',
  answers jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  email_sent boolean DEFAULT false,
  pdf_generated boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Policy for service role to insert assessments
CREATE POLICY "Service role can insert assessments"
  ON assessments
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy for service role to read assessments
CREATE POLICY "Service role can read assessments"
  ON assessments
  FOR SELECT
  TO service_role
  USING (true);

-- Policy for service role to update assessments
CREATE POLICY "Service role can update assessments"
  ON assessments
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_assessments_email ON assessments(client_email);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(assessment_type);