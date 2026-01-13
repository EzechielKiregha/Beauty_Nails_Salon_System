"use client"
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useServices } from "@/lib/hooks/useServices";
import { toast } from "sonner";

export default function CreateServiceModal({ triggerLabel = "Créer un service" }: { triggerLabel?: string }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<'onglerie' | 'cils' | 'tresses' | 'maquillage' | ''>('');
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [onlineBookable, setOnlineBookable] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { createService, isCreating } = useServices();

  const onSubmit = () => {
    if (!name || !category || !price || !duration) { toast.error("Veuillez renseigner le nom, la catégorie, le prix et la durée"); return; }

    const payload = {
      name,
      category,
      price: Number(price),
      duration: Number(duration),
      description,
      imageUrl: imageUrl || undefined,
      onlineBookable,
      isPopular,
    } as import('@/lib/api/services').CreateServiceData;

    createService(payload);
    setIsOpen(false);
    setName("");
    setCategory('');
    setDescription("");
    setPrice('');
    setDuration('');
    setImageUrl('');
    setOnlineBookable(true);
    setIsPopular(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau service</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <Label htmlFor="service-name">Nom</Label>
            <Input id="service-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="service-category">Catégorie</Label>
            <select id="service-category" className="w-full rounded-md border px-2 py-1" value={category} onChange={(e) => setCategory(e.target.value as any)}>
              <option value="">Sélectionnez une catégorie</option>
              <option value="onglerie">Onglerie</option>
              <option value="cils">Cils</option>
              <option value="tresses">Tresses</option>
              <option value="maquillage">Maquillage</option>
            </select>
          </div>

          <div>
            <Label htmlFor="service-price">Prix (CDF)</Label>
            <Input id="service-price" value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} type="number" />
          </div>

          <div>
            <Label htmlFor="service-duration">Durée (minutes)</Label>
            <Input id="service-duration" value={duration} onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))} type="number" />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="service-desc">Description</Label>
            <Textarea id="service-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="service-image">Image URL (optionnel)</Label>
            <Input id="service-image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={onlineBookable} onChange={(e) => setOnlineBookable(e.target.checked)} />
              <span className="text-sm">Réservable en ligne</span>
            </label>

            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} />
              <span className="text-sm">Mettre en avant (Populaire)</span>
            </label>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={isCreating}>{isCreating ? "Création..." : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
