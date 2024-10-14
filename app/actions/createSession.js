'use server';

import { createAdminClient } from "@/config/appwrite";
import { cookies } from "next/headers";

async function createSession(previousState, formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if(!email || !password) {
        return { error: 'Please fill out all the fields.' };
    }

    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailPasswordSession(email, password);

        cookies().set('appwrite-session', session.secret, {
            httpOnly: true,
            secure: true,
            sameSite: true,
            expires: new Date(session.expire),
            path: '/',
        });

        return { success: true };
    } catch (error) {
        console.log('Authentication failed', error)
        return { error: error.message }
    }
}

export default createSession;