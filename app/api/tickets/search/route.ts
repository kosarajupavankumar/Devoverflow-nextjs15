import { NextResponse } from 'next/server';

import tickets from '@/app/database';

export async function GET(request: Request) {
  const SearchParams = new URL(request.url).searchParams;
  const query = SearchParams.get('query');

  if (!query) {
    return NextResponse.json(tickets);
  }

  const filteredTickets = tickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(query.toLowerCase()),
  );

  return NextResponse.json(filteredTickets);
}
