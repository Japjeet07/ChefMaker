import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  limitToLast,
  startAfter,
  onSnapshot, 
  updateDoc, 
  arrayUnion, 
  serverTimestamp,
  Timestamp,
  DocumentSnapshot
} from 'firebase/firestore';
import { getFirebaseServices } from './firebase';

// Check if Firebase is available
const isFirebaseAvailable = () => {
  const { db, isInitialized } = getFirebaseServices();
  
  if (!isInitialized || !db) {
    return false;
  }
  return true;
};

// Get Firebase services
const getFirebaseDB = () => {
  const { db } = getFirebaseServices();
  return db;
};

export interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Timestamp;
  read: boolean;
  messageType: 'text' | 'image' | 'file';
}

export interface Chat {
  id?: string;
  participants: string[];
  participantNames: { [userId: string]: string };
  lastMessage?: ChatMessage;
  lastMessageAt: Timestamp;
  unreadCount: { [userId: string]: number };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Create or get existing chat between two users
export const createOrGetChat = async (userId1: string, userId2: string, userName1: string, userName2: string): Promise<string> => {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not initialized. Please set up Firebase environment variables.');
  }

  try {
    const db = getFirebaseDB();
    if (!db) throw new Error('Firebase database not available');
    
    // Check if chat already exists
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', userId1)
    );
    
    const querySnapshot = await getDocs(q);
    
    for (const doc of querySnapshot.docs) {
      const chatData = doc.data() as Chat;
      if (chatData.participants.includes(userId2)) {
        return doc.id;
      }
    }
    
    // Create new chat
    const newChat: Omit<Chat, 'id'> = {
      participants: [userId1, userId2],
      participantNames: {
        [userId1]: userName1,
        [userId2]: userName2
      },
      lastMessageAt: serverTimestamp() as Timestamp,
      unreadCount: {
        [userId1]: 0,
        [userId2]: 0
      },
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp
    };
    
    const docRef = await addDoc(chatsRef, newChat);
    return docRef.id;
  } catch (error) {
    console.error('Error creating/getting chat:', error);
    throw error;
  }
};

