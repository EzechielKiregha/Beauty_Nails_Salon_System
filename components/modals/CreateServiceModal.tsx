"use client"
import { useState, useEffect } from "react";
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
import { useServices, useAddOnMutations } from "@/lib/hooks/useServices";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { PlusCircle, MinusCircle } from 'lucide-react';

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
  const [showAddOnFlow, setShowAddOnFlow] = useState(false);
  const [createdServiceId, setCreatedServiceId] = useState<string | null>(null);
  const [addOns, setAddOns] = useState([
    { name: '', price: '', duration: '' as number | '' }
  ]);

  const { createService, isCreating, createdService } = useServices();
  const { createAddOn, isCreatingAddOn } = useAddOnMutations();

  const onSubmit = () => {
    if (!name || !category || !price || !duration) {
      toast.error("Veuillez renseigner le nom, la catégorie, le prix et la durée");
      return;
    }

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
  };

  // Handle service creation success
  useEffect(() => {

    if (createdService) {
      setCreatedServiceId(createdService.service.id);
      setShowAddOnFlow(true);
    }
  }, [createdService]);

  // Handle add-on submission
  const handleAddOnSubmit = () => {
    const validAddOns = addOns.filter(addOn =>
      addOn.name.trim() !== '' &&
      addOn.price !== '' &&
      addOn.duration !== ''
    );

    if (validAddOns.length === 0) {
      toast.error("Aucun add-on valide à ajouter");
      return;
    }

    // Submit all valid add-ons
    validAddOns.forEach((addOn) => {
      createAddOn({
        serviceId: createdServiceId!,
        name: addOn.name,
        price: Number(addOn.price),
        duration: Number(addOn.duration),
        description: ''
      });
    });

    // Close the modal and reset
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setCategory('');
    setDescription("");
    setPrice('');
    setDuration('');
    setImageUrl('');
    setOnlineBookable(true);
    setIsPopular(false);
    setAddOns([{ name: '', price: '', duration: '' }]);
    setShowAddOnFlow(false);
    setCreatedServiceId(null);
  };

  const addAddOnField = () => {
    setAddOns([...addOns, { name: '', price: '', duration: '' }]);
  };

  const removeAddOnField = (index: number) => {
    if (addOns.length > 1) {
      const newAddOns = [...addOns];
      newAddOns.splice(index, 1);
      setAddOns(newAddOns);
    }
  };

  const updateAddOnField = (index: number, field: keyof typeof addOns[0], value: any) => {
    const newAddOns = [...addOns];
    newAddOns[index][field] = value;
    setAddOns(newAddOns);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!showAddOnFlow ? (
          <>
            <DialogHeader>
              <DialogTitle>Créer un nouveau service</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="service-name">Nom</Label>
                <Input
                  id="service-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Manucure complète"
                />
              </div>

              <div>
                <Label htmlFor="service-category">Catégorie</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as any)}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onglerie">
                      💅 Onglerie
                    </SelectItem>
                    <SelectItem value="cils">
                      👁️ Cils
                    </SelectItem>
                    <SelectItem value="tresses">
                      💇‍♀️ Tresses
                    </SelectItem>
                    <SelectItem value="maquillage">
                      💄 Maquillage
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="service-price">Prix (Fc)</Label>
                <Input
                  id="service-price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  type="number"
                  placeholder="Ex: 15000"
                />
              </div>

              <div>
                <Label htmlFor="service-duration">Durée (minutes)</Label>
                <Input
                  id="service-duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
                  type="number"
                  placeholder="Ex: 60"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="service-desc">Description</Label>
                <Textarea
                  id="service-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez le service..."
                />
              </div>

              <div>
                <Label htmlFor="service-image">Image URL (optionnel)</Label>
                <Input
                  id="service-image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={onlineBookable}
                    onChange={(e) => setOnlineBookable(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Réservable en ligne</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Mettre en avant (Populaire)</span>
                </label>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button
                onClick={onSubmit}
                disabled={isCreating}
              >
                {isCreating ? "Création..." : "Créer"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          // Add-on creation flow
          <>
            <DialogHeader>
              <DialogTitle>Ajouter des add-ons pour "{name}"</DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ajoutez des éléments complémentaires à ce service pour augmenter sa valeur
              </p>
            </DialogHeader>

            <div className="py-4 space-y-4">
              {addOns.map((addOn, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Nom de l'add-on</Label>
                      <Input
                        value={addOn.name}
                        onChange={(e) => updateAddOnField(index, 'name', e.target.value)}
                        placeholder="Ex: Gel coloré"
                      />
                    </div>
                    <div>
                      <Label>Prix (Fc)</Label>
                      <Input
                        type="number"
                        value={addOn.price}
                        onChange={(e) => updateAddOnField(index, 'price', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ex: 5000"
                      />
                    </div>
                    <div>
                      <Label>Durée (min)</Label>
                      <Input
                        type="number"
                        value={addOn.duration}
                        onChange={(e) => updateAddOnField(index, 'duration', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ex: 15"
                      />
                    </div>
                  </div>

                  {addOns.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-red-500 hover:text-red-700"
                      onClick={() => removeAddOnField(index)}
                    >
                      <MinusCircle className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addAddOnField}
                className="w-full"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter un autre add-on
              </Button>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Passer
                </Button>
              </DialogClose>
              <Button
                onClick={handleAddOnSubmit}
                disabled={isCreatingAddOn}
                className="w-full sm:w-auto bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isCreatingAddOn ? "Ajout..." : "Ajouter les add-ons"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}