import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  type LoginPayload,
  type SignupPayload,
  type User,
} from "@/lib/types";
import { authService } from "@/services/supabase/authService";
import { profileService } from "@/services/supabase/profileService";

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    const profile = await profileService.getByUserId(userId);
    if (profile) setUser(profile);
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const session = await authService.getSession();
        if (session?.user && mounted) {
          await loadProfile(session.user.id);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    const { data: subscription } = authService.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    const { user: authUser } = await authService.signIn(payload);
    if (!authUser) throw new Error("Login failed");
    await loadProfile(authUser.id);
  };

  const signup = async (payload: SignupPayload) => {
    const { user: authUser, session } = await authService.signUp(payload);
    if (!authUser) throw new Error("Signup failed");

    if (!session) {
      const signedIn = await authService.signIn({
        email: payload.email,
        password: payload.password,
      });
      if (!signedIn.user) throw new Error("Signup failed");
      await loadProfile(signedIn.user.id);
      return;
    }

    await loadProfile(authUser.id);
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    const updated = await profileService.update(user.id, {
      name: userData.name,
      email: userData.email,
      username: userData.username,
    });

    setUser(updated);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        updateUser,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
