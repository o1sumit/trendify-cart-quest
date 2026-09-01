import { useState } from "react";
import { Link, useLocation, useNavigate, type Location } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation() as Location & { state?: { from?: { pathname?: string } } };
  const { toast } = useToast();
  const { login } = useUser();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast({
        title: "Missing fields",
        description: "Please enter email and password.",
      });
      return;
    }
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      toast({ title: "Welcome back" });
      const redirectTo = location?.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      toast({
        title: "Login failed",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-10">
      <Card className="w-full max-w-md mx-4 shadow-medium">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="font-display text-2xl tracking-tight">
            Welcome back
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to access your cart, wishlist, and orders.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-4">
            New here?{" "}
            <Link to="/signup" className="text-primary font-medium">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
