import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    const validToken = process.env.ADMIN_TOKEN;

    if (!validToken || token !== validToken) {
      return NextResponse.json({ error: 'Geçersiz şifre' }, { status: 401 });
    }

    // Set cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
