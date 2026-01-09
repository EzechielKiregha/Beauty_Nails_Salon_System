"use client"

import { toast } from "sonner";
import { useState, useTransition } from "react";
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
import { Logo } from "../Logo";
import { handleLogin } from "@/app/(auth)/auth/login/actions";
import { useRouter } from "next/navigation";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>, role: string) {
    e.preventDefault();
    startTransition(async () => {
      const result = await handleLogin(new FormData(e.currentTarget), role);
      if (result?.success) {
        toast.success('Connecté avec succès');
        router.push(result.redirectUrl);
        router.refresh();
      }
      else {
        toast.error(result.error);
      }
    }
    )
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
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
                  {isPending ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="worker">
              <form
                onSubmit={(e) => onSubmit(e, "worker")}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
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
                  {isPending ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form
                onSubmit={(e) => onSubmit(e, "admin")}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="admin@beautynails.cd"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
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
                  {isPending ? 'Connexion...' : 'Se connecter'}
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
            href="/auth/signup"
            className="text-pink-600 hover:text-pink-700"
          >
            Créer un compte
          </Link>
        </p>

        {/* <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
          <p className="text-xs text-gray-500 text-center mb-2">
            Comptes de démonstration :
          </p>
          <p className="text-xs text-gray-600 text-center">
            Email : demo@example.com | Mot de passe : demo123
          </p>
        </div> */}
      </div>
    </div>
  );
}