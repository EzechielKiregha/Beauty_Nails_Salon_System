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
    <div className="min-h-screen py-12 sm:py-24 flex items-center bg-background dark:bg-gray-950">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center mb-4 sm:mb-6"
          >
            <Logo width={250} height={70} />
          </Link>
          <h1 className="text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
            Connexion
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Accédez à votre espace personnel
          </p>
        </div>

        <Card className="p-6 sm:p-8 border-b border-pink-100 dark:border-pink-900 bg-white dark:bg-gray-900 shadow-2xl rounded-3xl">
          <Tabs
            defaultValue="client"
          >
            <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
              <TabsTrigger value="client" className="text-xs sm:text-sm">Client</TabsTrigger>
              <TabsTrigger value="worker" className="text-xs sm:text-sm">Employée</TabsTrigger>
              <TabsTrigger value="admin" className="text-xs sm:text-sm">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="client">
              <form
                onSubmit={(e) => onSubmit(e, "client")}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="dark:text-gray-200">
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
                    className="mt-2 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full py-5 sm:py-6 mt-4 sm:mt-6 text-sm sm:text-base"
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
                  <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="dark:text-gray-200">
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
                    className="mt-2 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 text-white rounded-full py-5 sm:py-6 mt-4 sm:mt-6 text-sm sm:text-base"
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
                  <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="admin@beautynails.cd"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="dark:text-gray-200">
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
                    className="mt-2 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white rounded-full py-5 sm:py-6 mt-4 sm:mt-6 text-sm sm:text-base"
                >
                  {isPending ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 sm:mt-6 text-center">
            <a
              href="#"
              className="text-xs sm:text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300"
            >
              Mot de passe oublié ?
            </a>
          </div>
        </Card>

        <p className="text-center mt-4 sm:mt-6 text-sm sm:text-base text-gray-600 dark:text-gray-300">
          Vous n'avez pas de compte ?{" "}
          <Link
            href="/auth/signup"
            className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}