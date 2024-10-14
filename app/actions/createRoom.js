'use server';

import { createAdminClient } from "@/config/appwrite";
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";
import checkAuth from "./checkAuth";

async function createRoom(previousState, formData) {
    const { databases, storage } = await createAdminClient();

    try {
        const { user } = await checkAuth();

        if(!user) {
            return { error: 'You must be logged in to create a room.' };
        }

        let imageID;

        const image = formData.get('image');

        if(image && image.size > 0 && image.name !== 'undefined') {
            try {
                const res = await storage.createFile('rooms', ID.unique(), image);
                imageID = res.$id;
            } catch (error) {
                console.log('Error uploading image', error);
                return { error: 'Failed to upload room image.' };
            }
        } else {
            console.log('No image file provided')
        }

        const newRoom = await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
            ID.unique(),
            {
                description: formData.get('description'),
                name: formData.get('name'),
                sqft: formData.get('sqft'),
                location: formData.get('location'),
                price_per_hour: formData.get('price_per_hour'),
                amenities: formData.get('amenities'),
                capacity: formData.get('capacity'),
                address: formData.get('address'),
                availability: formData.get('availability'),
                image: imageID,
                user_id: user.id,
            }
        );

        revalidatePath('/', 'layout');

        return{ success: true }
    } catch (error) {
        console.log(error);
        const errorMessage = error.response.message || 'An unexpected error has occured';
        return { error: errorMessage };
    }
}

export default createRoom;