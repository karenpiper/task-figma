import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Get all team members
        const { data: teamMembers, error: getError } = await supabase
          .from('team_members')
          .select('*')
          .eq('is_active', true)
          .order('name');
        
        if (getError) throw getError;
        res.json(teamMembers);
        break;

      case 'POST':
        // Create new team member
        const { name, email, avatar, color } = req.body;
        
        if (!name) {
          res.status(400).json({ error: 'Name is required' });
          return;
        }

        const { data: newMember, error: createError } = await supabase
          .from('team_members')
          .insert({
            name,
            email: email || null,
            avatar: avatar || name.substring(0, 2).toUpperCase(),
            color: color || 'bg-blue-500'
          })
          .select()
          .single();

        if (createError) throw createError;
        res.status(201).json(newMember);
        break;

      case 'PUT':
        // Update team member
        const { id, ...updates } = req.body;
        
        if (!id) {
          res.status(400).json({ error: 'Team member ID is required' });
          return;
        }

        const { data: updatedMember, error: updateError } = await supabase
          .from('team_members')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;
        res.json(updatedMember);
        break;

      case 'DELETE':
        // Delete team member
        const { id: deleteId } = req.body;
        
        if (!deleteId) {
          res.status(400).json({ error: 'Team member ID is required' });
          return;
        }

        const { error: deleteError } = await supabase
          .from('team_members')
          .delete()
          .eq('id', deleteId);

        if (deleteError) throw deleteError;
        res.json({ message: 'Team member deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 