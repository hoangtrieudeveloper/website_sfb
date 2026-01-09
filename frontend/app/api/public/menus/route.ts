import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/api/base';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/menus`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch menus' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch menus' },
      { status: 500 }
    );
  }
}

