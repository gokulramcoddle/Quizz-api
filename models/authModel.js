import { supabase } from '../lib/supabase.js';

export async function createUser(name, email, password) {
  return await supabase.from('users').insert([{ name, email, password }]);
}

export async function findUserByEmailAndPassword(email, password) {
  return await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();
}

export async function findUserById(id) {
  return await supabase.from("users").select("*").eq("id", id).single();
}
