/*
  # Fix user signup trigger permissions

  This migration fixes the database error that occurs when new users sign up.
  The issue is that the trigger function lacks proper permissions to insert
  into the profiles table.

  ## Changes
  1. Drop and recreate the handle_new_user function with SECURITY DEFINER
  2. Set proper ownership and permissions
  3. Ensure the trigger works correctly for new user registration
*/

-- Drop the existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function with proper permissions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Set the function owner to postgres for proper permissions
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();