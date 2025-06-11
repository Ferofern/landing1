import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get database reference
const db = getDatabase(app);

const saveVote = async (productID) => {
    try {
        const votesRef = ref(db, 'votes');
        const newVoteRef = push(votesRef);
        
        await set(newVoteRef, {
            productID: productID,
            timestamp: Date.now()
        });

        return { success: true, message: 'Vote saved successfully!' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getVotes = async () => {
    try {
        const votesRef = ref(db, 'votes');
        const snapshot = await get(votesRef);
        
        if (snapshot.exists()) {
            return { 
                success: true, 
                data: snapshot.val() 
            };
        } else {
            return { 
                success: true, 
                data: {} 
            };
        }
    } catch (error) {
        return { 
            success: false, 
            error: error.message 
        };
    }
};

export { saveVote, getVotes };
