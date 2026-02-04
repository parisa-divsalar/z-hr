import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recordUserStateTransition } from '@/lib/user-state';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
    try {
        const { email, password, username } = await request.json();

        // Support both 'email' and 'username' fields (username is actually email)
        const userEmail = email || username;

        if (!userEmail || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Find user in database
        const user = db.users.findByEmail(userEmail);

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '7d',
        });

        const response = NextResponse.json({
            data: {
                userId: user.id,
                email: user.email,
                name: user.name,
                token,
            },
        });

        response.cookies.set('accessToken', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // Log login with summary of user data saved so far (for admin panel)
        const userId = user.id as number;
        const cvsCount = db.cvs.findByUserId(userId).length;
        const wizardDataCount = db.wizardData.findByUserId(userId).length;
        const userSkillsCount = db.userSkills.findByUserId(userId).length;
        db.loginLogs.append({
            event: 'login',
            user_id: userId,
            email: user.email,
            name: user.name ?? null,
            fake_user_id: (user as any).fake_user_id ?? null,
            data_summary: {
                cvs_count: cvsCount,
                wizard_data_count: wizardDataCount,
                user_skills_count: userSkillsCount,
            },
        });

        recordUserStateTransition(userId, { isVerified: (user as any)?.is_verified ?? (user as any)?.email_verified ?? null }, { event: 'login' });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
