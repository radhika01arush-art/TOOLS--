-- Fix public data exposure: Restrict scores table to authenticated users only
DROP POLICY IF EXISTS "Scores are viewable by everyone" ON public.scores;

CREATE POLICY "Authenticated users can view scores" 
ON public.scores 
FOR SELECT 
USING (auth.uid() IS NOT NULL);