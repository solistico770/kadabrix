// src/SW/geo.js
import { createClient } from '@supabase/supabase-js';

let supabase = null; // Supabase client placeholder

// Install and activate the service worker
self.addEventListener('install', (event) => {
    console.log('Service Worker Installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker Activated');
    self.clients.claim();
});

// Listen for messages from the main app
self.addEventListener('message', async (event) => {
    if (!event.data) return;

    // Handle Supabase credentials
    if (event.data.type === 'SUPABASE_CREDENTIALS') {
        const { supabaseUrl, supabaseKey, accessToken } = event.data.payload;
        console.log('Received Supabase credentials in Service Worker');

        // Initialize Supabase client with the received credentials
        supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: false, // Important for service workers
            },
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        });

        // Add a reusable Supabase function runner to the client
        supabase.run = async function (funcData) {
            try {
                const ret = await supabase.functions.invoke('runkdb', {
                    body: JSON.stringify(funcData),
                });

                if (ret.data?.status === 'ok') {
                    console.log('Supabase function executed successfully:', ret.data.data);
                    return ret.data.data;
                } else {
                    console.error('Supabase function error:', ret.data?.data);
                    throw ret.data?.data;
                }
            } catch (err) {
                console.error('Error executing Supabase function:', err);
                throw err;
            }
        };

    }

    // Handle location updates
    if (event.data.type === 'LOCATION_UPDATE') {
        const { latitude, longitude } = event.data.payload;
        console.log('Received location from app:', latitude, longitude);

        // Ensure Supabase client is initialized
        if (!supabase) {
            console.error('Supabase client is not initialized');
            return;
        }

        // Send the location data to Supabase
        try {
            await supabase.run({
                module: 'userTrace',
                name: 'log',
                data: { latitude, longitude },
            });
        } catch (err) {
            console.error('Error sending location to Supabase:', err);
        }
    }
});

// Handle periodic sync event (triggered every minute)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'location-sync') {
        console.log('Periodic sync triggered for location data');
        event.waitUntil(requestLocationUpdate());
    }
});

// Fallback for browsers not supporting periodic sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'location-sync') {
        console.log('Background sync triggered for location data');
        event.waitUntil(requestLocationUpdate());
    }
});

// Function to request location update from the main app
async function requestLocationUpdate() {
    try {
        console.log('Requesting location update from main app');
        const allClients = await self.clients.matchAll({ includeUncontrolled: true });
        for (const client of allClients) {
            client.postMessage({ type: 'REQUEST_LOCATION' });
        }
    } catch (error) {
        console.error('Error requesting location from main app:', error);
    }
}
