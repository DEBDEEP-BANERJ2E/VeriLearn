/*
  # Create Posts Schema

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `organization` (text)
      - `description` (text)
      - `requirements` (text, nullable)
      - `location` (text, nullable)
      - `type` (text) - jobs/internships/courses/scholarships/projects
      - `work_type` (text, nullable) - remote/onsite/hybrid
      - `duration` (text, nullable)
      - `compensation` (text, nullable)
      - `skills` (text[])
      - `status` (text) - active/closed/draft
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on posts table
    - Add policies for:
      - Anyone can view active posts
      - Authenticated users can create posts
      - Users can update/delete their own posts
*/

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  organization text NOT NULL,
  description text NOT NULL,
  requirements text,
  location text,
  type text NOT NULL CHECK (type IN ('jobs', 'internships', 'courses', 'scholarships', 'projects')),
  work_type text CHECK (work_type IN ('remote', 'onsite', 'hybrid')),
  duration text,
  compensation text,
  skills text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active posts"
  ON posts
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can create posts"
  ON posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
CREATE INDEX IF NOT EXISTS posts_type_idx ON posts(type);
CREATE INDEX IF NOT EXISTS posts_status_idx ON posts(status);