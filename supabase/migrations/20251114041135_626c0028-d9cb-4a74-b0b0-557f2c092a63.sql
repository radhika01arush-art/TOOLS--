-- Create challenge_completions table
CREATE TABLE IF NOT EXISTS public.challenge_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_text TEXT NOT NULL,
  challenge_category TEXT NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 10,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add points column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0 NOT NULL;

-- Enable RLS
ALTER TABLE public.challenge_completions ENABLE ROW LEVEL SECURITY;

-- Challenge completions policies
CREATE POLICY "Users can view own challenge completions"
  ON public.challenge_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenge completions"
  ON public.challenge_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to update total points
CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET total_points = total_points + NEW.points_earned
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-update points
CREATE TRIGGER on_challenge_completion
  AFTER INSERT ON public.challenge_completions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_points();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_challenge_completions_user_id ON public.challenge_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_completions_completed_at ON public.challenge_completions(completed_at);