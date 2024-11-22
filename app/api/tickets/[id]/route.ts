import { NextResponse } from 'next/server';

import tickets from '@/app/database';

// Get By ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ticket = tickets.find((ticket) => ticket.id === parseInt(id));
  return NextResponse.json(ticket);
}

// Update By ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { title, status, type } = await request.json();

  const ticket = tickets.find((ticket) => ticket.id === parseInt(id));

  if (!ticket)
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

  if (title) ticket.title = title;

  if (status) ticket.status = status;

  if (type) ticket.type = type;

  return NextResponse.json(ticket);
}

// Delete By ID
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ticketIndex = tickets.findIndex((ticket) => ticket.id === parseInt(id));

  if (ticketIndex === -1)
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

  tickets.splice(ticketIndex, 1);

  return NextResponse.json(tickets);
}
