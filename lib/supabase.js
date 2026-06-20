import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper: run a select with optional filters
export async function dbAll(table, { select = '*', filters = [], order = null, limit = null } = {}) {
  let q = supabase.from(table).select(select);
  for (const [col, op, val] of filters) {
    q = q.filter(col, op, val);
  }
  if (order) q = q.order(order.col, { ascending: order.asc ?? false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function dbGet(table, { select = '*', filters = [] } = {}) {
  const rows = await dbAll(table, { select, filters, limit: 1 });
  return rows[0] || null;
}

export async function dbInsert(table, row) {
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function dbUpdate(table, id, updates) {
  const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function dbRawCount(table, filters = []) {
  let q = supabase.from(table).select('*', { count: 'exact', head: true });
  for (const [col, op, val] of filters) {
    q = q.filter(col, op, val);
  }
  const { count, error } = await q;
  if (error) throw new Error(error.message);
  return count || 0;
}
