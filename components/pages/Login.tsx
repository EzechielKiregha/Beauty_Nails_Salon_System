import { toast } from "sonner";
import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { Logo } from "../Logo";
import { auth, signIn } from "@/lib/auth/auth";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("client");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>, role: string) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Connexion réussie !');
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
    const session = await auth();
    setTimeout(() => {
      if (!session?.user) {
        redirect('/auth/login');
      }
      if (session?.user.role === role) navigate.push(`/dashboard/${session?.user.role}`);
      router.refresh();
    }, 1500); // Will redirect based on role
  }


  return (
    <div className="min-h-screen py-24 flex items-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center mb-6"
          >
            <Logo width={250} height={70} />
          </Link>
          <h1 className="text-3xl text-gray-900 dark:text-white mb-2">
            Connexion
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Accédez à votre espace personnel
          </p>
        </div>

        <Card className="p-8 border-0 shadow-2xl rounded-3xl">
          <Tabs
            defaultValue="client"
            onValueChange={setUserType}
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="client">Client</TabsTrigger>
              <TabsTrigger value="worker">Employée</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="client">
              <form
                onSubmit={(e) => onSubmit(e, "client")}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="client-email">Email</Label>
                  <Input
                    id="client-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="client-password">
                    Mot de passe
                  </Label>
                  <Input
                    id="client-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="mt-2 rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full py-6 mt-6"
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="worker">
              <form
                onSubmit={(e) => onSubmit(e, "worker")}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="worker-email">Email</Label>
                  <Input
                    id="worker-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="worker-password">
                    Mot de passe
                  </Label>
                  <Input
                    id="worker-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="mt-2 rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 text-white rounded-full py-6 mt-6"
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form
                onSubmit={(e) => onSubmit(e, "admin")}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@beautynails.cd"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="admin-password">
                    Mot de passe
                  </Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="mt-2 rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white rounded-full py-6 mt-6"
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm text-pink-600 hover:text-pink-700"
            >
              Mot de passe oublié ?
            </a>
          </div>
        </Card>

        <p className="text-center mt-6 text-gray-600">
          Vous n'avez pas de compte ?{" "}
          <Link
            href="/signup"
            className="text-pink-600 hover:text-pink-700"
          >
            Créer un compte
          </Link>
        </p>

        <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
          <p className="text-xs text-gray-500 text-center mb-2">
            Comptes de démonstration :
          </p>
          <p className="text-xs text-gray-600 text-center">
            Email : demo@example.com | Mot de passe : demo123
          </p>
        </div>
      </div>
    </div>
  );
}