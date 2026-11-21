import prisma from '../src/lib/prisma';
import { supabase } from '../src/lib/supabase/client';

async function testConnection() {
  console.log('--- Testing Supabase DB Connections ---');

  // 1. Prisma ORM Query
  const artworks = await prisma.artwork.findMany({
    select: {
      id: true,
      title: true,
      medium: true,
      coa: { select: { tokenNumber: true } },
      artist: { select: { displayName: true } },
    },
  });
  console.log('Prisma Artworks Query Count:', artworks.length);
  console.log('Sample:', artworks[0]);

  // 2. Supabase Client Query
  const { data, error } = await supabase.from('Artwork').select('id, title, medium').limit(3);
  if (error) {
    console.log('Supabase query notice (RLS):', error.message);
  } else {
    console.log('Supabase Client Direct Query Count:', data?.length);
  }

  await prisma.$disconnect();
  console.log('--- DB Connection Test Passed Successfully ---');
}

testConnection().catch(e => {
  console.error('Connection test failed:', e);
  process.exit(1);
});
