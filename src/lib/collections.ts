import { getCollection } from 'astro:content';

export async function getCases() {
  return (await getCollection('cases')).sort((a, b) => a.data.order - b.data.order);
}

export async function getNotes() {
  return (await getCollection('noter', ({ data }) => import.meta.env.DEV || !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

// Only people who have agreed to be listed.
export async function getPeople(group: 'team' | 'collaborators') {
  return (await getCollection('people', ({ data }) => data.listed && data.team === (group === 'team'))).sort(
    (a, b) => a.data.order - b.data.order,
  );
}
