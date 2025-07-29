"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PriceTier {
  id?: string;
  header_key_col1: string;
  header_key_col2: string;
  participants_key: string;
  price: string;
}

interface ProgramPriceTablesProps {
  priceTables: PriceTier[][];
  setPriceTables: (tables: PriceTier[][]) => void;
}

const ProgramPriceTables: React.FC<ProgramPriceTablesProps> = ({ priceTables, setPriceTables }) => {
  const { t } = useTranslation();

  const handleAddPriceTable = () => {
    setPriceTables([...priceTables, [{ header_key_col1: "", header_key_col2: "", participants_key: "", price: "" }]]);
  };

  const handleRemovePriceTable = (index: number) => {
    const newPriceTables = priceTables.filter((_, i) => i !== index);
    setPriceTables(newPriceTables);
  };

  const handlePriceTierChange = (tableIndex: number, rowIndex: number, field: keyof PriceTier, value: string) => {
    const newPriceTables = [...priceTables];
    newPriceTables[tableIndex][rowIndex] = { ...newPriceTables[tableIndex][rowIndex], [field]: value };
    setPriceTables(newPriceTables);
  };

  const handleAddPriceTierRow = (tableIndex: number) => {
    const newPriceTables = [...priceTables];
    newPriceTables[tableIndex] = [...newPriceTables[tableIndex], { header_key_col1: "", header_key_col2: "", participants_key: "", price: "" }];
    setPriceTables(newPriceTables);
  };

  const handleRemovePriceTierRow = (tableIndex: number, rowIndex: number) => {
    const newPriceTables = [...priceTables];
    newPriceTables[tableIndex] = newPriceTables[tableIndex].filter((_, i) => i !== rowIndex);
    setPriceTables(newPriceTables);
  };

  return (
    <>
      <Separator className="my-6" />
      <h3 className="text-lg font-semibold mb-4">{t('price tables')}</h3>
      {priceTables.map((table, tableIndex) => (
        <Card key={tableIndex} className="p-4 mb-4 border border-border">
          <div className="flex justify-end mb-2">
            <Button variant="destructive" size="sm" onClick={() => handleRemovePriceTable(tableIndex)}>
              <MinusCircle className="h-4 w-4 mr-2" /> {t('remove table button')}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label>{t('header column 1 label')}</Label>
              <Input
                value={table[0]?.header_key_col1 || ""}
                onChange={(e) => handlePriceTierChange(tableIndex, 0, 'header_key_col1', e.target.value)}
                placeholder={t('header column 1 placeholder')}
              />
            </div>
            <div>
              <Label>{t('header column 2 label')}</Label>
              <Input
                value={table[0]?.header_key_col2 || ""}
                onChange={(e) => handlePriceTierChange(tableIndex, 0, 'header_key_col2', e.target.value)}
                placeholder={t('header column 2 placeholder')}
              />
            </div>
          </div>
          {table.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2 mb-2">
              <Input
                placeholder={t('participants key placeholder')}
                value={row.participants_key}
                onChange={(e) => handlePriceTierChange(tableIndex, rowIndex, 'participants_key', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder={t('price value placeholder')}
                value={row.price}
                onChange={(e) => handlePriceTierChange(tableIndex, rowIndex, 'price', e.target.value)}
                className="flex-1"
              />
              <Button variant="destructive" size="icon" onClick={() => handleRemovePriceTierRow(tableIndex, rowIndex)}>
                <MinusCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => handleAddPriceTierRow(tableIndex)} className="mt-2">
            <PlusCircle className="h-4 w-4 mr-2" /> {t('add row button')}
          </Button>
        </Card>
      ))}
      <Button type="button" variant="secondary" onClick={handleAddPriceTable}>
        <PlusCircle className="h-4 w-4 mr-2" /> {t('add price table button')}
      </Button>
    </>
  );
};

export default ProgramPriceTables;