// Get all chats for a user
export const getUserChats = async (userId: string): Promise<Chat[]> => {
  if (!isFirebaseAvailable()) {
    return [];
  }

  try {
    const db = getFirebaseDB();
    if (!db) return [];
    
    const chatsRef = collection(db, 'chats');
    
    // Try with orderBy first
    try {
      const q = query(
        chatsRef,
        where('participants', 'array-contains', userId),
        orderBy('lastMessageAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[];
    } catch (indexError) {
      console.warn('Firestore index error, falling back to simple query:', indexError);
      // Fallback to a simpler query without orderBy
      const fallbackQuery = query(
        chatsRef,
        where('participants', 'array-contains', userId)
      );
      
      const querySnapshot = await getDocs(fallbackQuery);
      const chats = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[];
      
      // Sort manually since we can't use orderBy
      chats.sort((a, b) => {
        const aTime = a.lastMessageAt?.toDate?.() || new Date(0);
        const bTime = b.lastMessageAt?.toDate?.() || new Date(0);
        return bTime.getTime() - aTime.getTime();
      });
      
      return chats;
    }
  } catch (error) {
    console.error('Error getting user chats:', error);
    throw error;
  }
};

// Send a message
export const sendMessage = async (chatId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>, currentChatId?: string | null): Promise<void> => {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not initialized. Please set up Firebase environment variables.');
  }

  try {
    const db = getFirebaseDB();
    if (!db) throw new Error('Firebase database not available');
    
    const chatRef = doc(db, 'chats', chatId);
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    
    // Add message to subcollection
    const messageData = {
      ...message,
      timestamp: serverTimestamp()
    };
    
    await addDoc(messagesRef, messageData);
    
    // Update chat with last message and unread count
    const chatDoc = await getDoc(chatRef);
    if (chatDoc.exists()) {
      const chatData = chatDoc.data() as Chat;
      const otherParticipant = chatData.participants.find(id => id !== message.senderId);
      
      if (otherParticipant) {
        // If recipient is currently viewing this chat, set unread count to 0
        // Otherwise, increment the unread count
        const isRecipientViewingChat = currentChatId === chatId;
        
        await updateDoc(chatRef, {
          lastMessage: {
            ...message,
            timestamp: serverTimestamp()
          },
          lastMessageAt: serverTimestamp(),
          unreadCount: {
            ...chatData.unreadCount,
            [otherParticipant]: isRecipientViewingChat 
              ? 0  // Reset to 0 if viewing the chat
              : (chatData.unreadCount[otherParticipant] || 0) + 1  // Increment if not viewing
          },
          updatedAt: serverTimestamp()
        });
      }
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get messages for a chat
export const getChatMessages = async (chatId: string, limitCount: number = 50): Promise<ChatMessage[]> => {
  if (!isFirebaseAvailable()) {
    return [];
  }

  try {
    const db = getFirebaseDB();
    if (!db) return [];
    
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
  } catch (error) {
    console.error('Error getting chat messages:', error);
    throw error;
  }
};

// Get paginated messages for a chat (latest messages first)
export const getChatMessagesPaginated = async (
  chatId: string, 
  limitCount: number = 20, 
  lastMessage?: DocumentSnapshot
): Promise<{ messages: ChatMessage[], lastDoc: DocumentSnapshot | null, hasMore: boolean }> => {
  if (!isFirebaseAvailable()) {
    return { messages: [], lastDoc: null, hasMore: false };
  }

  try {
    const db = getFirebaseDB();
    if (!db) return { messages: [], lastDoc: null, hasMore: false };
    
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    let q = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount + 1) // Get one extra to check if there are more
    );

    // If we have a last message, start after it
    if (lastMessage) {
      q = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        startAfter(lastMessage),
        limit(limitCount + 1)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    const hasMore = docs.length > limitCount;
    
    // Remove the extra doc if we got more than requested
    const messagesToReturn = hasMore ? docs.slice(0, limitCount) : docs;
    const lastDoc = messagesToReturn.length > 0 ? messagesToReturn[messagesToReturn.length - 1] : null;
    
    const messages = messagesToReturn.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
    return { messages, lastDoc, hasMore };
  } catch (error) {
    console.error('Error getting paginated chat messages:', error);
    throw error;
  }
};

// Get older messages for a chat (messages before a specific timestamp)
export const getOlderChatMessages = async (
  chatId: string, 
  limitCount: number = 20, 
  beforeTimestamp?: Timestamp
): Promise<{ messages: ChatMessage[], hasMore: boolean }> => {
  if (!isFirebaseAvailable()) {
    return { messages: [], hasMore: false };
  }

  try {
    const db = getFirebaseDB();
    if (!db) return { messages: [], hasMore: false };
    
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    let q = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount + 1) // Get one extra to check if there are more
    );

    // If we have a before timestamp, get messages before that time
    if (beforeTimestamp) {
      q = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        where('timestamp', '<', beforeTimestamp),
        limit(limitCount + 1)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    const hasMore = docs.length > limitCount;
    
    // Remove the extra doc if we got more than requested
    const messagesToReturn = hasMore ? docs.slice(0, limitCount) : docs;
    
    const messages = messagesToReturn.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
    
    return { messages, hasMore };
  } catch (error) {
    console.error('Error getting older chat messages:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (chatId: string, userId: string): Promise<void> => {
  if (!isFirebaseAvailable()) {
    return;
  }

  try {
    const db = getFirebaseDB();
    if (!db) return;
    
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    
    if (chatDoc.exists()) {
      const chatData = chatDoc.data() as Chat;
      await updateDoc(chatRef, {
        unreadCount: {
          ...chatData.unreadCount,
          [userId]: 0
        },
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

// Real-time listener for new messages only (for live updates)
export const subscribeToNewMessages = (
  chatId: string, 
  callback: (newMessage: ChatMessage) => void
): (() => void) => {
  if (!isFirebaseAvailable()) {
    return () => {};
  }

  const db = getFirebaseDB();
  if (!db) {
    return () => {};
  }
  
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(
    messagesRef,
    orderBy('timestamp', 'desc'),
    limit(1)
  );
  
  let lastMessageId: string | null = null;
  let hasInitialized = false;
  
  return onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      const latestMessage = {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      } as ChatMessage;
      
      // Initialize with the current latest message
      if (!hasInitialized) {
        lastMessageId = latestMessage.id || null;
        hasInitialized = true;
        return;
      }
      
      // Only trigger callback for new messages
      if (latestMessage.id !== lastMessageId) {
        lastMessageId = latestMessage.id || null;
        callback(latestMessage);
      }
    }
  });
};


// Real-time listener for user chats
export const subscribeToUserChats = (
  userId: string,
  callback: (chats: Chat[]) => void
): (() => void) => {
  if (!isFirebaseAvailable()) {
    // Return a no-op unsubscribe function
    return () => {};
  }

  const db = getFirebaseDB();
  if (!db) {
    return () => {};
  }
  
  const chatsRef = collection(db, 'chats');
  // First try with orderBy, if it fails, fall back to just the where clause
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastMessageAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const chats = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Chat[];
    callback(chats);
  }, (error) => {
    console.warn('Firestore index error, falling back to simple query:', error);
    // Fallback to a simpler query without orderBy
    const fallbackQuery = query(
      chatsRef,
      where('participants', 'array-contains', userId)
    );
    
    return onSnapshot(fallbackQuery, (querySnapshot) => {
      const chats = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[];
      // Sort manually since we can't use orderBy
      chats.sort((a, b) => {
        const aTime = a.lastMessageAt?.toDate?.() || new Date(0);
        const bTime = b.lastMessageAt?.toDate?.() || new Date(0);
        return bTime.getTime() - aTime.getTime();
      });
      callback(chats);
    });
  });
};
