import { supabase } from '../lib/supabase';

// ================= SERVICES =================
export async function fetchServices() {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  return supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });
}

export async function createService(payload) {
  if (!supabase) return { data: null, error: null };
  return supabase.from('services').insert(payload).select().single();
}

export async function updateService(id, updates) {
  if (!supabase) return { data: null, error: null };
  return supabase.from('services').update(updates).eq('id', id).select().single();
}

export async function deleteService(id) {
  if (!supabase) return { error: null };
  return supabase.from('services').delete().eq('id', id);
}

// ================= SPECIALISTS =================
export async function fetchSpecialists() {
  if (!supabase) return { data: null, error: null };
  return supabase
    .from('specialists')
    .select('*')
    .order('rating', { ascending: false });
}

export async function updateSpecialist(id, updates) {
  if (!supabase) return { data: null, error: null };
  return supabase.from('specialists').update(updates).eq('id', id).select().single();
}

export async function createSpecialist(payload) {
  if (!supabase) return { data: null, error: null };
  return supabase.from('specialists').insert(payload).select().single();
}

// ================= APPOINTMENTS =================
export async function createAppointment(appointment, services = []) {
  if (!supabase) return { data: null, error: null };

  const bookingRef = `VB-${Math.floor(100000 + Math.random() * 900000)}`;
  const { data: created, error } = await supabase
    .from('appointments')
    .insert({ ...appointment, booking_ref: bookingRef })
    .select()
    .single();

  if (error || !created) return { data: null, error };

  if (services.length > 0) {
    const rows = services.map((s) => ({
      appointment_id: created.id,
      service_name: s.name,
      duration_mins: s.duration || 60,
      price_lkr: s.price || 0,
    }));
    await supabase.from('appointment_services').insert(rows);
  }

  return { data: created, error: null };
}

export async function fetchAppointments() {
  if (!supabase) return { data: null, error: null };
  return supabase
    .from('appointments')
    .select('*, appointment_services(*)')
    .order('appointment_date', { ascending: true });
}

export async function updateAppointmentStatus(id, status) {
  if (!supabase) return { data: null, error: null };
  return supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
}

// ================= BRIDAL INQUIRIES =================
export async function submitBridalInquiry(inquiry) {
  if (!supabase) return { data: null, error: null };
  const refCode = `#VB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  return supabase
    .from('bridal_inquiries')
    .insert({ ...inquiry, ref_code: refCode })
    .select()
    .single();
}

export async function fetchBridalInquiries() {
  if (!supabase) return { data: null, error: null };
  return supabase
    .from('bridal_inquiries')
    .select('*')
    .order('created_at', { ascending: false });
}

// ================= CLIENT FORMULAS =================
export async function fetchClientFormulas(customerName) {
  if (!supabase) return { data: null, error: null };
  let query = supabase
    .from('client_formulas')
    .select('*')
    .order('created_at', { ascending: false });
  if (customerName) {
    query = query.ilike('customer_name', customerName);
  }
  return query;
}

export async function saveClientFormula(payload) {
  if (!supabase) return { data: null, error: null };
  return supabase.from('client_formulas').insert(payload).select().single();
}

// ================= STAFF NOTES & RETAIL / POS =================
export async function fetchStaffNotes() {
  if (!supabase) return { data: null, error: null };
  return supabase
    .from('staff_notes')
    .select('*')
    .order('created_at', { ascending: false });
}

export async function createStaffNote(payload) {
  if (!supabase) return { data: null, error: null };
  return supabase.from('staff_notes').insert(payload).select().single();
}

export async function fetchRetailProducts() {
  if (!supabase) return { data: null, error: null };
  return supabase.from('retail_products').select('*').order('name');
}

export async function createInvoice(payload) {
  if (!supabase) return { data: null, error: null };
  const invoiceNumber = `VB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  return supabase
    .from('invoices')
    .insert({ ...payload, invoice_number: invoiceNumber })
    .select()
    .single();
}

// ================= SHIFT REQUESTS =================
export async function submitShiftRequest(payload) {
  if (!supabase) return { data: null, error: null };
  return supabase.from('shift_requests').insert(payload).select().single();
}

// ================= STORAGE: IMAGE UPLOADS =================
export async function uploadLookbookImage(file, folder = 'transformations') {
  if (!supabase || !file) return { url: null, error: null };
  const ext = file.name.split('.').pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('lookbook-images')
    .upload(path, file, { upsert: true });

  if (uploadError) return { url: null, error: uploadError };

  const { data } = supabase.storage.from('lookbook-images').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

export async function createLookbookItem(payload) {
  if (!supabase) return { data: null, error: null };
  return supabase.from('lookbook_items').insert(payload).select().single();
}
