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
import { toast } from "sonner";
import { useInventory } from "@/lib/hooks/useInventory";

export default function CreateInventoryModal({ triggerLabel = "Créer un article" }: { triggerLabel?: string }) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [cost, setCost] = useState<number | ''>('');
  const [supplier, setSupplier] = useState("");
  const [initialStock, setInitialStock] = useState<number | ''>('');
  const [minStock, setMinStock] = useState<number | ''>('');
  const [maxStock, setMaxStock] = useState<number | ''>('');
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { createItem, isCreatingItem } = useInventory();

  const onSubmit = async () => {
    if (!name || !category || !unit || cost === '') { toast.error("Veuillez remplir le nom, la catégorie, l'unité et le coût"); return; }

    const payload = {
      name,
      sku: sku || undefined,
      category,
      unit,
      cost: Number(cost),
      supplier: supplier || undefined,
      currentStock: initialStock === '' ? undefined : Number(initialStock),
      minStock: minStock === '' ? undefined : Number(minStock),
      maxStock: maxStock === '' ? undefined : Number(maxStock),
      description: description || undefined,
    };

    createItem(payload as any);

    setIsOpen(false);
    setName("");
    setSku("");
    setCategory("");
    setUnit("");
    setCost('');
    setSupplier('');
    setInitialStock('');
    setMinStock('');
    setMaxStock('');
    setDescription('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouvel article d'inventaire</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <Label htmlFor="item-name">Nom</Label>
            <Input id="item-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="item-sku">SKU (optionnel)</Label>
            <Input id="item-sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="ex: VN-RED-001" />
          </div>

          <div>
            <Label htmlFor="item-category">Catégorie</Label>
            <Input id="item-category" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="item-unit">Unité</Label>
            <Input id="item-unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="item-cost">Coût</Label>
            <Input id="item-cost" type="number" value={cost} onChange={(e) => setCost(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>

          <div>
            <Label htmlFor="item-supplier">Fournisseur (optionnel)</Label>
            <Input id="item-supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="item-initial">Stock initial (optionnel)</Label>
            <Input id="item-initial" type="number" value={initialStock} onChange={(e) => setInitialStock(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>

          <div>
            <Label htmlFor="item-min">Stock min (optionnel)</Label>
            <Input id="item-min" type="number" value={minStock} onChange={(e) => setMinStock(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>

          <div>
            <Label htmlFor="item-max">Stock max (optionnel)</Label>
            <Input id="item-max" type="number" value={maxStock} onChange={(e) => setMaxStock(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="item-desc">Description (optionnel)</Label>
            <Textarea id="item-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={isCreatingItem}>{isCreatingItem ? "Création..." : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
