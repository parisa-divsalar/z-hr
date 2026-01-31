import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, password, name, firstName, lastName, username } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = db.users.findByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                {
                    error: 'User already exists. Please sign in instead.',
                },
                { status: 409 },
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create full name from firstName and lastName if available
        let fullName = name;
        if (!fullName && firstName && lastName) {
            fullName = `${firstName} ${lastName}`.trim();
        } else if (!fullName && firstName) {
            fullName = firstName;
        } else if (!fullName && lastName) {
            fullName = lastName;
        }

        const fakeUserId = `fake_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

        // Create user
        const newUser = db.users.create({
            email,
            password_hash: passwordHash,
            name: fullName || null,
            fake_user_id: fakeUserId,
        });

        db.registrationLogs.append({
            user_id: newUser.id,
            fake_user_id: fakeUserId,
            email,
            username: username || email,
            password_hash: passwordHash,
        });

        return NextResponse.json({
            data: {
                userId: newUser.id,
                fakeUserId,
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
