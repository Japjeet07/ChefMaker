import { notFound } from 'next/navigation';
import { API_CONFIG } from '../../../constants';
import UserProfileClient from './UserProfileClient';

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

async function getUserProfile(userId: string) {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/users/${userId}`,
      { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch user profile: ${res.status} ${res.statusText}`);
    }

    const response = await res.json();
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch user profile');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

async function getUserPosts(userId: string) {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/users/${userId}/posts`,
      { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch user posts: ${res.status} ${res.statusText}`);
    }

    const response = await res.json();
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch user posts');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return { recipes: [], blogs: [] };
  }
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;
  
  // Validate ObjectId format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    notFound();
  }

  const [userProfile, userPosts] = await Promise.all([
    getUserProfile(id),
    getUserPosts(id)
  ]);

  if (!userProfile) {
    notFound();
  }

  return (
    <UserProfileClient 
      userProfile={userProfile} 
      initialPosts={userPosts}
    />
  );
}
