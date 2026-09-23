import { Resend } from 'resend';
import { NextResponse } from 'next/server';

interface ViewingRequestPayload {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  listingTitle: string;
  listingAddress: string;
  listingSlug: string;
  notes: string;
}

const TIME_SLOT_RE = /^([01]\d|2[0-3]):00$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function formatUsDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  return `${match[2]}/${match[3]}/${match[1]}`;
}

function formatTimeLabel(value: string): string {
  const [hourStr, minute = '00'] = value.split(':');
  const hour = Number(hourStr);
  if (Number.isNaN(hour)) return value;
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.padStart(2, '0')} ${suffix}`;
}

function normalizeTime(value: string): string {
  const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(value.trim());
  if (!match) return value.trim();
  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

function isPastDate(isoDate: string): boolean {
  const today = new Date();
  const todayIso = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
  return isoDate < todayIso;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ViewingRequestPayload>;

    const name = sanitize(body.name);
    const email = sanitize(body.email);
    const phone = sanitize(body.phone);
    const preferredDate = sanitize(body.preferredDate);
    const preferredTime = normalizeTime(sanitize(body.preferredTime));
    const listingTitle = sanitize(body.listingTitle);
    const listingAddress = sanitize(body.listingAddress);
    const listingSlug = sanitize(body.listingSlug);
    const notes = sanitize(body.notes);

    if (
      !name ||
      !email ||
      !phone ||
      !preferredDate ||
      !preferredTime ||
      !listingTitle
    ) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!DATE_RE.test(preferredDate) || isPastDate(preferredDate)) {
      return NextResponse.json(
        { error: 'Please choose a valid preferred date.' },
        { status: 400 }
      );
    }

    if (!TIME_SLOT_RE.test(preferredTime)) {
      return NextResponse.json(
        { error: 'Please choose a valid preferred time.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;

    if (!apiKey || !toEmail) {
      console.error('Missing RESEND_API_KEY or CONTACT_TO_EMAIL');
      return NextResponse.json(
        { error: 'Viewing requests are not configured yet.' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const when = `${formatUsDate(preferredDate)} at ${formatTimeLabel(preferredTime)}`;

    const { error } = await resend.emails.send({
      from: 'Waterstone Viewings <info@waterstoneusa.com>',
      to: [toEmail],
      replyTo: email,
      subject: `Viewing request — ${listingTitle} — ${when}`,
      text: [
        'New viewing request (preferred time — please confirm with the prospect).',
        '',
        `Listing: ${listingTitle}`,
        listingAddress ? `Address: ${listingAddress}` : null,
        listingSlug ? `Slug: ${listingSlug}` : null,
        listingSlug
          ? `Public URL path: /listings/${listingSlug}`
          : null,
        '',
        `Preferred date/time: ${when}`,
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        '',
        'Notes:',
        notes || '(none)',
      ]
        .filter((line) => line !== null)
        .join('\n'),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send request. Please try again later.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Viewing request API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
